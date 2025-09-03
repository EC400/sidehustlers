// lib/auth-token.ts
"use client";

import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "./firebase/client";

// Token-Management für Server-Side Auth
export class AuthTokenManager {
  static async setAuthToken(user: FirebaseUser | null) {
    try {
      if (user) {
        // ID Token von Firebase abrufen
        const idToken = await user.getIdToken(true); // Force refresh

        // Custom Claims hinzufügen falls nötig
        const tokenResult = await user.getIdTokenResult();

        // Cookie via API Route setzen
        await fetch("/api/auth/set-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: idToken,
            customClaims: tokenResult.claims,
          }),
        });

        console.log("Auth token set successfully");
      } else {
        // Token entfernen
        await fetch("/api/auth/remove-token", {
          method: "POST",
        });

        console.log("Auth token removed");
      }
    } catch (error) {
      console.error("Error managing auth token:", error);
    }
  }

  static initTokenSync() {
    // Auth State Listener für automatisches Token-Update
    if (typeof window !== "undefined") {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log("Auth state changed, updating token:", !!user);
        this.setAuthToken(user);
      });

      // Token bei Seitenwechsel aktualisieren
      window.addEventListener("beforeunload", () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Token vor Seitenwechsel aktualisieren
          currentUser.getIdToken(true).then((token) => {
            navigator.sendBeacon(
              "/api/auth/set-token",
              JSON.stringify({ token })
            );
          });
        }
      });

      return unsubscribe;
    }

    return () => {};
  }

  // Token periodisch erneuern (alle 50 Minuten)
  static startTokenRefresh() {
    if (typeof window !== "undefined") {
      const interval = setInterval(async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
          try {
            await this.setAuthToken(currentUser);
          } catch (error) {
            console.error("Error refreshing token:", error);
          }
        }
      }, 50 * 60 * 1000); // 50 Minuten

      return () => clearInterval(interval);
    }

    return () => {};
  }
}
