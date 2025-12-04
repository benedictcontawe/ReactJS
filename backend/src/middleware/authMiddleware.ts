import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/jwtservice';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

/**
 * Authentication middleware that verifies JWT tokens.
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
): Promise<void> => {
  try {
    // 1. Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('[AUTH MIDDLEWARE] No authorization token provided');
      res.status(401).json({ error: 'No authorization token provided' });
      return;
    }

    // 2. Extract token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.warn('[AUTH MIDDLEWARE] No token provided');
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    try {
      // 3. Verify JWT token
      const decoded = verifyToken(token);
      
      // 4. Attach user info to request
      req.userId = decoded.userId;
      req.userEmail = decoded.email;

      console.log(`[AUTH MIDDLEWARE] Authenticated user: ${decoded.email} (ID: ${decoded.userId}) for ${req.method} ${req.path}`);
      
      // 5. Continue to next middleware/controller
      next();
    } catch (verifyError: any) {
      // Token verification failed
      console.warn('[AUTH MIDDLEWARE] Invalid or expired token:', verifyError.message);
      res.status(401).json({ error: verifyError.message || 'Invalid or expired token' });
      return;
    }
  } catch (error: any) {
    console.error('[AUTH MIDDLEWARE] Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
    return;
  }
};