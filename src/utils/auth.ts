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
 * Registers a new user account.
 * Sends email and password to backend, which handles password hashing and user creation.
 * 
 * @param email - The user's email address.
 * @param password - The user's chosen password.
 * @param name - The user's display name (optional).
 * @returns A Promise that resolves to the newly created User object.
 * @throws Will throw an error if registration fails (e.g., email already exists, invalid input).
 * 
 * @example
 * ```typescript
 * try {
 *   const user = await createUser('user@example.com', 'password123', 'John Doe');
 *   console.log('User registered:', user);
 * } catch (error) {
 *   console.error('Registration failed:', error);
 * }
 * ```
 */
export const createUser = async (email: string, password: string, name?: string): Promise<User> => {
  const response = await authAPI.register(email, password, name);
  setToken(response.data.token);
  return response.data.user;
};

/**
 * Authenticates an existing user and logs them in.
 * Sends email and password to backend, which verifies credentials and returns JWT token.
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
 * Removes the token from localStorage and optionally notifies the backend.
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
    await authAPI.logout(); // Optional: Notify backend
  } catch (error) {
    console.warn('[AUTH] Backend logout notification failed:', error);
  }
  removeToken(); // Always remove token from localStorage
};

/**
 * Retrieves the currently authenticated user's information.
 * Sends JWT token to backend, which verifies it and returns user data.
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
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return null;
    }

    const response = await authAPI.getCurrentUser();
    return response.data.user;
  } catch (error) {
    console.error('[AUTH] Error getting current user:', error);
    removeToken();
    return null;
  }
};

/**
 * Sets up a callback to be notified when the authentication state changes.
 * This is a simplified version that checks authentication on demand.
 * For real-time updates, you would need to implement polling or WebSocket.
 * 
 * @param callback - A function that will be called with the current user (or null if not authenticated).
 * @returns A cleanup function (no-op in this implementation).
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
 * // Later, cleanup (important to prevent memory leaks)
 * unsubscribe();
 * ```
 */
export const onAuthStateChange = (callback: (user: User | null) => void): (() => void) => {
  // Check current auth state
  getCurrentUser()
    .then((user) => {
      callback(user);
    })
    .catch(() => {
      callback(null);
    });

  // Return cleanup function (no-op since we're not using real-time listeners)
  return () => {
    // No cleanup needed
  };
};