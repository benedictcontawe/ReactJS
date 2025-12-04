import jwt from 'jsonwebtoken';

/**
 * JWT service for token generation and verification.
 * Uses jsonwebtoken library to create and verify JWT tokens.
 */

/**
 * Payload interface for JWT tokens.
 */
export interface JWTPayload {
  userId: string;
  email: string;
}

/**
 * Generates a JWT token for a user.
 * 
 * @param userId - The user's ID (MongoDB ObjectId)
 * @param email - The user's email address
 * @returns The generated JWT token
 * 
 * @example
 * const token = generateToken(user._id.toString(), user.email);
 */
export const generateToken = (userId: string, email: string): string => {
  const payload: JWTPayload = {
    userId,
    email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Verifies and decodes a JWT token.
 * 
 * @param token - The JWT token to verify
 * @returns The decoded token payload if valid
 * @throws Error if token is invalid or expired
 * 
 * @example
 * try {
 *   const payload = verifyToken(token);
 *   console.log('User ID:', payload.userId);
 * } catch (error) {
 *   console.error('Invalid token');
 * }
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
    return decoded;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

/**
 * Decodes a JWT token without verification (use with caution).
 * Useful for extracting information from expired tokens.
 * 
 * @param token - The JWT token to decode
 * @returns The decoded token payload (not verified)
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    return null;
  }
};