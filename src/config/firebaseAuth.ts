import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

/**
 * Firebase Auth configuration for client-side authentication.
 * This follows Firebase's best practice: verify passwords on client, send ID tokens to backend.
 * 
 * Required environment variables:
 * - VITE_FIREBASE_API_KEY: Your Firebase Web API key
 * - VITE_FIREBASE_PROJECT_ID: Your Firebase project ID
 * - VITE_FIREBASE_AUTH_DOMAIN: Your Firebase Auth domain (optional, defaults to project-id.firebaseapp.com)
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

// Initialize Firebase only if not already initialized
let app;
if (getApps().length === 0) {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('[FIREBASE AUTH] Missing required environment variables:');
    console.error('[FIREBASE AUTH] - VITE_FIREBASE_API_KEY:', firebaseConfig.apiKey ? '✓' : '✗ MISSING');
    console.error('[FIREBASE AUTH] - VITE_FIREBASE_PROJECT_ID:', firebaseConfig.projectId ? '✓' : '✗ MISSING');
    throw new Error('Firebase Auth configuration is incomplete. Please set VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID in your .env file.');
  }
  app = initializeApp(firebaseConfig);
  console.log('[FIREBASE AUTH] ✓ Initialized with project:', firebaseConfig.projectId);
} else {
  app = getApps()[0];
}

// Initialize Auth
export const auth = getAuth(app);
export default app;