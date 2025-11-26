import { Request, Response } from 'express';
import { db } from '../config/firebaseAdmin';
import admin from 'firebase-admin';

// Collection name: 'object'
// Firestore automatically creates collections when first document is added
const POSTS_COLLECTION = 'object';

/**
 * Post interface matching Firestore document structure
 */
export interface Post {
  id: string;
  name: string;
  image_name: string;
  image_url: string;
}

/**
 * Retrieves all blog posts from Firestore.
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
    console.log(`[POSTS] Querying collection "${POSTS_COLLECTION}"...`);
    console.log(`[POSTS] Using Firestore instance:`, db ? 'initialized' : 'NOT initialized');    
    // Direct query - matches Flutter app: dbFirestore.collection("object").get()
    const postsSnapshot = await db.collection(POSTS_COLLECTION).get();    
    console.log(`[POSTS] Query returned ${postsSnapshot.size} documents`);
    console.log(`[POSTS] Query empty: ${postsSnapshot.empty}`);    
    const posts: Post[] = [];    
    if (postsSnapshot.empty) {
      console.log(`[POSTS] Collection "${POSTS_COLLECTION}" is empty (no documents found)`);
    } else {
      postsSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`[POSTS] Processing document ${doc.id}:`, {
          exists: doc.exists,
          hasData: !!data,
          fields: Object.keys(data || {}),
          name: data?.name,
          image_name: data?.image_name,
          image_url: data?.image_url,
          rawData: data
        });        
        // Map fields exactly as Flutter app does:
        // Flutter: name from Constants.NAME, icon from Constants.IMAGE_URL, file from Constants.IMAGE_NAME
        posts.push({
          id: doc.id,
          name: data?.name || '',
          image_name: data?.image_name || '',
          image_url: data?.image_url || '',
        } as Post);
      });
    }
    console.log(`[POSTS] Retrieved ${posts.length} documents from Firestore collection "${POSTS_COLLECTION}"`);
    if (posts.length > 0) {
      console.log(`[POSTS] Successfully retrieved ${posts.length} documents. Document IDs:`, posts.map(p => p.id));
      console.log(`[POSTS] Sample post:`, posts[0]);
    }    
    res.status(200).json({ data: posts });
  } catch (error: any) {
    console.error('[POSTS] getAllPosts error:', error);
    console.error('[POSTS] Error code:', error.code);
    console.error('[POSTS] Error message:', error.message);
    console.error('[POSTS] Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to retrieve posts',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Retrieves a single blog post by ID from Firestore.
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
    const postDoc = await db.collection(POSTS_COLLECTION).doc(id).get();
    if (!postDoc.exists) {
      console.warn(`[POSTS] Post not found: ${id}`);
      return res.status(404).json({ error: 'Post not found' });
    }
    const post: Post = {
      id: postDoc.id,
      ...postDoc.data()
    } as Post;
    console.log(`[POSTS] Retrieved post: ${id}`);
    res.status(200).json({ data: post });
  } catch (error) {
    console.error('[POSTS] getPostById error:', error);
    res.status(500).json({ error: 'Failed to retrieve post' });
  }
};

/**
 * Creates a new blog post in Firestore.
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
 * Response: { "data": { "id": "firestore-id", "name": "New Post", ... } }
 */
export const createPost = async (req: Request, res: Response) => {
  try {
    const { name, image_name, image_url } = req.body;
    if (!name || !image_name || !image_url) {
      console.warn('[POSTS] Missing required fields for post creation');
      return res.status(400).json({ error: 'Missing required fields: name, image_name, image_url' });
    }
    const postData = {
      name,
      image_name,
      image_url,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    // Firestore automatically creates the collection if it doesn't exist
    const docRef = await db.collection(POSTS_COLLECTION).add(postData);
    // Fetch the created document to get the actual data (including timestamps)
    const createdDoc = await docRef.get();
    const createdData = createdDoc.data();
    const newPost: Post = {
      id: docRef.id,
      name: createdData?.name || name,
      image_name: createdData?.image_name || image_name,
      image_url: createdData?.image_url || image_url,
    } as Post;
    console.log(`[POSTS] Created new document in collection "${POSTS_COLLECTION}": ${docRef.id} - ${name}`);
    console.log(`[POSTS] Collection "${POSTS_COLLECTION}" now has documents (created automatically if it was empty)`);
    console.log(`[POSTS] Created post data:`, newPost);
    res.status(201).json({ data: newPost });
  } catch (error) {
    console.error('[POSTS] createPost error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

/**
 * Updates an existing blog post in Firestore.
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
    const postRef = db.collection(POSTS_COLLECTION).doc(id);
    const postDoc = await postRef.get();
    if (!postDoc.exists) {
      console.warn(`[POSTS] Post not found for update: ${id}`);
      return res.status(404).json({ error: 'Post not found' });
    }
    const updateData = {
      name,
      image_name,
      image_url,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await postRef.update(updateData);
    const updatedPost: Post = {
      id,
      ...updateData
    } as Post;
    console.log(`[POSTS] Updated post: ${id} - ${name}`);
    res.status(200).json({ data: updatedPost });
  } catch (error) {
    console.error('[POSTS] updatePost error:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

/**
 * Deletes a blog post by ID from Firestore.
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
    const postRef = db.collection(POSTS_COLLECTION).doc(id);
    const postDoc = await postRef.get();
    if (!postDoc.exists) {
      console.warn(`[POSTS] Post not found for deletion: ${id}`);
      return res.status(404).json({ error: 'Post not found' });
    }
    const postData = postDoc.data();
    await postRef.delete();
    console.log(`[POSTS] Deleted post: ${id} - ${postData?.name || 'Unknown'}`);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('[POSTS] deletePost error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};