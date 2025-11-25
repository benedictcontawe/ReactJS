import { Router } from 'express';
import { uploadImage, uploadMiddleware } from '../controllers/uploadController';
import { authMiddleware } from '../middleware/authMiddleware'; // Protect upload route

const router = Router();

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload an image file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (jpeg, jpg, png, gif, webp)
 *               path:
 *                 type: string
 *                 description: Optional path parameter
 *                 example: images
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 image_name:
 *                   type: string
 *                   example: photo-1234567890.jpg
 *                 image_url:
 *                   type: string
 *                   example: http://localhost:3000/uploads/images/photo-1234567890.jpg
 *       400:
 *         description: No file provided or invalid file type
 *       500:
 *         description: Failed to upload image
 */
router.post('/', authMiddleware, uploadMiddleware, uploadImage);

export default router;