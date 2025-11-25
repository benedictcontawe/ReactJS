import { Router } from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} from '../controllers/postController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// All posts routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "1"
 *                       name:
 *                         type: string
 *                         example: First Blog Post
 *                       image_name:
 *                         type: string
 *                         example: image1.jpg
 *                       image_url:
 *                         type: string
 *                         example: https://via.placeholder.com/300
 *       500:
 *         description: Failed to retrieve posts
 */
router.get('/', getAllPosts);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *         example: "1"
 *     responses:
 *       200:
 *         description: Post found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     image_name:
 *                       type: string
 *                     image_url:
 *                       type: string
 *       404:
 *         description: Post not found
 *       500:
 *         description: Failed to retrieve post
 */
router.get('/:id', getPostById);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - image_name
 *               - image_url
 *             properties:
 *               name:
 *                 type: string
 *                 example: My New Post
 *               image_name:
 *                 type: string
 *                 example: image.jpg
 *               image_url:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     image_name:
 *                       type: string
 *                     image_url:
 *                       type: string
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Failed to create post
 */
router.post('/', createPost);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - image_name
 *               - image_url
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Post Name
 *               image_name:
 *                 type: string
 *                 example: new-image.jpg
 *               image_url:
 *                 type: string
 *                 example: https://example.com/new-image.jpg
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Post not found
 *       500:
 *         description: Failed to update post
 */
router.put('/:id', updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *         example: "1"
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post deleted successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Failed to delete post
 */
router.delete('/:id', deletePost);

export default router;