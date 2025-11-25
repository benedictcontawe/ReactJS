import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
// Configure multer for file uploads
const storage = multer.diskStorage({ 
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/images';    
    if (!fs.existsSync(uploadPath)) {// Create directory if it doesn't exist
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {// Generate unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});
// File filter - only allow images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};
// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});
// Middleware for single file upload
export const uploadMiddleware = upload.single('image');

/**
 * Handles image file upload.
 * Accepts a single image file and returns the file URL.
 * 
 * @param req - Express request object containing the uploaded file
 * @param req.file - The uploaded file object from multer
 * @param req.body.path - Optional path parameter (not used in dummy implementation)
 * @param res - Express response object
 * @returns JSON response with status 200 containing image_name and image_url
 * @throws Will return status 400 if no file is provided
 * @throws Will return status 500 if an error occurs during upload
 * 
 * @example
 * POST /api/upload
 * FormData: { "image": <file>, "path": "images" }
 * Response: { "image_name": "photo-1234567890.jpg", "image_url": "http://localhost:3000/uploads/images/photo-1234567890.jpg" }
 */
export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      console.warn('[UPLOAD] No file provided');
      return res.status(400).json({ error: 'No file provided' });
    }
    const file = req.file;
    const imageName = file.filename;
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/images/${imageName}`;
    console.log(`[UPLOAD] File uploaded: ${imageName} (${(file.size / 1024).toFixed(2)} KB)`);    
    res.status(200).json({
      image_name: imageName,
      image_url: imageUrl
    });
  } catch (error) {
    console.error('[UPLOAD] uploadImage error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};