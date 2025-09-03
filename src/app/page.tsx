// src/app/page.tsx - VEREINFACHTE VERSION OHNE SERVER AUTH
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const router = useRouter();
  const { authUser, loading } = useAuth();

  useEffect(() => {
    console.log("🏠 Root page - Auth state:", { 
      user: authUser?.email || null, 
      loading,
      timestamp: new Date().toLocaleTimeString()
    });

    // Warten bis Auth initialisiert ist
    if (loading) {
      console.log("⏳ Still loading, waiting...");
      return;
    }

    // Redirect basierend auf Auth-Status
    if (!authUser) {
      console.log("❌ No user found, redirecting to login");
      router.replace("/login");
      return;
    }

    // User ist eingeloggt - prüfe Profil
    console.log("✅ User found, checking profile:", authUser.email);
    
    // Temporär: Alle User zu customer dashboard
    console.log("🚀 Redirecting to customer dashboard");
    router.replace("/dashboard/customer");
    
  }, [authUser, loading, router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Lade Dashboard...</p>
        </div>
      </div>
    );
  }

  // Fallback falls Redirect nicht funktioniert
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Leite weiter...</p>
        <button 
          onClick={() => router.push("/login")}
          className="mt-4 text-blue-500 underline"
        >
          Manuell zur Anmeldung
        </button>
      </div>
    </div>
  );
}