import { signInWithPopup, UserCredential } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

/**
 * Signs in the user using Firebase Google Auth with a popup.
 */
export const signInWithGoogle = (): Promise<UserCredential> => {
  return signInWithPopup(auth, googleProvider);
};

/**
 * Signs out the current authenticated user from Firebase.
 */
export const logout = (): Promise<void> => {
  return auth.signOut();
};
