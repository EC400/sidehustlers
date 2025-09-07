// lib/firebase/auth.ts - Reparierter Auth Service
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "./client";
import { userQueries } from "../db";
import { CustomerProfile, ProviderProfile, UserProfile, AccountType, IncompleteProfile } from "../../types/userprofile";

export interface AuthError {
  code: string;
  message: string;
}

// User Interface für die App
export interface User {
  id: string;
  email: string;
  name: string;
  role: AccountType;
  profileImage?: string;
  firstName: string;
  lastName: string;
  profile: UserProfile | IncompleteProfile;
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

// Helper function to generate unique IDs
function generateUniqueId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2);
  return `${prefix}_${timestamp}_${randomStr}`;
}

export class AuthService {
  // Aktuellen Firebase-User holen
  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Firestore-Profil holen
  static async getUserProfile(uid: string): Promise<UserProfile | IncompleteProfile | null> {
    try {
      console.log('📝 Getting user profile for UID:', uid);
      const profile = await userQueries.getUserById(uid);
      console.log('📝 Retrieved profile:', profile);
      return profile;
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  }

  // onAuthStateChanged mit korrektem Typ
  static onAuthStateChanged(cb: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, cb);
  }

  // Login with email and password
  static async loginWithEmail(
    email: string,
    password: string
  ): Promise<{ user: FirebaseUser; profile: UserProfile | IncompleteProfile }> {
    try {
      console.log('🔐 Starting email login for:', email);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      console.log('✅ Firebase auth successful for:', firebaseUser.uid);

      // Prüfen, ob User-Profil existiert
      const userProfile = await this.getUserProfile(firebaseUser.uid);
      if (!userProfile) {
        console.error('❌ User profile not found in Firestore');
        await this.logout(); // User ausloggen wenn kein Profil existiert
        throw new Error("User data not found");
      }

      console.log('✅ Login successful with profile:', userProfile.accountType);
      return { user: firebaseUser, profile: userProfile };
    } catch (error: any) {
      console.error('❌ Login error:', error);
      throw {
        code: error.code || 'unknown',
        message: getAuthErrorMessage(error.code || 'unknown'),
      };
    }
  }

  // Basis-Registrierung (erstellt nur minimales Profil)
  static async registerWithEmail(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    accountType: AccountType
  ): Promise<{ user: FirebaseUser; profile: IncompleteProfile }> {
    try {
      console.log('📝 Starting registration for:', email, 'as', accountType);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update Firebase Auth display name
      await updateProfile(firebaseUser, {
        displayName: `${firstName} ${lastName}`
      });

      // Erstelle minimales Profil in Firestore
      const now = new Date().toISOString();
      const incompleteProfile: IncompleteProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        accountType,
        firstName,
        lastName,
        isProfileComplete: false,
        createdAt: now,
        updatedAt: now,
      };

      console.log('💾 Creating incomplete profile in Firestore:', incompleteProfile);
      await userQueries.createUser(incompleteProfile);
      
      console.log('✅ Registration successful - profile completion needed');
      return { user: firebaseUser, profile: incompleteProfile };
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      throw {
        code: error.code || 'unknown',
        message: getAuthErrorMessage(error.code || 'unknown'),
      };
    }
  }

  // Profil vervollständigen für Customer
  static async completeCustomerProfile(
    uid: string,
    data: {
      phone?: string;
      address?: {
        streetAndNumber: string;
        zip: string;
        city: string;
      };
      dob?: string;
    }
  ): Promise<CustomerProfile> {
    try {
      console.log('🔧 Completing customer profile for:', uid);
      
      const incompleteProfile = await this.getUserProfile(uid) as IncompleteProfile;
      if (!incompleteProfile) {
        throw new Error("Incomplete profile not found");
      }

      const now = new Date().toISOString();
      const customerProfile: CustomerProfile = {
        uid: incompleteProfile.uid,
        customerId: generateUniqueId('cust'),
        email: incompleteProfile.email,
        accountType: "customer" as const,
        firstName: incompleteProfile.firstName,
        lastName: incompleteProfile.lastName,
        createdAt: incompleteProfile.createdAt,
        updatedAt: now,
        orderCount: 0,
        ratingAvg: 0,
        ratingCount: 0,
        isProfileComplete: true,
        phone: data.phone,
        address: data.address,
        dob: data.dob,
      };

      await userQueries.updateUser(uid, customerProfile);
      console.log('✅ Customer profile completed');
      return customerProfile;
    } catch (error) {
      console.error('❌ Error completing customer profile:', error);
      throw error;
    }
  }

  // Profil vervollständigen für Provider
  static async completeProviderProfile(
    uid: string,
    data: {
      businessName: string;
      businessDescription: string;
      services: string[];
      phone: string;
      address: {
        streetAndNumber: string;
        zip: string;
        city: string;
      };
      serviceArea: string[];
      workingHours?: {
        start: string;
        end: string;
      };
    }
  ): Promise<ProviderProfile> {
    try {
      console.log('🔧 Completing provider profile for:', uid);
      
      const incompleteProfile = await this.getUserProfile(uid) as IncompleteProfile;
      if (!incompleteProfile) {
        throw new Error("Incomplete profile not found");
      }

      const now = new Date().toISOString();
      const providerProfile: ProviderProfile = {
        uid: incompleteProfile.uid,
        providerId: generateUniqueId('prov'),
        email: incompleteProfile.email,
        accountType: "provider" as const,
        firstName: incompleteProfile.firstName,
        lastName: incompleteProfile.lastName,
        createdAt: incompleteProfile.createdAt,
        updatedAt: now,
        isProfileComplete: true,
        displayName: data.businessName,
        bio: data.businessDescription,
        status: "active",
        verification: {
          emailVerified: auth.currentUser?.emailVerified || false,
          idVerified: false,
        },
        documents: {},
        serviceCount: 0,
        orderCount: 0,
        ratingAvg: 0,
        ratingCount: 0,
        phone: data.phone,
        address: data.address,
        businessName: data.businessName,
        businessDescription: data.businessDescription,
        services: data.services,
        serviceArea: data.serviceArea,
        workingHours: data.workingHours,
      };

      await userQueries.updateUser(uid, providerProfile);
      console.log('✅ Provider profile completed');
      return providerProfile;
    } catch (error) {
      console.error('❌ Error completing provider profile:', error);
      throw error;
    }
  }

  // Login with Google
  static async loginWithGoogle(): Promise<{ user: FirebaseUser; profile: UserProfile | IncompleteProfile | null }> {
    try {
      console.log('🔐 Starting Google login');
      
      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");

      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;

      console.log('✅ Google auth successful for:', firebaseUser.uid);

      let userProfile = await this.getUserProfile(firebaseUser.uid);

      // Wenn kein Profil existiert, erstelle eines (Google Login kann als Registrierung fungieren)
      if (!userProfile) {
        console.log('🆕 Creating new profile from Google login');
        
        const displayName = firebaseUser.displayName || firebaseUser.email!.split("@")[0];
        const nameParts = displayName.split(" ");

        const now = new Date().toISOString();
        const incompleteProfile: IncompleteProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          accountType: "customer", // Default für Google Login
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          isProfileComplete: false,
          createdAt: now,
          updatedAt: now,
        };

        await userQueries.createUser(incompleteProfile);
        userProfile = incompleteProfile;
      }

      console.log('✅ Google login successful');
      return { user: firebaseUser, profile: userProfile };
    } catch (error: any) {
      console.error('❌ Google login error:', error);
      throw {
        code: error.code || 'unknown',
        message: getAuthErrorMessage(error.code || 'unknown'),
      };
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      console.log('👋 Logging out user');
      await signOut(auth);
      console.log('✅ Logout successful');
    } catch (error: any) {
      console.error('❌ Logout error:', error);
      throw {
        code: error.code || 'unknown',
        message: getAuthErrorMessage(error.code || 'unknown'),
      };
    }
  }

  // Send password reset email
  static async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw {
        code: error.code || 'unknown',
        message: getAuthErrorMessage(error.code || 'unknown'),
      };
    }
  }

  // Vollständige User-Daten mit Profil erstellen
  static createCompleteUserData(
    firebaseUser: FirebaseUser,
    userProfile: UserProfile | IncompleteProfile
  ): User {
    const firstName = userProfile.firstName || "";
    const lastName = userProfile.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();

    // Type-safe access to profilePictureUrl
    const profilePictureUrl = 'profilePictureUrl' in userProfile ? userProfile.profilePictureUrl : undefined;

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      name: fullName || firebaseUser.displayName || firebaseUser.email!.split("@")[0],
      role: userProfile.accountType,
      profileImage: profilePictureUrl || firebaseUser.photoURL || undefined,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      profile: userProfile,
    };
  }
}

export default AuthService;