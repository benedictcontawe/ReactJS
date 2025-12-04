import bcrypt from 'bcryptjs';

/**
 * Hashes a plain-text password using bcrypt.
 * @param password The plain-text password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compares a plain-text password with a hashed password.
 * @param plainPassword The plain-text password from user input.
 * @param hashedPassword The hashed password from the database.
 * @returns A promise that resolves to true if the passwords match, false otherwise.
 */
export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};