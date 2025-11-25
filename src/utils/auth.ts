import { authAPI } from '../network/api-client';

/**
 * User interface representing the authenticated user.
 * This matches the user object returned from the backend API.
 */
export interface User {  
  id: string;/** Unique identifier for the user */  
  email: string;/** User's email address */  
  name: string;/** User's display name */
}

/**
 * Key used to store the authentication token in localStorage.
 * This token is used to authenticate API requests.
 */
const TOKEN_KEY = 'auth_token';

/**
 * Retrieves the authentication token from localStorage.
 * @returns The authentication token string, or null if no token exists.
 */
const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Stores the authentication token in localStorage.
 * This token will be automatically included in API requests via axios interceptors.
 * @param token - The authentication token to store.
 */
const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Removes the authentication token from localStorage.
 * This is called when the user logs out or when authentication fails.
 */
const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Registers a new user account with the backend.
 * Sends a POST request to /api/auth/register with email and password.
 * Automatically stores the returned authentication token.
 * 
 * @param email - The user's email address.
 * @param password - The user's chosen password.
 * @returns A Promise that resolves to the newly created User object.
 * @throws Will throw an error if registration fails (e.g., email already exists, invalid input).
 * 
 * @example
 * ```typescript
 * try {
 *   const user = await createUser('user@example.com', 'password123');
 *   console.log('User registered:', user);
 * } catch (error) {
 *   console.error('Registration failed:', error);
 * }
 * ```
 */
export const createUser = async (email: string, password: string): Promise<User> => {
  const response = await authAPI.register(email, password);
  setToken(response.data.token);
  return response.data.user;
};

/**
 * Authenticates an existing user and logs them in.
 * Sends a POST request to /api/auth/login with email and password.
 * Automatically stores the returned authentication token.
 * 
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A Promise that resolves to the authenticated User object.
 * @throws Will throw an error if login fails (e.g., invalid credentials).
 * 
 * @example
 * ```typescript
 * try {
 *   const user = await login('user@example.com', 'password123');
 *   console.log('Login successful:', user);
 * } catch (error) {
 *   console.error('Login failed:', error);
 * }
 * ```
 */
export const login = async (email: string, password: string): Promise<User> => {
  const response = await authAPI.login(email, password);
  setToken(response.data.token);
  return response.data.user;
};

/**
 * Logs out the current user.
 * Sends a POST request to /api/auth/logout to invalidate the session on the backend.
 * Removes the authentication token from localStorage, regardless of whether the API call succeeds.
 * 
 * @returns A Promise that resolves when logout is complete.
 * 
 * @example
 * ```typescript
 * await logout();
 * // User is now logged out and token is removed
 * ```
 */
export const logout = async (): Promise<void> => {
  try {
    await authAPI.logout();
  } finally {
    // Always remove token, even if API call fails
    removeToken();
  }
};

/**
 * Retrieves the currently authenticated user from the backend.
 * Sends a GET request to /api/auth/me with the stored authentication token.
 * If no token exists or the request fails, returns null and removes the invalid token.
 * 
 * @returns A Promise that resolves to the current User object, or null if not authenticated.
 * 
 * @example
 * ```typescript
 * const user = await getCurrentUser();
 * if (user) {
 *   console.log('User is logged in:', user.email);
 * } else {
 *   console.log('User is not logged in');
 * }
 * ```
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = getToken();
    if (!token) return null;

    const response = await authAPI.getCurrentUser();
    return response.data.user;
  } catch {
    // If request fails (e.g., token expired), remove invalid token
    removeToken();
    return null;
  }
};

/**
 * Sets up a callback to be notified when the authentication state changes.
 * Immediately checks the current authentication state and calls the callback.
 * Returns a cleanup function (currently a no-op, but included for API consistency).
 * 
 * Note: This is a simplified implementation. For real-time auth state changes,
 * you would need to implement polling or WebSocket connections.
 * 
 * @param callback - A function that will be called with the current user (or null if not authenticated).
 * @returns A cleanup function that can be called to unsubscribe (currently a no-op).
 * 
 * @example
 * ```typescript
 * const unsubscribe = onAuthStateChange((user) => {
 *   if (user) {
 *     console.log('User logged in:', user.email);
 *   } else {
 *     console.log('User logged out');
 *   }
 * });
 * 
 * // Later, cleanup (optional)
 * unsubscribe();
 * ```
 */
export const onAuthStateChange = (callback: (user: User | null) => void): (() => void) => {
  // Immediately check current auth state
  getCurrentUser().then(callback);
  // Return cleanup function (no-op for now, but maintains API consistency)
  return () => {};
};