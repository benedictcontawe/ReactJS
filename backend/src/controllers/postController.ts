import { Request, Response } from 'express';
import { Post } from '../models/Post';

/**
 * Post interface matching MongoDB document structure
 */
export interface PostResponse {
  id: string;
  name: string;
  image_name: string;
  image_url: string;
}

/**
 * Retrieves all blog posts from MongoDB.
 * Posts are sorted by creation date (newest first).
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON response with status 200 containing array of posts
 * @throws Will return status 500 if an error occurs
 * 
 * @example
 * GET /api/posts
 * Response: { "data": [{ "id": "1", "name": "First Blog Post", ... }] }
 */
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    console.log('[POSTS] Querying MongoDB collection "posts"...');
    
    // Find all posts, sorted by createdAt (newest first)
    const posts = await Post.find().sort({ createdAt: -1 });
    
    console.log(`[POSTS] Query returned ${posts.length} documents`);
    
    // Map to response format
    const postsResponse: PostResponse[] = posts.map((post) => ({
      id: post._id.toString(),
      name: post.name,
      image_name: post.image_name,
      image_url: post.image_url,
    }));

    if (posts.length === 0) {
      console.log('[POSTS] Collection "posts" is empty');
    } else {
      console.log(`[POSTS] Successfully retrieved ${posts.length} documents. Document IDs:`, postsResponse.map(p => p.id));
    }
    
    res.status(200).json({ data: postsResponse });
  } catch (error: any) {
    console.error('[POSTS] getAllPosts error:', error);
    console.error('[POSTS] Error message:', error.message);
    console.error('[POSTS] Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to retrieve posts',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Retrieves a single blog post by ID from MongoDB.
 * 
 * @param req - Express request object
 * @param req.params.id - The ID of the post to retrieve
 * @param res - Express response object
 * @returns JSON response with status 200 containing the post object
 * @throws Will return status 404 if post is not found
 * @throws Will return status 500 if an error occurs
 * 
 * @example
 * GET /api/posts/1
 * Response: { "data": { "id": "1", "name": "First Blog Post", ... } }
 */
export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findById(id);
    
    if (!post) {
      console.warn(`[POSTS] Post not found: ${id}`);
      return res.status(404).json({ error: 'Post not found' });
    }

    const postResponse: PostResponse = {
      id: post._id.toString(),
      name: post.name,
      image_name: post.image_name,
      image_url: post.image_url,
    };

    console.log(`[POSTS] Retrieved post: ${id}`);
    res.status(200).json({ data: postResponse });
  } catch (error: any) {
    console.error('[POSTS] getPostById error:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid post ID format' });
    }
    
    res.status(500).json({ 
      error: 'Failed to retrieve post',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Creates a new blog post in MongoDB.
 * 
 * @param req - Express request object containing post data in body
 * @param req.body.name - The name/title of the post
 * @param req.body.image_name - The name of the image file
 * @param req.body.image_url - The URL of the image
 * @param res - Express response object
 * @returns JSON response with status 201 containing the created post
 * @throws Will return status 400 if required fields are missing
 * @throws Will return status 500 if an error occurs
 * 
 * @example
 * POST /api/posts
 * Body: { "name": "New Post", "image_name": "image.jpg", "image_url": "https://..." }
 * Response: { "data": { "id": "mongodb-id", "name": "New Post", ... } }
 */
export const createPost = async (req: Request, res: Response) => {
  try {
    const { name, image_name, image_url } = req.body;
    
    if (!name || !image_name || !image_url) {
      console.warn('[POSTS] Missing required fields for post creation');
      return res.status(400).json({ error: 'Missing required fields: name, image_name, image_url' });
    }

    // Create new post
    const post = new Post({
      name,
      image_name,
      image_url,
    });

    await post.save();

    const postResponse: PostResponse = {
      id: post._id.toString(),
      name: post.name,
      image_name: post.image_name,
      image_url: post.image_url,
    };

    console.log(`[POSTS] Created new post in collection "posts": ${post._id} - ${name}`);
    console.log(`[POSTS] Created post data:`, postResponse);
    
    res.status(201).json({ data: postResponse });
  } catch (error: any) {
    console.error('[POSTS] createPost error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    
    res.status(500).json({ 
      error: 'Failed to create post',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Updates an existing blog post in MongoDB.
 * 
 * @param req - Express request object
 * @param req.params.id - The ID of the post to update
 * @param req.body.name - The updated name/title of the post
 * @param req.body.image_name - The updated image name
 * @param req.body.image_url - The updated image URL
 * @param res - Express response object
 * @returns JSON response with status 200 containing the updated post
 * @throws Will return status 404 if post is not found
 * @throws Will return status 400 if required fields are missing
 * @throws Will return status 500 if an error occurs
 * 
 * @example
 * PUT /api/posts/1
 * Body: { "name": "Updated Post", "image_name": "new-image.jpg", "image_url": "https://..." }
 * Response: { "data": { "id": "1", "name": "Updated Post", ... } }
 */
export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, image_name, image_url } = req.body;
    
    if (!name || !image_name || !image_url) {
      console.warn('[POSTS] Missing required fields for post update');
      return res.status(400).json({ error: 'Missing required fields: name, image_name, image_url' });
    }

    // Find and update post
    const post = await Post.findByIdAndUpdate(
      id,
      {
        name,
        image_name,
        image_url,
      },
      { new: true, runValidators: true } // Return updated document and run validators
    );

    if (!post) {
      console.warn(`[POSTS] Post not found for update: ${id}`);
      return res.status(404).json({ error: 'Post not found' });
    }

    const postResponse: PostResponse = {
      id: post._id.toString(),
      name: post.name,
      image_name: post.image_name,
      image_url: post.image_url,
    };

    console.log(`[POSTS] Updated post: ${id} - ${name}`);
    res.status(200).json({ data: postResponse });
  } catch (error: any) {
    console.error('[POSTS] updatePost error:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid post ID format' });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    
    res.status(500).json({ 
      error: 'Failed to update post',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Deletes a blog post by ID from MongoDB.
 * 
 * @param req - Express request object
 * @param req.params.id - The ID of the post to delete
 * @param res - Express response object
 * @returns JSON response with status 200 containing success message
 * @throws Will return status 404 if post is not found
 * @throws Will return status 500 if an error occurs
 * 
 * @example
 * DELETE /api/posts/1
 * Response: { "message": "Post deleted successfully" }
 */
export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      console.warn(`[POSTS] Post not found for deletion: ${id}`);
      return res.status(404).json({ error: 'Post not found' });
    }

    console.log(`[POSTS] Deleted post: ${id} - ${post.name}`);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error: any) {
    console.error('[POSTS] deletePost error:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid post ID format' });
    }
    
    res.status(500).json({ 
      error: 'Failed to delete post',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};