import { Request, Response } from 'express';
import { Post } from '../models/Post';

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, coverImage } = req.body;
    const author = req.userId;

    const newPost = new Post({ title, content, coverImage, author });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to create post', details: error.message });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate('author', 'name').sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch posts', details: error.message });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch post', details: error.message });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { title, content, coverImage } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'User not authorized to update this post' });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, coverImage },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedPost);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to update post', details: error.message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'User not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete post', details: error.message });
  }
};