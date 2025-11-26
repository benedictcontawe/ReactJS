import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseAuth';
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
 * Uses Firebase Auth SDK to create the user and verify the password,
 * then sends the ID token to the backend for user creation.
 * 
 * This follows Firebase's best practice: verify password on client, send ID token to backend.
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
  // Step 1: Create user in Firebase Auth (this verifies password strength, etc.)
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const idToken = await userCredential.user.getIdToken();
  
  // Step 2: Send ID token to backend to register user
  const response = await authAPI.registerWithToken(idToken);
  setToken(response.data.token);
  return response.data.user;
};

/**
 * Authenticates an existing user and logs them in.
 * Uses Firebase Auth SDK to verify the password, then sends the ID token to the backend.
 * 
 * This follows Firebase's best practice: verify password on client, send ID token to backend.
 * Wrong passwords are rejected by Firebase Auth SDK before reaching the backend.
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
  // Step 1: Verify password with Firebase Auth SDK (this will throw if password is wrong)
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await userCredential.user.getIdToken();
  
  // Step 2: Send ID token to backend (backend verifies the token)
  const response = await authAPI.loginWithToken(idToken);
  setToken(response.data.token);
  return response.data.user;
};

/**
 * Logs out the current user.
 * Follows Firebase best practice: calls signOut() from Firebase Auth SDK to clear the session,
 * then optionally notifies the backend, and finally removes the token from localStorage.
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
    await signOut(auth);// Step 1: Sign out from Firebase Auth SDK (clears session, triggers onAuthStateChanged)
  } catch (error) {
    console.error('[AUTH] Firebase signOut failed:', error);// Continue with logout even if signOut fails
  }
  
  try {// Step 2: Optional: Notify backend (for logging/audit purposes)
    await authAPI.logout();
  } catch (error) {// Backend call failure is not critical, continue with logout
    console.warn('[AUTH] Backend logout notification failed:', error);
  }
  removeToken();// Step 3: Always remove token from localStorage
};

/**
 * Retrieves the currently authenticated user.
 * Follows Firebase best practice: uses Firebase Auth SDK's currentUser instead of calling backend.
 * This is more efficient, works offline, and automatically stays in sync with Firebase Auth state.
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
    const firebaseUser = auth.currentUser;// Use Firebase Auth SDK's currentUser (best practice)    
    if (firebaseUser) {      
      const idToken = await firebaseUser.getIdToken();// Get fresh ID token and sync with localStorage
      setToken(idToken);      
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      };
    }    
    
    removeToken();// No user authenticated, ensure token is removed
    return null;
  } catch (error) {
    console.error('[AUTH] Error getting current user:', error);
    
    removeToken();// If Firebase Auth fails, remove invalid token
    return null;
  }
};

/**
 * Sets up a callback to be notified when the authentication state changes.
 * Follows Firebase best practice: uses Firebase Auth SDK's onAuthStateChanged observer.
 * This provides real-time updates when the user logs in, logs out, or token refreshes.
 * 
 * @param callback - A function that will be called with the current user (or null if not authenticated).
 * @returns A cleanup function that can be called to unsubscribe from auth state changes.
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
  // Use Firebase Auth SDK's onAuthStateChanged (best practice)
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // Get fresh ID token and sync with localStorage
      const idToken = await firebaseUser.getIdToken();
      setToken(idToken);
      
      // Convert Firebase user to our User interface
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      };
      callback(user);
    } else {
      // User signed out, remove token
      removeToken();
      callback(null);
    }
  });
  
  // Return cleanup function to unsubscribe
  return unsubscribe;
};