import { Request, Response, NextFunction } from 'express';

// Shared tokens store (move to separate file later)
export const activeTokens = new Map<string, { userId: string; email: string }>();

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

export const authMiddleware = (
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

    // 3. Check if token exists in active tokens
    const tokenData = activeTokens.get(token);
    
    if (!tokenData) {
      console.warn('[AUTH MIDDLEWARE] Invalid or expired token');
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // 4. Attach user info to request
    req.userId = tokenData.userId;
    req.userEmail = tokenData.email;

    console.log(`[AUTH MIDDLEWARE] Authenticated user: ${tokenData.email} for ${req.method} ${req.path}`);
    // 5. Continue
    next();
  } catch (error) {
    console.error('[AUTH MIDDLEWARE] Authentication error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};