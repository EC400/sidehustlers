// lib/firebase/admin.ts - KORRIGIERTE VERSION
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Environment Variables validieren
const requiredEnvVars = {
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,  
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(`Missing environment variables: ${missingVars.join(", ")}`);
}

// Firebase Admin initialisieren (nur einmal)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    }),
  });
}

const adminAuth = getAuth();
const adminDb = getFirestore();

// WICHTIG: Firestore Settings NUR einmal und NUR wenn noch nicht initialisiert
let firestoreConfigured = false;
if (!firestoreConfigured) {
  try {
    // Versuche Settings zu setzen - ignoriere Fehler wenn bereits initialisiert
    adminDb.settings({ 
      databaseId: "sidehustlers",
      ignoreUndefinedProperties: true 
    });
    firestoreConfigured = true;
    console.log("✅ Firestore configured with database: sidehustlers");
  } catch (error: unknown) {
    const authError = error as { message?: string };
    if (authError.message?.includes("already been initialized")) {
  
      console.log("ℹ️ Firestore already configured, skipping settings");
      firestoreConfigured = true;
    } else {
      console.error("❌ Firestore configuration error:", authError.message);
      // Verwende Standard-Database als Fallback
    }
  }
}

export async function verifyIdToken(token: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Invalid or expired token");
  }
}

export async function getServerUserProfile(uid: string) {
  try {
    const userDoc = await adminDb.collection("users").doc(uid).get();
    
    if (!userDoc.exists) {
      console.log(`User profile not found for UID: ${uid}`);
      return null;
    }
    
    const userData = userDoc.data();
    console.log(`User profile found for ${uid}:`, userData);
    
    return userData;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

export async function setCustomUserClaims(uid: string, claims: object) {
  try {
    await adminAuth.setCustomUserClaims(uid, claims);
  } catch (error) {
    console.error("Error setting custom claims:", error);
    throw error;
  }
}

export { adminAuth, adminDb };