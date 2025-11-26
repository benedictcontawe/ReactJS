import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../.env');// Load .env file FIRST with explicit path (before any other imports that use env vars)
dotenv.config({ path: envPath });

if (process.env.NODE_ENV !== 'production') {// Debug: Log env var status (only in development)
  console.log('[ENV] Loading .env from:', envPath);
  console.log('[ENV] FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✓ Found' : '✗ Missing');
  console.log('[ENV] FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✓ Found' : '✗ Missing');
  console.log('[ENV] FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✓ Found' : '✗ Missing');
}

import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import admin from 'firebase-admin';
import './config/firebaseAdmin';// Initialize Firebase Admin (import triggers initialization - env vars are now loaded)
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
      description: 'Simple dummy backend API for learning and blueprint',
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

// Diagnostic endpoint to check Firebase Admin status
app.get('/api/health/firebase', async (req, res) => {
  try {
    const status: any = {
      initialized: admin.apps.length > 0,
      appCount: admin.apps.length,
      envVars: {
        hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
        hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
        hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
        hasStorageBucket: !!process.env.FIREBASE_STORAGE_BUCKET,
        projectId: process.env.FIREBASE_PROJECT_ID || 'not set',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'not set',
      }
    };
    
    // Try to test auth if initialized
    if (status.initialized) {
      try {
        const auth = admin.auth();
        status.authTest = 'OK';
      } catch (authError: any) {
        status.authTest = `ERROR: ${authError.message}`;
      }
    }
    
    res.json({
      status: status.initialized ? 'OK' : 'ERROR',
      message: status.initialized 
        ? 'Firebase Admin is initialized' 
        : 'Firebase Admin is NOT initialized. Check your .env file and credentials.',
      details: status
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'ERROR',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[SERVER] Unhandled error:', err);
  console.error('[SERVER] Error stack:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  console.log(`[swagger]: API docs available at http://localhost:${port}/api-docs`);
});