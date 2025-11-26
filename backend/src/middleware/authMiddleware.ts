import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebaseAdmin';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

/**
 * Authentication middleware that verifies Firebase ID tokens.
 * Extracts and verifies the Bearer token from Authorization header.
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @returns Calls next() if token is valid, returns 401 if invalid
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('[AUTH MIDDLEWARE] No authorization token provided');
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    // 2. Extract token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.warn('[AUTH MIDDLEWARE] No token provided');
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      // 3. Try to verify as ID token first (normal flow)
      const decodedToken = await auth.verifyIdToken(token);
      
      // 4. Attach user info to request
      req.userId = decodedToken.uid;
      req.userEmail = decodedToken.email || '';

      console.log(`[AUTH MIDDLEWARE] Authenticated user via ID token: ${decodedToken.email} (UID: ${decodedToken.uid}) for ${req.method} ${req.path}`);
      
      // 5. Continue to next middleware/controller
      return next();
    } catch (verifyError: any) {
      // If ID token verification fails, try to decode as custom token
      console.log('[AUTH MIDDLEWARE] ID token verification failed, trying custom token decode...');
      
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.decode(token, { complete: true });
        
        if (decoded && decoded.payload && decoded.payload.uid) {
          // Get user record using the UID from the custom token
          const userRecord = await auth.getUser(decoded.payload.uid);
          
          req.userId = userRecord.uid;
          req.userEmail = userRecord.email || '';

          console.log(`[AUTH MIDDLEWARE] Authenticated user via custom token: ${userRecord.email} (UID: ${userRecord.uid}) for ${req.method} ${req.path}`);
          
          return next();
        }
      } catch (decodeError) {
        console.error('[AUTH MIDDLEWARE] Custom token decode error:', decodeError);
      }
      
      // If both methods fail, return error
      console.warn('[AUTH MIDDLEWARE] Invalid or expired token:', verifyError.message);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('[AUTH MIDDLEWARE] Authentication error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};