// src/app/(auth)/login/page.tsx - ERWEITERTE GOOGLE AUTH DEBUG VERSION
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { auth } from "@/src/lib/firebase/client";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const { authUser, loading } = useAuth();
  
  const [working, setWorking] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLoadingTimeout, setShowLoadingTimeout] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // Debug Logger
  const addDebug = (message: string) => {
    console.log(message);
    setDebugInfo(prev => [...prev.slice(-5), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (loading && !showLoadingTimeout) {
      const timeout = setTimeout(() => {
        setShowLoadingTimeout(true);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [loading, showLoadingTimeout]);

  useEffect(() => {
    if (mounted && authUser) {
      addDebug(`User is logged in: ${authUser.email}, redirecting...`);
      router.replace("/");
    }
  }, [authUser, mounted, router]);

  useEffect(() => {
    if (!mounted) return;
    
    addDebug("Checking for redirect result...");
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          addDebug(`✅ Redirect successful: ${result.user.email}`);
          addDebug(`Current authUser: ${authUser?.email || 'still null'}`);
          
          setTimeout(() => {
            addDebug(`After timeout - authUser: ${authUser?.email || 'still null'}`);
            if (authUser) {
              router.replace("/");
            } else {
              addDebug("Force reloading page...");
              window.location.reload();
            }
          }, 2000);
        } else {
          addDebug("No redirect result found");
        }
      })
      .catch((error) => {
        addDebug(`❌ Redirect error: ${error.message}`);
        setWorking(false);
      });
  }, [mounted, router, authUser]);

  async function handleGoogle() {
    addDebug("🚀 Starting Google login...");
    setWorking(true);
    
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    try {
      addDebug("🔄 Using redirect authentication...");
      // NUR Redirect verwenden - entfernt das Popup-Chaos
      await signInWithRedirect(auth, provider);
      // Seite wird automatisch zu Google weitergeleitet
    } catch (popupError: unknown) {
      const error = popupError as { code?: string; message?: string };
      addDebug(`❌ Popup failed: ${error.code} - ${error.message}`);
  }

  // Test Firebase Connection
  async function testFirebaseConnection() {
    addDebug("🧪 Testing Firebase connection...");
    try {
      const user = auth.currentUser;
      addDebug(`Current Firebase user: ${user?.email || 'none'}`);
      addDebug(`Auth state ready: ${auth.app ? 'yes' : 'no'}`);
      addDebug(`Config: ${JSON.stringify(auth.app.options, null, 2)}`);
    } catch (error: unknown) {
      const authError = error as { code?: string; message?: string };
      addDebug(`❌ Complete Google login failure: ${authError.code} - ${authError.message}`);}

  if (!mounted) {
    return null;
  }

  if (working) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-md mx-4">
          <div className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium mb-4">Google Authentifizierung läuft...</p>
          
          {/* Debug Info */}
          <div className="text-xs text-left bg-gray-50 rounded p-3 font-mono max-h-32 overflow-y-auto">
            {debugInfo.map((info, i) => (
              <div key={i} className="text-gray-600 mb-1">{info}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loading && !showLoadingTimeout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Lade Anwendung...</p>
          <p className="text-sm text-gray-400 mt-2">
            Falls das zu lange dauert,{" "}
            <button 
              onClick={() => setShowLoadingTimeout(true)}
              className="text-blue-500 underline"
            >
              hier klicken
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold text-xl">
            SH
          </div>
          <span className="ml-3 text-xl font-bold text-gray-800">SideHustlers</span>
        </div>
      </div>

      {/* Debug Panel */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-16 right-4 bg-black/80 text-white text-xs p-3 rounded-lg font-mono z-50 max-w-xs">
          <div className="font-bold mb-2">Debug Info:</div>
          <div>Auth: {authUser ? '✅' : '❌'} {authUser?.email}</div>
          <div>Loading: {String(loading)}</div>
          <div>Working: {String(working)}</div>
          <button 
            onClick={testFirebaseConnection}
            className="mt-2 bg-blue-600 px-2 py-1 rounded text-xs"
          >
            Test Firebase
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Willkommen zurück
              </h1>
              <p className="text-gray-600">
                Melden Sie sich an, um Ihre Services zu verwalten oder neue Dienstleister zu finden.
              </p>
            </div>

            {/* Debug Messages */}
            {debugInfo.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm max-h-32 overflow-y-auto">
                {debugInfo.map((info, i) => (
                  <div key={i} className="text-blue-800 text-xs font-mono mb-1">{info}</div>
                ))}
              </div>
            )}

            {/* Google Login Button */}
            <button
              onClick={handleGoogle}
              disabled={working}
              className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="group-hover:translate-x-0.5 transition-transform">
                Mit Google anmelden
              </span>
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">oder</span>
              </div>
            </div>

            <div className="space-y-4 opacity-60 pointer-events-none">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="ihre@email.de" disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
                <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="••••••••" disabled />
              </div>
              <button disabled className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                Anmelden
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">E-Mail Login kommt bald</p>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Noch kein Konto?{" "}
              <button onClick={() => router.push("/register")} className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">
                Jetzt registrieren
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-indigo-400/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}