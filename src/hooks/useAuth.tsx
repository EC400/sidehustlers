// src/hooks/useAuth.tsx - Reparierter Auth Hook
"use client";

import { useEffect, useState, useCallback } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { AuthService, User } from '@/src/lib/firebase/auth';
import { UserProfile, IncompleteProfile } from '@/src/types/userprofile';

interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  isProfileComplete: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    firebaseUser: null,
    loading: true,
    error: null,
    isProfileComplete: true,
  });

  // Profilbewusstes User-State Update
  const updateUserState = useCallback(async (firebaseUser: FirebaseUser | null) => {
    if (!firebaseUser) {
      console.log('🔐 No Firebase user, clearing state');
      setState({
        user: null,
        firebaseUser: null,
        loading: false,
        error: null,
        isProfileComplete: true,
      });
      return;
    }

    try {
      console.log('👤 Firebase user detected, loading profile:', firebaseUser.uid);
      
      const userProfile = await AuthService.getUserProfile(firebaseUser.uid);
      
      if (!userProfile) {
        console.warn('⚠️ No user profile found for authenticated user');
        setState(prev => ({
          ...prev,
          user: null,
          firebaseUser,
          loading: false,
          error: 'User profile not found',
          isProfileComplete: false,
        }));
        return;
      }

      const isComplete = 'isProfileComplete' in userProfile ? userProfile.isProfileComplete : true;
      const completeUser = AuthService.createCompleteUserData(firebaseUser, userProfile);
      
      console.log('✅ User state updated:', {
        uid: completeUser.id,
        accountType: completeUser.role,
        isComplete
      });

      setState({
        user: completeUser,
        firebaseUser,
        loading: false,
        error: null,
        isProfileComplete: isComplete,
      });
      
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
      setState(prev => ({
        ...prev,
        user: null,
        firebaseUser,
        loading: false,
        error: 'Failed to load user profile',
        isProfileComplete: false,
      }));
    }
  }, []);

  // Auth State Listener
  useEffect(() => {
    console.log('🎧 Setting up auth state listener');
    
    const unsubscribe = AuthService.onAuthStateChanged((firebaseUser) => {
      console.log('🔄 Auth state changed:', firebaseUser ? 'logged in' : 'logged out');
      updateUserState(firebaseUser);
    });

    // Fallback: Nach 5 Sekunden loading stoppen
    const timeout = setTimeout(() => {
      setState(prev => prev.loading ? { ...prev, loading: false } : prev);
    }, 5000);

    return () => {
      console.log('🧹 Cleaning up auth listener');
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [updateUserState]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      console.log('👋 Starting logout process');
      setState(prev => ({ ...prev, loading: true }));
      await AuthService.logout();
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      setState(prev => ({ ...prev, error: 'Logout failed', loading: false }));
      throw error;
    }
  }, []);

  // Profil aktualisieren (nach Vervollständigung)
  const refreshProfile = useCallback(async () => {
    if (state.firebaseUser) {
      console.log('🔄 Refreshing user profile');
      await updateUserState(state.firebaseUser);
    }
  }, [state.firebaseUser, updateUserState]);

  // Debug-Informationen in Development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      (window as any).authState = state;
      (window as any).refreshProfile = refreshProfile;
    }
  }, [state, refreshProfile]);

  return {
    // Haupt-API
    user: state.user,
    firebaseUser: state.firebaseUser,
    loading: state.loading,
    error: state.error,
    
    // Profil-spezifisch
    isProfileComplete: state.isProfileComplete,
    refreshProfile,
    
    // Actions
    logout,
    
    // Legacy-Kompatibilität
    authUser: state.firebaseUser,
  };
}