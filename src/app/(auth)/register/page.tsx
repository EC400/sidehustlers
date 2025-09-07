// src/app/(auth)/register/page.tsx - Reparierte Registrierung
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/src/lib/firebase/auth';
import { AccountType } from '@/src/types/userprofile';

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showAccountTypeSelection, setShowAccountTypeSelection] = useState(false);
  const [fieldFocus, setFieldFocus] = useState({ 
    firstName: false, 
    lastName: false, 
    email: false, 
    password: false, 
    confirmPassword: false 
  });

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return {
      isValid: minLength && hasUpper && hasLower && hasNumber,
      requirements: {
        minLength,
        hasUpper,
        hasLower,
        hasNumber
      }
    };
  };

  const handleGoogleRegister = async () => {
    if (!accountType) {
      setShowAccountTypeSelection(true);
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await AuthService.loginWithGoogle();
      
      // Nach Google-Anmeldung zur Profilvervollständigung weiterleiten
      if (!result.profile || !('isProfileComplete' in result.profile) || !result.profile.isProfileComplete) {
        setSuccess('Google-Anmeldung erfolgreich! Vervollständigen Sie Ihr Profil...');
        setTimeout(() => {
          router.push('/complete-profile');
        }, 1500);
      } else {
        // Profil bereits vollständig
        const dashboardPath = result.profile.accountType === 'provider' ? '/dashboard/provider' : '/dashboard/customer';
        setSuccess('Anmeldung erfolgreich! Sie werden weitergeleitet...');
        setTimeout(() => {
          router.push(dashboardPath);
        }, 1500);
      }
      
    } catch (err: any) {
      console.error('Google registration error:', err);
      if (err.code === 'auth/account-exists-with-different-credential') {
        setError('Ein Konto mit dieser E-Mail-Adresse existiert bereits mit anderen Anmeldedaten.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Anmeldung abgebrochen.');
      } else {
        setError('Google-Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!accountType) {
      setShowAccountTypeSelection(true);
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validierung
    if (!firstName.trim() || !lastName.trim()) {
      setError('Bitte geben Sie Ihren vollständigen Namen ein');
      setIsLoading(false);
      return;
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Bitte geben Sie eine gültige E-Mail-Adresse ein');
      setIsLoading(false);
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError('Das Passwort erfüllt nicht alle Anforderungen');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      setIsLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError('Bitte akzeptieren Sie die AGB und Datenschutzbestimmungen');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🎯 Starting registration process');
      
      const result = await AuthService.registerWithEmail(
        email.trim().toLowerCase(), 
        password,
        firstName.trim(),
        lastName.trim(),
        accountType
      );
      
      console.log('✅ Registration successful, redirecting to profile completion');
      
      setSuccess('Registrierung erfolgreich! Vervollständigen Sie Ihr Profil...');
      
      // Reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setAcceptTerms(false);
      setAccountType(null);
      
      setTimeout(() => {
        router.push('/complete-profile');
      }, 1500);

    } catch (err: any) {
      console.error('Email registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Ein Konto mit dieser E-Mail-Adresse existiert bereits');
      } else if (err.code === 'auth/weak-password') {
        setError('Das Passwort ist zu schwach');
      } else if (err.code === 'auth/invalid-email') {
        setError('Ungültige E-Mail-Adresse');
      } else {
        setError('Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValidation = validatePassword(password);

  // Account Type Selection Modal
  if (showAccountTypeSelection) {
    return (
      <div className="h-screen bg-[#F8FAFC] flex items-center justify-center relative">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        
        <div className="relative z-10 bg-white rounded-3xl shadow-2xl border border-white/50 p-8 max-w-md mx-4 w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#0A1B3D] to-[#1E4A72] rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-4 p-3">
              <img 
                src="/logo.svg" 
                alt="SideHustlers Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Account-Typ auswählen</h2>
            <p className="text-[#0F172A]/70">Wie möchten Sie SideHustlers nutzen?</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                setAccountType('customer');
                setShowAccountTypeSelection(false);
              }}
              className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-[#00B4D8] hover:bg-[#00B4D8]/5 transition-all duration-200 group"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00B4D8]/20 to-[#1E4A72]/20 rounded-xl flex items-center justify-center mr-4 group-hover:from-[#00B4D8] group-hover:to-[#1E4A72] group-hover:text-white transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg text-[#0F172A] mb-1">Kunde</h3>
                  <p className="text-sm text-[#0F172A]/70">Ich suche Dienstleister für meine Projekte</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setAccountType('provider');
                setShowAccountTypeSelection(false);
              }}
              className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-[#00B4D8] hover:bg-[#00B4D8]/5 transition-all duration-200 group"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00B4D8]/20 to-[#1E4A72]/20 rounded-xl flex items-center justify-center mr-4 group-hover:from-[#00B4D8] group-hover:to-[#1E4A72] group-hover:text-white transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H8a2 2 0 00-2-2V6"></path>
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg text-[#0F172A] mb-1">Dienstleister</h3>
                  <p className="text-sm text-[#0F172A]/70">Ich biete meine Services an</p>
                </div>
              </div>
            </button>
          </div>

          <button
            onClick={() => setShowAccountTypeSelection(false)}
            className="w-full mt-6 py-3 text-[#0F172A]/60 hover:text-[#0F172A] transition-colors"
          >
            Zurück
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F8FAFC] overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-[#0A1B3D]/20 to-[#1E4A72]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-bl from-[#00B4D8]/25 to-[#1E4A72]/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gradient-to-tl from-[#0A1B3D]/15 to-[#00B4D8]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        <div className="absolute top-20 left-1/4 w-8 h-8 border-2 border-[#00B4D8]/30 rotate-45 animate-bounce" style={{animationDuration: '3s', animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-1/4 left-1/5 w-6 h-6 bg-[#1E4A72]/20 rounded-full animate-ping" style={{animationDuration: '4s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-[#00B4D8]/40 rotate-12 animate-spin" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-20 right-1/3 w-12 h-12 border border-[#0A1B3D]/25 rounded-lg animate-pulse" style={{animationDuration: '5s'}}></div>
      </div>

      <div className="flex h-full max-w-7xl mx-auto">
        {/* Left Side - Marketing Content */}
        <div className="hidden lg:flex flex-col justify-center w-1/2 px-8 xl:px-12 relative z-10">
          <div className="max-w-xl">
            <div className="mb-12">
              <div className="inline-flex items-center space-x-4 mb-8 group">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0A1B3D] to-[#1E4A72] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#0A1B3D]/30 group-hover:shadow-[#0A1B3D]/40 transition-all duration-500 group-hover:scale-105 p-3">
                    <img 
                      src="/logo.svg" 
                      alt="SideHustlers Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-[#00B4D8] to-[#1E4A72] rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-sm"></div>
                </div>
                <span className="text-3xl font-bold text-[#0F172A] tracking-tight">SideHustlers</span>
              </div>
              
              <h1 className="text-5xl xl:text-6xl font-bold text-[#0F172A] mb-6 leading-[1.1]">
                Professionelle <br/>
                <span className="bg-gradient-to-r from-[#0A1B3D] to-[#1E4A72] bg-clip-text text-transparent">
                  Dienstleistungen
                </span><br/>
                in Ihrer Nähe
              </h1>
              <p className="text-xl text-[#0F172A]/70 leading-relaxed">
                Verbinden Sie sich mit qualifizierten Dienstleistern in Ihrer Region. 
                Professionell, vertrauensvoll und direkt vor Ort.
              </p>
            </div>
            
            {/* Features */}
            <div className="space-y-6">
              {[
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  ),
                  title: "Geprüfte Dienstleister",
                  desc: "Alle Anbieter werden sorgfältig verifiziert und bewertet"
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  ),
                  title: "Lokale Expertise",
                  desc: "Finden Sie Fachkräfte direkt in Ihrer Nachbarschaft"
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  ),
                  title: "Sichere Abwicklung",
                  desc: "Geschützte Zahlungen und Qualitätsgarantie"
                }
              ].map((feature, index) => (
                <div key={index} className="flex items-center group hover:bg-white/40 p-4 rounded-2xl transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#00B4D8]/20 to-[#1E4A72]/20 rounded-xl flex items-center justify-center text-[#0A1B3D] group-hover:from-[#0A1B3D] group-hover:to-[#1E4A72] group-hover:text-white transition-all duration-300 mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#0F172A] mb-1">{feature.title}</h3>
                    <p className="text-[#0F172A]/70">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50">
              <div className="text-center">
                <div className="flex justify-center items-center mb-3">
                  <div className="flex text-[#F77F00] mr-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-[#0F172A]/70 font-medium">4.9/5</span>
                </div>
                <p className="text-lg font-semibold text-[#0F172A] mb-1">Über 5.000+ erfolgreiche Projekte</p>
                <p className="text-[#0F172A]/60 text-sm">von verifizierten Dienstleistern abgeschlossen</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 px-4 lg:px-8 relative z-10">
          <div className="max-w-lg mx-auto w-full">
            {/* Mobile Header */}
            <div className="text-center mb-8 lg:hidden">
              <div className="inline-flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0A1B3D] to-[#1E4A72] rounded-xl flex items-center justify-center shadow-lg p-2">
                  <img 
                    src="/logo.svg" 
                    alt="SideHustlers Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-2xl font-bold text-[#0F172A]">SideHustlers</span>
              </div>
              <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Jetzt registrieren</h1>
              <p className="text-[#0F172A]/70">Werden Sie Teil unserer Community</p>
            </div>

            {/* Registration Card */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              <div className="p-8">
                <div className="hidden lg:block text-center mb-8">
                  <h2 className="text-3xl font-bold text-[#0F172A] mb-2">Registrieren</h2>
                  <p className="text-[#0F172A]/70">Starten Sie als Anbieter oder Kunde</p>
                </div>

                {/* Account Type Indicator */}
                {accountType && (
                  <div className="mb-6 p-4 bg-[#00B4D8]/10 border border-[#00B4D8]/30 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-[#00B4D8] rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <span className="text-[#0A1B3D] font-medium">
                          Account-Typ: {accountType === 'customer' ? 'Kunde' : 'Dienstleister'}
                        </span>
                      </div>
                      <button
                        onClick={() => setAccountType(null)}
                        className="text-[#00B4D8] hover:text-[#1E4A72] text-sm font-medium"
                      >
                        Ändern
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-4 bg-[#06D6A0]/10 border border-[#06D6A0]/30 text-[#0A1B3D] rounded-xl text-sm flex items-center">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0 text-[#06D6A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {success}
                  </div>
                )}

                {/* Google Registration */}
                <button
                  onClick={handleGoogleRegister}
                  disabled={isLoading}
                  className="w-full mb-6 bg-white hover:bg-gray-50 text-[#0F172A] font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-3 border-2 border-gray-200 hover:border-[#00B4D8]/30 transition-all duration-200 shadow-sm hover:shadow-lg group disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="group-hover:translate-x-0.5 transition-transform">
                    Mit Google registrieren
                  </span>
                </button>

                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-[#0F172A]/50 font-medium">oder mit E-Mail</span>
                  </div>
                </div>

                {/* Email Form */}
                <form onSubmit={handleEmailRegister} className="space-y-4">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                        fieldFocus.firstName || firstName ? 'top-2 text-xs text-[#0A1B3D] font-medium' : 'top-4 text-[#0F172A]/50'
                      }`}>
                        Vorname
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        onFocus={() => setFieldFocus(prev => ({...prev, firstName: true}))}
                        onBlur={() => setFieldFocus(prev => ({...prev, firstName: false}))}
                        className={`w-full pt-6 pb-3 px-4 bg-white border-2 rounded-xl transition-all duration-200 ${
                          fieldFocus.firstName ? 'border-[#0A1B3D] shadow-lg shadow-[#0A1B3D]/20' : 'border-gray-200 hover:border-gray-300'
                        } focus:outline-none`}
                        required
                      />
                    </div>

                    <div className="relative">
                      <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                        fieldFocus.lastName || lastName ? 'top-2 text-xs text-[#0A1B3D] font-medium' : 'top-4 text-[#0F172A]/50'
                      }`}>
                        Nachname
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        onFocus={() => setFieldFocus(prev => ({...prev, lastName: true}))}
                        onBlur={() => setFieldFocus(prev => ({...prev, lastName: false}))}
                        className={`w-full pt-6 pb-3 px-4 bg-white border-2 rounded-xl transition-all duration-200 ${
                          fieldFocus.lastName ? 'border-[#0A1B3D] shadow-lg shadow-[#0A1B3D]/20' : 'border-gray-200 hover:border-gray-300'
                        } focus:outline-none`}
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="relative">
                    <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                      fieldFocus.email || email ? 'top-2 text-xs text-[#0A1B3D] font-medium' : 'top-4 text-[#0F172A]/50'
                    }`}>
                      E-Mail Adresse
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFieldFocus(prev => ({...prev, email: true}))}
                      onBlur={() => setFieldFocus(prev => ({...prev, email: false}))}
                      className={`w-full pt-6 pb-3 px-4 bg-white border-2 rounded-xl transition-all duration-200 ${
                        fieldFocus.email ? 'border-[#0A1B3D] shadow-lg shadow-[#0A1B3D]/20' : 'border-gray-200 hover:border-gray-300'
                      } focus:outline-none`}
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                      fieldFocus.password || password ? 'top-2 text-xs text-[#0A1B3D] font-medium' : 'top-4 text-[#0F172A]/50'
                    }`}>
                      Passwort
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFieldFocus(prev => ({...prev, password: true}))}
                      onBlur={() => setFieldFocus(prev => ({...prev, password: false}))}
                      className={`w-full pt-6 pb-3 px-4 pr-12 bg-white border-2 rounded-xl transition-all duration-200 ${
                        fieldFocus.password ? 'border-[#0A1B3D] shadow-lg shadow-[#0A1B3D]/20' : 'border-gray-200 hover:border-gray-300'
                      } focus:outline-none`}
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0F172A]/40 hover:text-[#0A1B3D] transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                        </svg>
                      )}
                    </button>
                    {(fieldFocus.password || password) && (
                      <div className="mt-2 ml-4 space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${passwordValidation.requirements.minLength ? 'bg-[#06D6A0]' : 'bg-gray-300'}`}></div>
                          <span className={`text-xs ${passwordValidation.requirements.minLength ? 'text-[#06D6A0]' : 'text-[#0F172A]/50'}`}>Mindestens 8 Zeichen</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${passwordValidation.requirements.hasUpper && passwordValidation.requirements.hasLower ? 'bg-[#06D6A0]' : 'bg-gray-300'}`}></div>
                          <span className={`text-xs ${passwordValidation.requirements.hasUpper && passwordValidation.requirements.hasLower ? 'text-[#06D6A0]' : 'text-[#0F172A]/50'}`}>Groß- und Kleinbuchstaben</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${passwordValidation.requirements.hasNumber ? 'bg-[#06D6A0]' : 'bg-gray-300'}`}></div>
                          <span className={`text-xs ${passwordValidation.requirements.hasNumber ? 'text-[#06D6A0]' : 'text-[#0F172A]/50'}`}>Mindestens eine Zahl</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="relative">
                    <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                      fieldFocus.confirmPassword || confirmPassword ? 'top-2 text-xs text-[#0A1B3D] font-medium' : 'top-4 text-[#0F172A]/50'
                    }`}>
                      Passwort bestätigen
                    </label>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setFieldFocus(prev => ({...prev, confirmPassword: true}))}
                      onBlur={() => setFieldFocus(prev => ({...prev, confirmPassword: false}))}
                      className={`w-full pt-6 pb-3 px-4 pr-12 bg-white border-2 rounded-xl transition-all duration-200 ${
                        fieldFocus.confirmPassword ? 'border-[#0A1B3D] shadow-lg shadow-[#0A1B3D]/20' : 'border-gray-200 hover:border-gray-300'
                      } focus:outline-none`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0F172A]/40 hover:text-[#0A1B3D] transition-colors"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                        </svg>
                      )}
                    </button>
                    {confirmPassword && password && (
                      <div className="mt-1 ml-4">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${password === confirmPassword ? 'bg-[#06D6A0]' : 'bg-red-400'}`}></div>
                          <span className={`text-xs ${password === confirmPassword ? 'text-[#06D6A0]' : 'text-red-600'}`}>
                            {password === confirmPassword ? 'Passwörter stimmen überein' : 'Passwörter stimmen nicht überein'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start pt-2">
                    <div className="flex items-center h-6">
                      <input
                        id="terms"
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="w-4 h-4 text-[#0A1B3D] bg-gray-100 border-gray-300 rounded focus:ring-[#0A1B3D] focus:ring-2"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="text-[#0F172A]/70">
                        Ich akzeptiere die{' '}
                        <a href="#" className="text-[#00B4D8] hover:text-[#1E4A72] font-medium underline-offset-2 hover:underline transition-colors">
                          Nutzungsbedingungen
                        </a>{' '}
                        und{' '}
                        <a href="#" className="text-[#00B4D8] hover:text-[#1E4A72] font-medium underline-offset-2 hover:underline transition-colors">
                          Datenschutzrichtlinien
                        </a>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 bg-gradient-to-r from-[#0A1B3D] to-[#1E4A72] hover:from-[#1E4A72] hover:to-[#00B4D8] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#0A1B3D]/25 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:hover:from-[#0A1B3D] disabled:hover:to-[#1E4A72]"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Registrierung läuft...
                      </div>
                    ) : (
                      'Konto erstellen'
                    )}
                  </button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                  <span className="text-[#0F172A]/60">Bereits ein Konto? </span>
                  <button 
                    onClick={() => router.push('/login')}
                    className="text-[#00B4D8] hover:text-[#1E4A72] font-medium transition-colors underline-offset-2 hover:underline"
                  >
                    Zur Anmeldung
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gradient-to-r from-[#F8FAFC] to-white/80 px-8 py-4 border-t border-gray-100">
                <p className="text-xs text-center text-[#0F172A]/50 leading-relaxed">
                  Mit der Registrierung erhalten Sie Zugang zu allen Premium-Funktionen unserer Dienstleistungsplattform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}