import { Router } from 'express';
import { uploadImage, uploadMiddleware } from '../controllers/uploadController';
import { authMiddleware } from '../middleware/authMiddleware'; // Protect upload route

const router = Router();

router.post('/', authMiddleware, uploadMiddleware, uploadImage);

export default router;