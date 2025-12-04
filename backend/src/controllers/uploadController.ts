import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Get upload directory from environment or use default
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const IMAGES_DIR = path.join(UPLOAD_DIR, 'images');

// Ensure upload directories exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log(`[UPLOAD] Created upload directory: ${UPLOAD_DIR}`);
}

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  console.log(`[UPLOAD] Created images directory: ${IMAGES_DIR}`);
}

// Configure multer for disk storage
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMAGES_DIR);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
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
  storage: multerStorage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // Default 5MB
  },
  fileFilter: fileFilter,
});

// Middleware for single file upload
export const uploadMiddleware = upload.single('image');

/**
 * Handles image file upload to local storage.
 * Accepts a single image file and saves it to the uploads/images directory.
 * 
 * @param req - Express request object containing the uploaded file
 * @param req.file - The uploaded file object from multer
 * @param res - Express response object
 * @returns JSON response with status 200 containing image_name and image_url
 * @throws Will return status 400 if no file is provided
 * @throws Will return status 500 if an error occurs during upload
 * 
 * @example
 * POST /api/upload
 * FormData: { "image": <file> }
 * Response: { "image_name": "photo-1234567890.jpg", "image_url": "/uploads/images/photo-1234567890.jpg" }
 */
export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      console.warn('[UPLOAD] No file provided');
      return res.status(400).json({ error: 'No file provided' });
    }
    const file = req.file;
    const imageName = file.filename;
    const imageUrl = `/uploads/images/${imageName}`;
    console.log(`[UPLOAD] File uploaded to local storage: ${imageName} (${(file.size / 1024).toFixed(2)} KB)`);
    console.log(`[UPLOAD] File path: ${file.path}`);

    res.status(200).json({
      image_name: imageName,
      image_url: imageUrl,
    });
  } catch (error: any) {
    console.error('[UPLOAD] uploadImage error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}