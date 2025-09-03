"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { UserProfile } from "@/src/types/userProfile";
import AuthService from "./../lib/firebase/auth";
import { AuthTokenManager } from "./../lib/auth-token"; // <- DIESER IMPORT FEHLT

export const collections = {
  users: "users",
  services: "services",
  orders: "orders",
  jobs: "jobs",
  reviews: "reviews",
  chats: "chats",
  chatMessages: "chatMessages",
  disputes: "disputes",
} as const;

interface AuthError {
  code: string;
  message: string;
}

interface AuthContextType {
  authUser: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName?: string,
    role?: "customer" | "seller"
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      setInitialized(true);
      return;
    }

    const initAuth = async () => {
      try {
        // Get current Firebase user
        const current = AuthService.getCurrentUser();
        console.log("Initial auth user:", current);
        setAuthUser(current);

        if (current) {
          // Load user profile
          const userProfile = await AuthService.getUserProfile(current.uid);
          console.log("Initial user profile:", userProfile);
          setProfile(userProfile);
        }

        // Set up auth state listener
        const unsubscribe = AuthService.onAuthStateChanged(async (fbUser) => {
          console.log("Auth state changed:", fbUser?.email || "null");
          setAuthUser(fbUser);

          if (fbUser) {
            // Load user profile
            const userProfile = await AuthService.getUserProfile(fbUser.uid);
            console.log("Loaded user profile:", userProfile);
            setProfile(userProfile);
          } else {
            // Clear profile on logout
            setProfile(null);
          }

          // Mark as initialized after first auth state change
          if (!initialized) {
            setLoading(false);
            setInitialized(true);
          }
        });

        return unsubscribe;
      } catch (e) {
        console.error("Error initializing auth:", e);
        setAuthUser(null);
        setProfile(null);
        setError("Fehler beim Initialisieren der Authentifizierung");
      } finally {
        // Ensure loading is set to false even if there's an error
        if (!initialized) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    let unsubscribe: (() => void) | undefined;
    let unsubscribeToken: (() => void) | undefined;
    let stopTokenRefresh: (() => void) | undefined;

    initAuth().then((unsub) => {
      if (typeof unsub === "function") {
        unsubscribe = unsub;
      }
    });

    // Token-Management initialisieren
    if (typeof window !== "undefined") {
      // Token-Sync starten
      unsubscribeToken = AuthTokenManager.initTokenSync();
      stopTokenRefresh = AuthTokenManager.startTokenRefresh();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (unsubscribeToken) {
        unsubscribeToken();
      }
      if (stopTokenRefresh) {
        stopTokenRefresh();
      }
    };
  }, []); // Remove initialized dependency to prevent re-initialization

  // ===== Actions =====
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      if (typeof window === "undefined") {
        throw new Error("Login kann nur im Browser ausgeführt werden");
      }

      console.log("Attempting login for:", email);
      const firebaseUser = await AuthService.loginWithEmail(email, password);
      console.log("Login successful:", firebaseUser.email);

      // AuthService.onAuthStateChanged will handle setting authUser and profile
    } catch (err: unknown) {
      console.error("Login error:", err);
      const authError = err as AuthError;
      setError(authError.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName = "",
    role: "customer" | "seller" = "customer"
  ) => {
    try {
      setError(null);
      setLoading(true);

      if (typeof window === "undefined") {
        throw new Error("Registrierung kann nur im Browser ausgeführt werden");
      }

      console.log("Attempting registration for:", email);
      const firebaseUser = await AuthService.registerWithEmail(
        email,
        password,
        firstName,
        lastName,
        role
      );
      console.log("Registration successful:", firebaseUser.email);

      // AuthService.onAuthStateChanged will handle setting authUser and profile
    } catch (err: unknown) {
      console.error("Registration error:", err);
      const authError = err as AuthError;
      setError(authError.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);

      if (typeof window === "undefined") {
        throw new Error("Google Login kann nur im Browser ausgeführt werden");
      }

      console.log("Attempting Google login");
      const firebaseUser = await AuthService.loginWithGoogle();
      console.log("Google login successful:", firebaseUser.email);

      // AuthService.onAuthStateChanged will handle setting authUser and profile
    } catch (err: unknown) {
      console.error("Google login error:", err);
      const authError = err as AuthError;
      setError(authError.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);

      if (typeof window === "undefined") {
        throw new Error("Logout kann nur im Browser ausgeführt werden");
      }

      console.log("Attempting logout");
      await AuthService.logout();
      console.log("Logout successful");

      // AuthService.onAuthStateChanged will handle clearing authUser and profile
    } catch (err: unknown) {
      console.error("Logout error:", err);
      const authError = err as AuthError;
      setError(authError.message);
      throw err;
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      setError(null);

      if (typeof window === "undefined") {
        throw new Error("Passwort-Reset kann nur im Browser ausgeführt werden");
      }

      console.log("Sending password reset to:", email);
      await AuthService.sendPasswordResetEmail(email);
      console.log("Password reset email sent");
    } catch (err: unknown) {
      console.error("Password reset error:", err);
      const authError = err as AuthError;
      setError(authError.message);
      throw err;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    authUser,
    profile,
    loading,
    error,
    initialized,
    login,
    register,
    loginWithGoogle,
    logout,
    sendPasswordReset,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}