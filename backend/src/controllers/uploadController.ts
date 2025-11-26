import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { storage } from '../config/firebaseAdmin';

// Configure multer for temporary file storage (before uploading to Firebase)
const multerStorage = multer.memoryStorage();

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
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Middleware for single file upload
export const uploadMiddleware = upload.single('image');

/**
 * Handles image file upload to Firebase Storage.
 * Accepts a single image file and uploads it to Firebase Storage.
 * 
 * @param req - Express request object containing the uploaded file
 * @param req.file - The uploaded file object from multer
 * @param req.body.path - Optional path parameter for organizing files in Storage
 * @param res - Express response object
 * @returns JSON response with status 200 containing image_name and image_url
 * @throws Will return status 400 if no file is provided
 * @throws Will return status 500 if an error occurs during upload
 * 
 * @example
 * POST /api/upload
 * FormData: { "image": <file>, "path": "images" }
 * Response: { "image_name": "photo-1234567890.jpg", "image_url": "https://firebasestorage.googleapis.com/..." }
 */
export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      console.warn('[UPLOAD] No file provided');
      return res.status(400).json({ error: 'No file provided' });
    }
    const file = req.file;
    const pathParam = req.body.path || 'images';    
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const fileName = `${pathParam}/${name}-${uniqueSuffix}${ext}`;
    // Get Firebase Storage bucket
    const bucket = storage.bucket();
    const fileUpload = bucket.file(fileName);
    // Upload file to Firebase Storage
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });
    stream.on('error', (error) => {
      console.error('[UPLOAD] Firebase Storage upload error:', error);
      res.status(500).json({ error: 'Failed to upload image to Firebase Storage' });
    });
    stream.on('finish', async () => {
      try {
        // Make file publicly accessible
        await fileUpload.makePublic();
        // Get public URL
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        const imageName = fileName.split('/').pop() || fileName;
        console.log(`[UPLOAD] File uploaded to Firebase Storage: ${fileName} (${(file.size / 1024).toFixed(2)} KB)`);        
        res.status(200).json({
          image_name: imageName,
          image_url: imageUrl
        });
      } catch (error) {
        console.error('[UPLOAD] Error making file public:', error);
        res.status(500).json({ error: 'Failed to get image URL' });
      }
    });
    // Write file buffer to stream
    stream.end(file.buffer);
  } catch (error) {
    console.error('[UPLOAD] uploadImage error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};