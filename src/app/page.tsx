// src/app/page.tsx - Verbesserte Homepage mit korrektem Routing
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';

export default function HomePage() {
  const router = useRouter();
  const { user, loading, isProfileComplete } = useAuth();

  useEffect(() => {
    if (loading) {
      console.log('⏳ Auth loading...');
      return;
    }

    if (!user) {
      console.log('👤 No user found, redirecting to login');
      router.replace('/login');
      return;
    }

    console.log('🔄 User found, checking profile completion', {
      uid: user.id,
      accountType: user.role,
      isComplete: isProfileComplete
    });

    // Profilvervollständigung prüfen
    if (!isProfileComplete) {
      console.log('📝 Profile incomplete, redirecting to complete-profile');
      router.replace('/complete-profile');
      return;
    }

    // Dashboard-Routing basierend auf accountType
    const dashboardPath = user.role === 'provider' 
      ? '/dashboard/provider' 
      : '/dashboard/customer';
    
    console.log(`🏠 Redirecting to dashboard: ${dashboardPath}`);
    router.replace(dashboardPath);
  }, [user, loading, isProfileComplete, router]);

  // Loading-Anzeige
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-[#0A1B3D] to-[#1E4A72] rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-6 p-3">
          <img 
            src="/logo.svg" 
            alt="SideHustlers Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="animate-spin w-8 h-8 border-4 border-[#0A1B3D] border-t-transparent rounded-full mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-[#0F172A] mb-2">SideHustlers</h2>
        <p className="text-[#64748B]">
          {loading ? 'Anmeldung wird überprüft...' : 'Weiterleitung...'}
        </p>
      </div>
    </div>
  );
}