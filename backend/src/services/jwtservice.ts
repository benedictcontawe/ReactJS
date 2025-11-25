/**
 * Generates a dummy token for development/testing purposes.
 * In production, this would be replaced with JWT token generation.
 * 
 * @param userId - The user ID to include in the token
 * @returns A dummy token string
 */
export const generateDummyToken = (userId: string): string => {
  return `dummy_token_${userId}_${Date.now()}`;
};