import bcrypt from 'bcryptjs';

/**
 * Service for password hashing and verification using bcrypt.
 * Follows security best practices for password storage.
 */

/**
 * Hashes a plain text password using bcrypt.
 * 
 * @param password - The plain text password to hash
 * @returns Promise that resolves to the hashed password
 * 
 * @example
 * const hashedPassword = await hashPassword('myPassword123');
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Number of salt rounds (higher = more secure but slower)
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compares a plain text password with a hashed password.
 * 
 * @param password - The plain text password to verify
 * @param hashedPassword - The hashed password to compare against
 * @returns Promise that resolves to true if passwords match, false otherwise
 * 
 * @example
 * const isValid = await comparePassword('myPassword123', hashedPassword);
 * if (isValid) {
 *   // Password is correct
 * }
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};