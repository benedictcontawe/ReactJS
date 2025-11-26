import { Request, Response } from 'express';
import { auth } from '../config/firebaseAdmin';

/**
 * Registers a new user account using Firebase Admin Auth.
 * Creates a user in Firebase Authentication.
 * 
 * @param req - Express request object containing email and password in body
 * @param req.body.email - User's email address
 * @param req.body.password - User's chosen password
 * @param res - Express response object
 * @returns JSON response with status 201 containing token and user object
 * @throws Will return status 400 if email already exists or invalid input
 * @throws Will return status 500 if an error occurs during registration
 * 
 * @example
 * POST /api/auth/register
 * Body: { "email": "user@example.com", "password": "password123" }
 * Response: { "token": "firebase-id-token", "user": { "id": "uid", "email": "user@example.com", "name": "User" } }
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, idToken } = req.body;
    
    if (!auth) {// Check if auth is initialized
      console.error('[AUTH] Firebase Auth not initialized');
      return res.status(500).json({ error: 'Authentication service not available' });
    }
    
    // Option 1: If client sends ID token (BEST PRACTICE - user already created in Firebase Auth)
    if (idToken) {
      try {
        const decodedToken = await auth.verifyIdToken(idToken);
        const userRecord = await auth.getUser(decodedToken.uid);
        console.log(`[AUTH] User registered with ID token: ${userRecord.email} (UID: ${userRecord.uid})`);        
        return res.status(201).json({
          token: idToken, // Return the same ID token
          user: {
            id: userRecord.uid,
            email: userRecord.email || '',
            name: userRecord.displayName || userRecord.email?.split('@')[0] || 'User',
          }
        });
      } catch (tokenError: any) {
        console.error('[AUTH] ID token verification error:', tokenError);
        return res.status(401).json({ error: 'Invalid token' });
      }
    }
    
    // Option 2: Legacy email/password (for backward compatibility)
    // Note: This is NOT the best practice. Client should use Firebase Auth SDK first.
    if (!email || !password) {
      console.warn('[AUTH] Missing email, password, or idToken for registration');
      return res.status(400).json({ 
        error: 'Email and password are required, or provide idToken',
        hint: 'For best practice, use Firebase Auth SDK on client to create user and get idToken, then send it here'
      });
    }
    
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: email.split('@')[0], // Use email prefix as default name
    });
    // Generate custom token (can be exchanged for ID token on client)
    const customToken = await auth.createCustomToken(userRecord.uid);
    console.log(`[AUTH] User registered: ${email} (UID: ${userRecord.uid})`);    
    res.status(201).json({
      token: customToken, // Note: Client should exchange this for ID token
      user: {
        id: userRecord.uid,
        email: userRecord.email || email,
        name: userRecord.displayName || email.split('@')[0],
      }
    });
  } catch (error: any) {
    console.error('[AUTH] Registration error:', error);
    console.error('[AUTH] Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });    
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'Email already registered' });
    }
    if (error.code === 'auth/invalid-email') {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    if (error.code === 'auth/weak-password') {
      return res.status(400).json({ error: 'Password is too weak' });
    }    
    res.status(500).json({ 
      error: 'Registration failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Authenticates a user and logs them in using Firebase Admin Auth.
 * Verifies credentials and returns user data with token.
 * 
 * Note: In a real implementation, you'd verify the password on the client side
 * using Firebase Auth SDK, then send the ID token to backend for verification.
 * This is a simplified backend-only approach.
 * 
 * @param req - Express request object containing email and password in body
 * @param req.body.email - User's email address
 * @param req.body.password - User's password
 * @param res - Express response object
 * @returns JSON response with status 200 containing token and user object
 * @throws Will return status 401 if credentials are invalid
 * @throws Will return status 500 if an error occurs during login
 * 
 * @example
 * POST /api/auth/login
 * Body: { "email": "user@example.com", "password": "password123" }
 * Response: { "token": "firebase-id-token", "user": { "id": "uid", "email": "user@example.com", "name": "User" } }
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, idToken } = req.body;
    // Check if auth is initialized
    if (!auth) {
      console.error('[AUTH] Firebase Auth not initialized');
      return res.status(500).json({ error: 'Authentication service not available' });
    }
    // Option 1: If client sends ID token (recommended approach)
    if (idToken) {
      try {
        const decodedToken = await auth.verifyIdToken(idToken);
        const userRecord = await auth.getUser(decodedToken.uid);
        console.log(`[AUTH] User logged in with ID token: ${userRecord.email} (UID: ${userRecord.uid})`);        
        return res.status(200).json({
          token: idToken, // Return the same ID token
          user: {
            id: userRecord.uid,
            email: userRecord.email || '',
            name: userRecord.displayName || userRecord.email?.split('@')[0] || 'User',
          }
        });
      } catch (tokenError: any) {
        console.error('[AUTH] ID token verification error:', tokenError);
        return res.status(401).json({ error: 'Invalid token' });
      }
    }
    // Option 2: Legacy email/password approach - REJECTED for security
    // Password verification MUST happen on client side with Firebase Auth SDK
    // Backend cannot verify passwords directly
    if (email || password) {
      console.error('[AUTH] SECURITY: Email/password login rejected. Use Firebase Auth SDK on client to get ID token.');
      return res.status(400).json({ 
        error: 'Email/password login not supported. Please use Firebase Auth SDK on client to verify password and get ID token.',
        hint: 'Client should call signInWithEmailAndPassword() from Firebase Auth SDK, then send the ID token here'
      });
    }
    
    // If no idToken and no email/password, return error
    console.warn('[AUTH] Missing idToken for login');
    return res.status(400).json({ 
      error: 'ID token is required for login',
      hint: 'Use Firebase Auth SDK on client to sign in and get ID token, then send it here'
    });
  } catch (error: any) {
    console.error('[AUTH] Login error:', error);
    console.error('[AUTH] Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });    
    if (error.code === 'auth/user-not-found') {
      return res.status(401).json({ error: 'Invalid email or password' });
    }    
    res.status(500).json({ 
      error: 'Login failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Logs out the current user.
 * Note: Firebase tokens are stateless, so logout is handled client-side.
 * This endpoint can be used for server-side session cleanup if needed.
 * 
 * @param req - Express request object containing Authorization header with Bearer token
 * @param req.headers.authorization - Bearer token in format "Bearer <token>"
 * @param res - Express response object
 * @returns JSON response with status 200 and success message
 * 
 * @example
 * POST /api/auth/logout
 * Headers: { "Authorization": "Bearer firebase-id-token" }
 * Response: { "message": "Logged out successfully" }
 */
export const logout = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (token) {
      try {
        // Verify token and revoke if needed
        const decodedToken = await auth.verifyIdToken(token);
        // Optionally revoke all tokens for this user
        // await auth.revokeRefreshTokens(decodedToken.uid);
        console.log(`[AUTH] User logged out: ${decodedToken.email} (UID: ${decodedToken.uid})`);
      } catch (error) {
        // Token might be invalid, but still return success
        console.warn('[AUTH] Logout with invalid token');
      }
    } else {
      console.warn('[AUTH] Logout attempted without token');
    }
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('[AUTH] Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};

/**
 * Retrieves the currently authenticated user's information.
 * Verifies the Firebase ID token and returns user data.
 * 
 * @param req - Express request object containing Authorization header with Bearer token
 * @param req.headers.authorization - Bearer token in format "Bearer <token>"
 * @param res - Express response object
 * @returns JSON response with status 200 containing user object
 * @throws Will return status 401 if no token is provided or token is invalid
 * @throws Will return status 500 if an error occurs
 * 
 * @example
 * GET /api/auth/me
 * Headers: { "Authorization": "Bearer firebase-id-token" }
 * Response: { "user": { "id": "uid", "email": "user@example.com", "name": "User" } }
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) {
      console.warn('[AUTH] getCurrentUser: No token provided');
      return res.status(401).json({ error: 'No token provided' });
    }
    try {
      // Try to verify as ID token first (normal flow)
      const decodedToken = await auth.verifyIdToken(token);      
      // Get user record for additional info
      const userRecord = await auth.getUser(decodedToken.uid);
      console.log(`[AUTH] Current user retrieved via ID token: ${userRecord.email} (UID: ${userRecord.uid})`);      
      return res.status(200).json({
        user: {
          id: userRecord.uid,
          email: userRecord.email || '',
          name: userRecord.displayName || userRecord.email?.split('@')[0] || 'User',
        }
      });
    } catch (verifyError: any) {
      // If ID token verification fails, try to decode as custom token
      // Custom tokens are JWTs that contain user info but can't be verified with verifyIdToken
      // We'll extract user info from the token payload
      console.log('[AUTH] ID token verification failed, trying custom token decode...');      
      try {
        // Decode JWT without verification (custom tokens can't be verified with verifyIdToken)
        const jwt = require('jsonwebtoken');
        const decoded = jwt.decode(token, { complete: true });        
        if (decoded && decoded.payload && decoded.payload.uid) {
          // Get user record using the UID from the custom token
          const userRecord = await auth.getUser(decoded.payload.uid);          
          console.log(`[AUTH] Current user retrieved via custom token: ${userRecord.email} (UID: ${userRecord.uid})`);          
          return res.status(200).json({
            user: {
              id: userRecord.uid,
              email: userRecord.email || '',
              name: userRecord.displayName || userRecord.email?.split('@')[0] || 'User',
            }
          });
        }
      } catch (decodeError) {
        console.error('[AUTH] Custom token decode error:', decodeError);
      }
      
      // If both methods fail, return error
      console.error('[AUTH] getCurrentUser error:', verifyError);      
      if (verifyError.code === 'auth/id-token-expired' || verifyError.code === 'auth/argument-error') {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }      
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error: any) {
    console.error('[AUTH] getCurrentUser unexpected error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};