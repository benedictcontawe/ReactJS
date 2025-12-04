import { Request, Response } from 'express';
import { User } from '../models/User';
import { hashPassword, comparePassword } from '../services/passwordService';
import { generateToken } from '../services/jwtservice';

/**
 * Registers a new user account.
 * Creates a user in MongoDB with hashed password and returns JWT token.
 * 
 * @param req - Express request object containing email and password in body
 * @param req.body.email - User's email address
 * @param req.body.password - User's chosen password
 * @param req.body.name - User's display name (optional, defaults to email prefix)
 * @param res - Express response object
 * @returns JSON response with status 201 containing token and user object
 * @throws Will return status 400 if email already exists or invalid input
 * @throws Will return status 500 if an error occurs during registration
 * 
 * @example
 * POST /api/auth/register
 * Body: { "email": "user@example.com", "password": "password123", "name": "John Doe" }
 * Response: { "token": "jwt-token", "user": { "id": "userId", "email": "user@example.com", "name": "John Doe" } }
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name || email.split('@')[0], // Use email prefix as default name
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email);

    console.log(`[AUTH] User registered: ${user.email} (ID: ${user._id})`);

    res.status(201).json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error('[AUTH] Registration error:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }

    res.status(500).json({ 
      error: 'Registration failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Authenticates a user and logs them in.
 * Verifies email and password, then returns JWT token.
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
 * Response: { "token": "jwt-token", "user": { "id": "userId", "email": "user@example.com", "name": "John Doe" } }
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Find user by email (include password field)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      console.warn(`[AUTH] Login attempt with non-existent email: ${email}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      console.warn(`[AUTH] Login attempt with wrong password for: ${email}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email);

    console.log(`[AUTH] User logged in: ${user.email} (ID: ${user._id})`);

    res.status(200).json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error('[AUTH] Login error:', error);
    res.status(500).json({ 
      error: 'Login failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Logs out the current user.
 * Note: JWT tokens are stateless, so logout is handled client-side.
 * This endpoint can be used for server-side logging/audit purposes.
 * 
 * @param req - Express request object containing Authorization header with Bearer token
 * @param req.headers.authorization - Bearer token in format "Bearer <token>"
 * @param res - Express response object
 * @returns JSON response with status 200 and success message
 * 
 * @example
 * POST /api/auth/logout
 * Headers: { "Authorization": "Bearer jwt-token" }
 * Response: { "message": "Logged out successfully" }
 */
export const logout = async (req: Request, res: Response) => {
  try {
    // JWT tokens are stateless, so logout is primarily client-side
    // This endpoint is for logging/audit purposes
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    
    if (token) {
      console.log('[AUTH] User logged out (token provided)');
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
 * Verifies the JWT token and returns user data from MongoDB.
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
 * Headers: { "Authorization": "Bearer jwt-token" }
 * Response: { "user": { "id": "userId", "email": "user@example.com", "name": "John Doe" } }
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // This endpoint should be protected by authMiddleware
    // The userId should be attached to req by the middleware
    const userId = (req as any).userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Find user in database
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`[AUTH] Current user retrieved: ${user.email} (ID: ${user._id})`);

    res.status(200).json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error('[AUTH] getCurrentUser error:', error);
    res.status(500).json({ 
      error: 'Failed to get user',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};