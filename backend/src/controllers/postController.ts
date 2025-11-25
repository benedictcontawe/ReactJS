import { Request, Response } from 'express';
import { getAllPosts as getAllPostsFromSeeder, getPostById as getPostByIdFromSeeder, generatePostId, dummyPosts, type Post } from '../seeders/postSeeder';

/**
 * Retrieves all blog posts.
 * Returns all posts from the dummy data seeder.
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
    const posts = getAllPostsFromSeeder();
    console.log(`[POSTS] Retrieved ${posts.length} posts`);
    res.status(200).json({ data: posts });
  } catch (error) {
    console.error('[POSTS] getAllPosts error:', error);
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
};

/**
 * Retrieves a single blog post by ID.
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
    const post = getPostByIdFromSeeder(id);
    if (!post) {
      console.warn(`[POSTS] Post not found: ${id}`);
      return res.status(404).json({ error: 'Post not found' });
    }
    console.log(`[POSTS] Retrieved post: ${id}`);
    res.status(200).json({ data: post });
  } catch (error) {
    console.error('[POSTS] getPostById error:', error);
    res.status(500).json({ error: 'Failed to retrieve post' });
  }
};

/**
 * Creates a new blog post.
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
 * Response: { "data": { "id": "1234567890", "name": "New Post", ... } }
 */
export const createPost = async (req: Request, res: Response) => {
  try {
    const { name, image_name, image_url } = req.body;
    if (!name || !image_name || !image_url) {
      console.warn('[POSTS] Missing required fields for post creation');
      return res.status(400).json({ error: 'Missing required fields: name, image_name, image_url' });
    }
    const newPost: Post = {
      id: generatePostId(),
      name,
      image_name,
      image_url
    };
    // Add to dummy posts array (in-memory)
    dummyPosts.unshift(newPost); // Add to beginning
    console.log(`[POSTS] Created new post: ${newPost.id} - ${newPost.name}`);
    res.status(201).json({ data: newPost });
  } catch (error) {
    console.error('[POSTS] createPost error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

/**
 * Updates an existing blog post.
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
    const postIndex = dummyPosts.findIndex(post => post.id === id);
    if (postIndex === -1) {
      console.warn(`[POSTS] Post not found for update: ${id}`);
      return res.status(404).json({ error: 'Post not found' });
    }
    const updatedPost: Post = {
      id,
      name,
      image_name,
      image_url
    };
    dummyPosts[postIndex] = updatedPost;
    console.log(`[POSTS] Updated post: ${id} - ${updatedPost.name}`);
    res.status(200).json({ data: updatedPost });
  } catch (error) {
    console.error('[POSTS] updatePost error:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

/**
 * Deletes a blog post by ID.
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
    const postIndex = dummyPosts.findIndex(post => post.id === id);
    if (postIndex === -1) {
      console.warn(`[POSTS] Post not found for deletion: ${id}`);
      return res.status(404).json({ error: 'Post not found' });
    }
    const deletedPost = dummyPosts[postIndex];
    dummyPosts.splice(postIndex, 1);
    console.log(`[POSTS] Deleted post: ${id} - ${deletedPost.name}`);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('[POSTS] deletePost error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};