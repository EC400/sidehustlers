// lib/firebase/auth.ts - Real Firebase Auth Implementation
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  Auth,
} from "firebase/auth";
import { auth } from "./client";
import { userQueries, getDoc, doc, db } from "../db";
import { UserProfile } from "../../types/userProfile";

// User Interface für vollständige User-Daten (optional)
export interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "seller";
  profileImage?: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthError {
  code: string;
  message: string;
}

// Firebase Auth Error Messages (German)
export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/user-not-found":
      return "Benutzer nicht gefunden.";
    case "auth/wrong-password":
      return "Falsches Passwort.";
    case "auth/email-already-in-use":
      return "Diese E-Mail-Adresse wird bereits verwendet.";
    case "auth/weak-password":
      return "Das Passwort ist zu schwach.";
    case "auth/invalid-email":
      return "Ungültige E-Mail-Adresse.";
    case "auth/too-many-requests":
      return "Zu viele Anfragen. Bitte versuchen Sie es später erneut.";
    case "auth/network-request-failed":
      return "Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.";
    case "auth/invalid-credential":
      return "Ungültige Anmeldedaten.";
    case "auth/popup-closed-by-user":
      return "Das Popup-Fenster wurde geschlossen.";
    case "auth/popup-blocked":
      return "Popup wurde blockiert. Bitte erlauben Sie Popups für diese Seite.";
    case "auth/cancelled-popup-request":
      return "Login wurde abgebrochen.";
    default:
      return "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.";
  }
};

// Hilfsfunktion: Map UserProfile zu User Interface
export function mapUserProfileToUser(
  firebaseUser: FirebaseUser,
  userProfile: UserProfile
): User {
  const firstName = userProfile.firstName || "";
  const lastName = userProfile.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email!,
    name:
      fullName || firebaseUser.displayName || firebaseUser.email!.split("@")[0],
    role: userProfile.accountType,
    profileImage:
      userProfile.profilePictureUrl || firebaseUser.photoURL || undefined,
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
  };
}

export class AuthService {
  // Aktuellen Firebase-User holen
  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Firestore-Profil holen
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (!snap.exists()) return null;
      return { id: uid, ...snap.data() } as UserProfile;
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  }

  // onAuthStateChanged mit korrektem Typ
  static onAuthStateChanged(cb: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, cb);
  }

  // Login with email and password - gibt FirebaseUser zurück
  static async loginWithEmail(
    email: string,
    password: string
  ): Promise<FirebaseUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Prüfen, ob User-Profil existiert
      const userProfile = await userQueries.getUserByEmail(firebaseUser.email!);
      if (!userProfile) {
        throw new Error("User data not found");
      }

      return firebaseUser;
    } catch (error: unknown) {
      const authError = error as { code: string };
      throw {
        code: authError.code,
        message: getAuthErrorMessage(authError.code),
      };
    }
  }

  // Register with email and password - gibt FirebaseUser zurück
  static async registerWithEmail(
    email: string,
    password: string,
    firstName: string,
    lastName: string = "",
    role: "customer" | "seller" = "customer"
  ): Promise<FirebaseUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      const userProfileData: Omit<UserProfile, "id"> = {
        email: firebaseUser.email!,
        accountType: role,
        firstName,
        lastName,
        profilePictureUrl: firebaseUser.photoURL || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        orderCount: 0,
        ratingAvg: 0,
        ratingCount: 0,
      };

      await userQueries.createUser(userProfileData);

      return firebaseUser;
    } catch (error: unknown) {
      const authError = error as { code: string };
      throw {
        code: authError.code,
        message: getAuthErrorMessage(authError.code),
      };
    }
  }

  // Login with Google - gibt FirebaseUser zurück
  static async loginWithGoogle(): Promise<FirebaseUser> {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");

      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;

      let userProfile = await userQueries.getUserByEmail(firebaseUser.email!);

      if (!userProfile) {
        const displayName =
          firebaseUser.displayName || firebaseUser.email!.split("@")[0];
        const nameParts = displayName.split(" ");

        const newUserProfileData: Omit<UserProfile, "id"> = {
          email: firebaseUser.email!,
          accountType: "customer",
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          profilePictureUrl: firebaseUser.photoURL || undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
          orderCount: 0,
          ratingAvg: 0,
          ratingCount: 0,
        };

        await userQueries.createUser(newUserProfileData);
      }

      return firebaseUser;
    } catch (error: unknown) {
      const authError = error as { code: string };
      throw {
        code: authError.code,
        message: getAuthErrorMessage(authError.code),
      };
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: unknown) {
      const authError = error as { code: string };
      throw {
        code: authError.code,
        message: getAuthErrorMessage(authError.code),
      };
    }
  }

  // Send password reset email
  static async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: unknown) {
      const authError = error as { code: string };
      throw {
        code: authError.code,
        message: getAuthErrorMessage(authError.code),
      };
    }
  }

  // Utility: Vollständige User-Daten erstellen (optional)
  static async getCompleteUserData(
    firebaseUser: FirebaseUser
  ): Promise<User | null> {
    const userProfile = await this.getUserProfile(firebaseUser.uid);
    if (!userProfile) return null;
    return mapUserProfileToUser(firebaseUser, userProfile);
  }
}

export default AuthService;
