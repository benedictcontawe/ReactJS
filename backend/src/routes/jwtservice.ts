import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

interface JwtPayload {
  userId: string;
  email: string;
}

/**
 * Generates a JWT token for a user.
 * @param userId The user's ID.
 * @param email The user's email.
 * @returns The generated JWT token.
 */
export const generateToken = (userId: string, email: string): string => {
  const payload: JwtPayload = { userId, email };
  return jwt.sign(payload, JWT_SECRET!, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verifies a JWT token.
 * @param token The JWT token to verify.
 * @returns The decoded payload if the token is valid.
 * @throws Will throw an error if the token is invalid or expired.
 */
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET!) as JwtPayload;
};