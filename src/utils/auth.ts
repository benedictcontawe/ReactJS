import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as onFirebaseAuthStateChanged, //Renamed to avoid conflict
  type User,
  type Unsubscribe
} from 'firebase/auth';
import { auth } from '../firebaseConfig';

/**
 * Creates a new user account using an email and password.
 * @param email The user's email address.
 * @param password The user's chosen password (must be at least 6 characters).
 * @returns A Promise that resolves with the newly created user object.
 * @throws Throws an error if the email is already in use or the password is invalid.
 */
export const createUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Signs in an existing user with their email and password.
 * @param email The user's email address.
 * @param password The user's password.
 * @returns A Promise that resolves with the signed-in user object.
 * @throws Throws an error if the credentials are not valid.
 */
export const login = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Signs out the currently authenticated user.
 * @returns A Promise that resolves when the sign-out is complete.
 * @throws Throws an error if the sign-out process fails.
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw error;
  }
};

/**
 * Synchronously gets the currently signed-in user object.
 * Note: This might be null on initial page load. For real-time state, use onAuthStateChange.
 * @returns The current user object or null if no user is signed in.
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Sets up a real-time listener for changes to the user's authentication state.
 * @param callback A function that will be called whenever the auth state changes. 
 *                 It receives the user object (or null if signed out).
 * @returns An unsubscribe function that should be called to clean up the listener.
 */
export const onAuthStateChange = (callback: (user: User | null) => void): Unsubscribe => {
  return onFirebaseAuthStateChanged(auth, callback);
};