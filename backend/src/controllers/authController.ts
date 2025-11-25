import { Request, Response } from 'express';
import { activeTokens } from '../middleware/authMiddleware';
import { getUserById, getUserByEmail, dummyUsers } from '../seeders/userSeeder';
import { generateDummyToken } from '../services/jwtservice';

/**
 * Registers a new user account.
 * Dummy implementation: Always succeeds without validation.
 * Generates a dummy token and returns user data.
 * 
 * @param req - Express request object containing email and password in body
 * @param req.body.email - User's email address (optional, uses default if not provided)
 * @param req.body.password - User's password (not validated in dummy implementation)
 * @param res - Express response object
 * @returns JSON response with status 201 containing token and user object
 * @throws Will return status 500 if an error occurs during registration
 * 
 * @example
 * POST /api/auth/register
 * Body: { "email": "user@example.com", "password": "password123" }
 * Response: { "token": "dummy_token_1_1234567890", "user": { "id": "1", "email": "user@example.com", "name": "Test User" } }
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Dummy: Always succeed, no validation
    // Use first user as default, or find by email
    const user = getUserByEmail(email) || dummyUsers[0];
    const token = generateDummyToken(user.id);
    
    // Store token in activeTokens (for middleware to check)
    activeTokens.set(token, {
      userId: user.id,
      email: email || user.email
    });

    // Return dummy response
    console.log(`[AUTH] User registered: ${email || user.email}`);
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: email || user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('[AUTH] Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

/**
 * Authenticates a user and logs them in.
 * Dummy implementation: Always succeeds without credential validation.
 * Generates a dummy token and returns user data.
 * 
 * @param req - Express request object containing email and password in body
 * @param req.body.email - User's email address (optional, uses default if not provided)
 * @param req.body.password - User's password (not validated in dummy implementation)
 * @param res - Express response object
 * @returns JSON response with status 200 containing token and user object
 * @throws Will return status 500 if an error occurs during login
 * 
 * @example
 * POST /api/auth/login
 * Body: { "email": "user@example.com", "password": "password123" }
 * Response: { "token": "dummy_token_1_1234567890", "user": { "id": "1", "email": "user@example.com", "name": "Test User" } }
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Dummy: Always succeed, no credential validation
    // Try to find user by email, or use first user
    const user = getUserByEmail(email) || dummyUsers[0];
    const token = generateDummyToken(user.id);
    
    // Store token in activeTokens
    activeTokens.set(token, {
      userId: user.id,
      email: email || user.email
    });

    // Return dummy response
    console.log(`[AUTH] User logged in: ${email || user.email}`);
    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: email || user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('[AUTH] Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

/**
 * Logs out the current user by invalidating their token.
 * Removes the token from activeTokens storage.
 * 
 * @param req - Express request object containing Authorization header with Bearer token
 * @param req.headers.authorization - Bearer token in format "Bearer <token>"
 * @param res - Express response object
 * @returns JSON response with status 200 and success message
 * @throws Will return status 500 if an error occurs during logout
 * 
 * @example
 * POST /api/auth/logout
 * Headers: { "Authorization": "Bearer dummy_token_1_1234567890" }
 * Response: { "message": "Logged out successfully" }
 */
export const logout = async (req: Request, res: Response) => {
  try {
    // Get token from request (set by middleware if authenticated)
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (token) {
      // Remove token from active tokens
      activeTokens.delete(token);
      console.log('[AUTH] User logged out, token removed');
    } else {
      console.warn('[AUTH] Logout attempted without token');
    }

    // Always succeed
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('[AUTH] Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};

/**
 * Retrieves the currently authenticated user's information.
 * Validates the token and returns the associated user data.
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
 * Headers: { "Authorization": "Bearer dummy_token_1_1234567890" }
 * Response: { "user": { "id": "1", "email": "user@example.com", "name": "Test User" } }
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // Get token from request
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      console.warn('[AUTH] getCurrentUser: No token provided');
      return res.status(401).json({ error: 'No token provided' });
    }

    // Check if token exists
    const tokenData = activeTokens.get(token);
    
    if (!tokenData) {
      console.warn('[AUTH] getCurrentUser: Invalid token');
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user from seeder
    const user = getUserById(tokenData.userId) || dummyUsers[0];

    console.log(`[AUTH] Current user retrieved: ${tokenData.email}`);
    // Return dummy user
    res.status(200).json({
      user: {
        id: user.id,
        email: tokenData.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('[AUTH] getCurrentUser error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};