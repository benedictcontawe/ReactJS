import admin from 'firebase-admin';
// Note: dotenv.config() is called in server.ts before this file is imported
// No need to call it again here

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    // Option 1: Use service account key file (recommended for production)
    // const serviceAccount = require('../../path/to/serviceAccountKey.json');
    // admin.initializeApp({
    //   credential: admin.credential.cert(serviceAccount)
    // });

    // Option 2: Use environment variables (for development)
    // You'll need to set these in .env file:
    // FIREBASE_PROJECT_ID=your-project-id
    // FIREBASE_PRIVATE_KEY=your-private-key
    // FIREBASE_CLIENT_EMAIL=your-client-email
    
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const privateKeyEnv = process.env.FIREBASE_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    
    if (projectId && privateKeyEnv && clientEmail) {
      console.log('[FIREBASE ADMIN] Attempting to initialize with environment variables...');
      console.log('[FIREBASE ADMIN] Project ID:', projectId);
      console.log('[FIREBASE ADMIN] Client Email:', clientEmail);
      console.log('[FIREBASE ADMIN] Private Key present:', !!privateKeyEnv);
      
      // Clean up the private key (handle both escaped and unescaped newlines)
      const privateKey = privateKeyEnv
        .replace(/\\n/g, '\n')
        .replace(/"/g, '');
      
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId,
          privateKey: privateKey,
          clientEmail: clientEmail,
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
      });
      console.log('[FIREBASE ADMIN] ✓ Successfully initialized with environment variables');
    } else {
      // Fallback: Initialize with default credentials (for local development)
      // This requires GOOGLE_APPLICATION_CREDENTIALS environment variable
      console.log('[FIREBASE ADMIN] Environment variables not found, attempting default credentials...');
      console.log('[FIREBASE ADMIN] GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS || 'not set');
      
      admin.initializeApp();
      console.log('[FIREBASE ADMIN] ✓ Successfully initialized with default credentials');
    }
  } catch (error: any) {
    console.error('[FIREBASE ADMIN] ✗ Initialization error:', error);
    console.error('[FIREBASE ADMIN] Error code:', error.code);
    console.error('[FIREBASE ADMIN] Error message:', error.message);
    console.error('[FIREBASE ADMIN] Error stack:', error.stack);
    
    // Don't throw - let the app start but log the error
    // This way we can see what's wrong without crashing
    console.error('[FIREBASE ADMIN] Firebase Admin failed to initialize. Check your credentials.');
  }
}

// Export Firestore and Storage instances
// Check if admin is initialized before exporting
let db: admin.firestore.Firestore;
let storage: admin.storage.Storage;
let auth: admin.auth.Auth;

try {
  db = admin.firestore();
  storage = admin.storage();
  auth = admin.auth();
  console.log('[FIREBASE ADMIN] ✓ Services (Firestore, Storage, Auth) initialized');
} catch (error: any) {
  console.error('[FIREBASE ADMIN] ✗ Failed to initialize services:', error);
  console.error('[FIREBASE ADMIN] Make sure Firebase Admin is properly initialized');
  // Create dummy objects to prevent crashes, but they won't work
  // This allows the app to start and show proper error messages
  throw new Error('Firebase Admin services not available. Check initialization.');
}

export { db, storage, auth };
export default admin;