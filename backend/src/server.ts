import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../.env');// Load .env file FIRST with explicit path (before any other imports that use env vars)
dotenv.config({ path: envPath });

if (process.env.NODE_ENV !== 'production') {// Debug: Log env var status (only in development)  
  console.log('[ENV] Loading .env from:', envPath);
  console.log('[ENV] MONGODB_URI:', process.env.MONGODB_URI ? '✓ Found' : '✗ Missing');
  console.log('[ENV] JWT_SECRET:', process.env.JWT_SECRET ? '✓ Found' : '✗ Missing');
  console.log('[ENV] JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN || '7d (default)');
  console.log('[ENV] UPLOAD_DIR:', process.env.UPLOAD_DIR || './uploads (default)');
}

// --- Environment Variable Validation ---
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error('[FATAL ERROR] Missing required environment variables. Check your .env file.');
  process.exit(1); // Exit the process with an error code
}

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { connectMongoDB } from './config/mongodb';
import authRoutes from './routes/auth';
import uploadRoutes from './routes/upload';
import postsRoutes from './routes/posts';

const app = express();
const port = process.env.PORT || 3000;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'Blog API with MongoDB Atlas and JWT authentication',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to API route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/posts', postsRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Blog API Server is running' });
});

// Diagnostic endpoint to check MongoDB connection status
app.get('/api/health/mongodb', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const status: any = {
      connected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState,
      readyStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
      database: mongoose.connection.db?.databaseName || 'not connected',
      host: mongoose.connection.host || 'not connected',
      envVars: {
        hasMongoDBUri: !!process.env.MONGODB_URI,
        mongoDBUri: process.env.MONGODB_URI ? '***hidden***' : 'not set',
      },
    };

    res.json({
      status: status.connected ? 'OK' : 'ERROR',
      message: status.connected
        ? 'MongoDB is connected'
        : 'MongoDB is NOT connected. Check your MONGODB_URI in .env file.',
      details: status,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'ERROR',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[SERVER] Unhandled error:', err);
  console.error('[SERVER] Error stack:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectMongoDB();
    
    // Start server
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
      console.log(`[swagger]: API docs available at http://localhost:${port}/api-docs`);
      console.log(`[mongodb]: MongoDB connection established`);
    });
  } catch (error) {
    console.error('[SERVER] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();