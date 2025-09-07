// src/app/dashboard/provider
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Job, JobStatus, PricingType, ContextType } from '@/src/types/job';

interface ProviderData {
  name: string;
  email: string;
  isVerified: boolean;
  completedJobs: number;
  totalEarnings: number;
  averageRating: number;
  activeJobs: number;
}

const ProviderDashboardPage = () => {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [providerData, setProviderData] = useState<ProviderData | null>(null);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const provider: ProviderData = {
          name: user?.name || "Michael Weber",
          email: user?.email || "michael.weber@email.com",
          isVerified: true,
          completedJobs: 23,
          totalEarnings: 2840.50,
          averageRating: 4.8,
          activeJobs: 3,
        };

        const jobs: Job[] = [
          {
            jobId: '1',
            contextType: ContextType.ORDER,
            contextId: 'order-123',
            customerId: 'customer-456',
            providerId: 'provider-789',
            title: 'Umzug 3-Zimmer Wohnung',
            description: 'Kompletter Umzug einer 3-Zimmer Wohnung inklusive Verpackung und Transport vom 4. Stock ohne Aufzug',
            price: 280.00,
            pricingType: PricingType.FIXED,
            location: {
              streetAndNumber: 'Müllerstraße 15',
              zip: '50667',
              city: 'Köln'
            },
            durationInMin: 480,
            createdAt: new Date('2025-03-10T10:00:00Z').toISOString(),
            status: JobStatus.IN_PROGRESS,
            scheduled: {
              start: new Date('2025-03-15T08:00:00Z').toISOString(),
              end: new Date('2025-03-15T16:00:00Z').toISOString()
            }
          },
          {
            jobId: '2',
            contextType: ContextType.SERVICE,
            contextId: 'service-456',
            customerId: 'customer-789',
            providerId: 'provider-789',
            title: 'Garten winterfest machen',
            description: 'Herbstlaub entfernen, Pflanzen abdecken, Gartenmöbel einlagern und Rasenpflege',
            price: 120.00,
            pricingType: PricingType.FIXED,
            location: {
              streetAndNumber: 'Gartenstraße 42',
              zip: '50674',
              city: 'Köln'
            },
            durationInMin: 240,
            createdAt: new Date('2025-03-12T14:00:00Z').toISOString(),
            status: JobStatus.SCHEDULED,
            scheduled: {
              start: new Date('2025-03-18T09:00:00Z').toISOString(),
              end: new Date('2025-03-18T13:00:00Z').toISOString()
            }
          },
          {
            jobId: '3',
            contextType: ContextType.ORDER,
            contextId: 'order-789',
            customerId: 'customer-012',
            providerId: 'provider-789',
            title: 'Möbel aufbauen (IKEA)',
            description: 'Aufbau verschiedener IKEA Möbel: Kleiderschrank PAX, Kommode HEMNES, Bett MALM',
            price: 85.00,
            pricingType: PricingType.FIXED,
            location: {
              streetAndNumber: 'Weberstraße 28',
              zip: '50676',
              city: 'Köln'
            },
            durationInMin: 180,
            createdAt: new Date('2025-03-14T16:00:00Z').toISOString(),
            status: JobStatus.COMPLETED,
            scheduled: {
              start: new Date('2025-03-22T10:00:00Z').toISOString(),
              end: new Date('2025-03-22T13:00:00Z').toISOString()
            }
          }
        ];

        setProviderData(provider);
        setRecentJobs(jobs);
      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  const updateJobStatus = (jobId: string, status: JobStatus) => {
    console.log(`Update job ${jobId} to status ${status}`);
  };

  const getStatusText = (status: JobStatus): string => {
    switch (status) {
      case JobStatus.SCHEDULED: return 'Geplant';
      case JobStatus.IN_PROGRESS: return 'In Bearbeitung';
      case JobStatus.DELIVERED: return 'Geliefert';
      case JobStatus.COMPLETED: return 'Abgeschlossen';
      case JobStatus.CANCELLED: return 'Storniert';
      default: return 'Unbekannt';
    }
  };

  const getStatusClass = (status: JobStatus): string => {
    switch (status) {
      case JobStatus.SCHEDULED: return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case JobStatus.IN_PROGRESS: return 'bg-green-50 text-green-700 border border-green-200';
      case JobStatus.DELIVERED: return 'bg-blue-50 text-blue-700 border border-blue-200';
      case JobStatus.COMPLETED: return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case JobStatus.CANCELLED: return 'bg-red-50 text-red-700 border border-red-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a1b3d]"></div>
      </div>
    );
  }

  if (!providerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-color mb-2">Fehler beim Laden der Daten</h2>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary px-4 py-2 rounded-lg"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

        * {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }

        html {
          scroll-behavior: smooth;
          -webkit-text-size-adjust: 100%;
        }

        body {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
          font-feature-settings: "cv02", "cv03", "cv04", "cv11";
          background: #f8fafc;
          min-height: 100vh;
          margin: 0;
          padding: 0;
          overscroll-behavior: none;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          color: #0f172a;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .professional-card {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.08);
          border: 1px solid rgba(15, 23, 42, 0.06);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .professional-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(15, 23, 42, 0.07), 0 8px 25px rgba(15, 23, 42, 0.12);
        }

        .primary-gradient {
          background: linear-gradient(135deg, #0a1b3d 0%, #1e4a72 100%);
        }

        .accent-gradient {
          background: linear-gradient(135deg, #1e4a72 0%, #00b4d8 100%);
        }

        .primary-color { color: #0a1b3d; }
        .secondary-color { color: #1e4a72; }
        .accent-color { color: #00b4d8; }
        .warm-color { color: #f77f00; }
        .success-color { color: #06d6a0; }
        .text-color { color: #0f172a; }
        .text-muted { color: #64748b; }

        .btn-primary {
          background: #0a1b3d;
          color: white;
          border: none;
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          background: #1e4a72;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: #1e4a72;
          color: white;
          border: none;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          background: #00b4d8;
          transform: translateY(-1px);
        }

        .btn-outline {
          background: transparent;
          color: #1e4a72;
          border: 1.5px solid #1e4a72;
          transition: all 0.2s ease;
        }

        .btn-outline:hover {
          background: #1e4a72;
          color: white;
        }

        .mobile-safe {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
        }

        .subtle-animation {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @media (max-width: 768px) {
          .professional-card {
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06), 0 2px 8px rgba(15, 23, 42, 0.1);
          }

          .professional-card:hover {
            transform: none;
          }
        }
      `}</style>

      <div className="min-h-screen mobile-safe bg-[#F8FAFC]">
        {/* Header */}
        <header className="glass-effect sticky top-0 z-50 border-b border-[#0f172a]/8">
          <div className="primary-gradient">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="flex items-center justify-between">
                {/* Logo & Brand */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center p-2">
                    <img src="/logo.svg" alt="SideHustlers Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">SideHustlers</h1>
                    <p className="text-white/80 text-sm hidden sm:block font-medium">Provider Dashboard</p>
                  </div>
                </div>

                {/* Navigation - Desktop */}
                <nav className="hidden lg:flex items-center space-x-8">
                  <Link href="/dashboard/provider" className="text-white/90 hover:text-white font-medium transition-colors border-b-2 border-white/30 pb-1">
                    Dashboard
                  </Link>
                  <Link href="./provider/jobs" className="text-white/70 hover:text-white font-medium transition-colors">
                    Aufträge
                  </Link>
                  <Link href="/services" className="text-white/70 hover:text-white font-medium transition-colors">
                    Meine Services
                  </Link>
                  <Link href="/chats" className="text-white/70 hover:text-white font-medium transition-colors">
                    Chats
                  </Link>
                </nav>

                {/* User Menu Button */}
                <div className="flex items-center space-x-3 sm:space-x-6">
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-2 hover:bg-white/20 transition-all duration-200"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white font-semibold text-sm border border-white/20">
                        {providerData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <svg className={`w-4 h-4 text-white/70 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                        <Link href="/profile" className="flex items-center px-4 py-3 text-sm text-[#0f172a] hover:bg-gray-50" onClick={() => setShowDropdown(false)}>
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Mein Profil
                        </Link>
                        <Link href="/settings" className="flex items-center px-4 py-3 text-sm text-[#0f172a] hover:bg-gray-50" onClick={() => setShowDropdown(false)}>
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Einstellungen
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            handleLogout();
                          }}
                          disabled={isLoggingOut}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {isLoggingOut ? (
                            <>
                              <div className="animate-spin w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full mr-3"></div>
                              Abmelden...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              Abmelden
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Welcome Section */}
          <div className="mb-8 sm:mb-12">
            <div className="text-center sm:text-left mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-color mb-2 sm:mb-3">
                Willkommen zurück, <span className="primary-color">{providerData.name.split(" ")[0]}!</span>
              </h2>
              <p className="text-muted text-sm sm:text-base">
                Verwalten Sie Ihre Aufträge und Services
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Abgeschlossene Jobs */}
              <div className="professional-card p-4 sm:p-6">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#0a1b3d] flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-muted mb-1">Abgeschlossene Jobs</p>
                  <p className="text-2xl sm:text-3xl font-bold primary-color">{providerData.completedJobs}</p>
                </div>
              </div>

              {/* Gesamtverdienst */}
              <div className="professional-card p-4 sm:p-6">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#1e4a72] flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-muted mb-1">Gesamtverdienst</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold primary-color">€{providerData.totalEarnings.toFixed(0)}</p>
                </div>
              </div>

              {/* Bewertung */}
              <div className="professional-card p-4 sm:p-6">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#00b4d8] flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-muted mb-1">Durchschnittsbewertung</p>
                  <div className="flex items-center justify-center space-x-2">
                    <p className="text-2xl sm:text-3xl font-bold primary-color">{providerData.averageRating.toFixed(1)}</p>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(providerData.averageRating) ? "text-[#f77f00]" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Aktive Jobs */}
              <div className="professional-card p-4 sm:p-6">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl accent-gradient flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-muted mb-1">Aktive Jobs</p>
                  <p className="text-2xl sm:text-3xl font-bold primary-color">{providerData.activeJobs}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Schnellaktionen */}
          <div className="mb-8 sm:mb-12">
            <h3 className="text-lg sm:text-xl font-semibold text-color mb-4 sm:mb-6 text-center sm:text-left">
              Schnellaktionen
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                {
                  href: "./provider/jobs",
                  title: "Alle Aufträge",
                  desc: "Jobs verwalten",
                  icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
                  color: "#0a1b3d",
                },
                {
                  href: "/services",
                  title: "Meine Services",
                  desc: "Services bearbeiten",
                  icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
                  color: "#1e4a72",
                },
                {
                  href: "/chats",
                  title: "Nachrichten",
                  desc: "Mit Kunden chatten",
                  icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
                  color: "#00b4d8",
                },
                {
                  href: "/analytics",
                  title: "Statistiken",
                  desc: "Performance verfolgen",
                  icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                  color: "#1e4a72",
                },
              ].map((action, index) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group professional-card p-4 sm:p-6 text-center hover:scale-105 subtle-animation"
                >
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 subtle-animation"
                    style={{ backgroundColor: action.color }}
                  >
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-color mb-1 text-sm sm:text-base">{action.title}</h4>
                  <p className="text-xs text-muted hidden sm:block">{action.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Aktuelle Jobs */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-color">Aktuelle Jobs</h3>
              <Link href="./provider/jobs" className="text-sm font-medium secondary-color hover:underline flex items-center space-x-1">
                <span>Alle anzeigen</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.jobId} className="professional-card p-4 sm:p-6 subtle-animation">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                    {/* Job Info */}
                    <div className="flex-1 lg:mr-6">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                        <h3 className="font-semibold text-color text-lg">{job.title}</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium w-fit ${getStatusClass(job.status)}`}>
                          {getStatusText(job.status)}
                        </span>
                        <span className="text-xs text-muted bg-gray-100 px-2 py-1 rounded-full">
                          {job.contextType === ContextType.ORDER ? 'Bestellung' : 'Service'}
                        </span>
                      </div>

                      <p className="text-sm text-muted mb-4 line-clamp-2">{job.description}</p>

                      {/* Job Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-muted">{job.location.city}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <span className="text-muted">
                            {job.scheduled ? formatDate(job.scheduled.start) : 'Nicht geplant'}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span className="text-muted">
                            {Math.floor(job.durationInMin / 60)}h {job.durationInMin % 60}min
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium primary-color">
                            €{job.price.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Scheduled Time */}
                      {job.scheduled && (
                        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2 text-sm">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-blue-700">
                              Terminiert: {formatTime(job.scheduled.start)}
                              {job.scheduled.end && ` - ${formatTime(job.scheduled.end)}`}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-48">
                      {job.status === JobStatus.SCHEDULED && (
                        <button 
                          onClick={() => updateJobStatus(job.jobId, JobStatus.IN_PROGRESS)}
                          className="btn-primary px-4 py-2 text-sm font-medium rounded-lg shadow-sm hover:shadow-md"
                        >
                          <span className="flex items-center justify-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-7 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Starten</span>
                          </span>
                        </button>
                      )}
                      
                      {job.status === JobStatus.IN_PROGRESS && (
                        <button 
                          onClick={() => updateJobStatus(job.jobId, JobStatus.DELIVERED)}
                          className="btn-secondary px-4 py-2 text-sm font-medium rounded-lg shadow-sm hover:shadow-md"
                        >
                          <span className="flex items-center justify-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Abschließen</span>
                          </span>
                        </button>
                      )}

                      <Link
                        href={`./provider/jobs/${job.jobId}`}
                        className="btn-outline px-4 py-2 text-sm font-medium rounded-lg text-center"
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>Details</span>
                        </span>
                      </Link>

                      <Link
                        href={`/chats/${job.customerId}`}
                        className="btn-outline px-4 py-2 text-sm font-medium rounded-lg text-center"
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>Chat</span>
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Job Timeline Footer */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>Erstellt: {formatDate(job.createdAt)}</span>
                      <span className="flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span>Job #{job.jobId}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {recentJobs.length === 0 && (
              <div className="professional-card p-8 sm:p-12 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#f1f5f9] flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-color mb-2">Keine aktiven Jobs</h3>
                <p className="text-muted mb-6">
                  Sie haben derzeit keine laufenden Jobs. Überprüfen Sie Ihre Services oder warten Sie auf neue Anfragen!
                </p>
                <Link
                  href="/services"
                  className="btn-primary inline-flex items-center space-x-2 px-6 py-3 text-sm font-medium rounded-lg shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  </svg>
                  <span>Services verwalten</span>
                </Link>
              </div>
            )}
          </div>

          {/* Zusätzliche Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Letzte Aktivitäten */}
            <div className="professional-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-color">Letzte Aktivitäten</h3>
                <div className="w-2 h-2 rounded-full bg-[#06d6a0]"></div>
              </div>
              <div className="space-y-4">
                {[
                  {
                    action: "Job abgeschlossen",
                    detail: "Möbel aufbauen bei Familie Schmidt",
                    time: "2 Std. ago",
                    icon: "✓",
                    color: "#06d6a0",
                  },
                  {
                    action: "Neue Nachricht",
                    detail: "Anfrage von Anna Müller erhalten",
                    time: "4 Std. ago",
                    icon: "💬",
                    color: "#00b4d8",
                  },
                  {
                    action: "Job gestartet",
                    detail: "Umzug in der Müllerstraße",
                    time: "1 Tag ago",
                    icon: "🚚",
                    color: "#f77f00",
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 subtle-animation">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: activity.color }}
                    >
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-color text-sm">{activity.action}</p>
                      <p className="text-muted text-xs truncate">{activity.detail}</p>
                    </div>
                    <div className="text-xs text-muted">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Statistiken */}
            <div className="professional-card p-6">
              <h3 className="text-lg font-semibold text-color mb-6">Performance</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-muted font-medium">Kundenzufriedenheit</span>
                    <span className="font-semibold text-color">4.8/5</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#06d6a0] rounded-full subtle-animation" style={{ width: "96%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-muted font-medium">Rechtzeitige Fertigstellung</span>
                    <span className="font-semibold text-color">95%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#f77f00] rounded-full subtle-animation" style={{ width: "95%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-muted font-medium">Antwortzeit</span>
                    <span className="font-semibold text-color">&lt; 2h</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00b4d8] rounded-full subtle-animation" style={{ width: "90%" }}></div>
                  </div>
                </div>
              </div>

              {/* Earnings Box */}
              <div className="mt-6 p-4 rounded-lg bg-[#e0f2fe] border border-[#b3e5fc]">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#00b4d8] flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-color text-sm">Monatsverdienst</p>
                    <p className="text-xs text-muted">März 2025</p>
                    <p className="text-lg font-bold primary-color">€{(providerData.totalEarnings * 0.4).toFixed(0)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kürzliche Bewertungen */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-color">Kürzliche Bewertungen</h3>
              <Link href="/reviews" className="text-sm font-medium secondary-color hover:underline flex items-center space-x-1">
                <span>Alle anzeigen</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  customer: "Anna Schmidt",
                  rating: 5,
                  comment: "Perfekte Arbeit! Sehr professionell und pünktlich.",
                  service: "Möbel aufbauen",
                  date: "15. März 2025",
                },
                {
                  customer: "Thomas Müller",
                  rating: 5,
                  comment: "Schnell und zuverlässig. Gerne wieder!",
                  service: "Umzugshilfe",
                  date: "12. März 2025",
                },
                {
                  customer: "Sarah Weber",
                  rating: 4,
                  comment: "Sehr gute Arbeit, kleine Verzögerung beim Start.",
                  service: "Gartenpflege",
                  date: "10. März 2025",
                },
              ].map((review, index) => (
                <div key={index} className="professional-card p-4 hover:scale-105 subtle-animation">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-color text-sm">{review.customer}</h4>
                      <p className="text-xs text-muted">{review.service}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? "text-[#f77f00]" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-muted mb-3 italic">"{review.comment}"</p>
                  
                  <div className="text-xs text-muted">{review.date}</div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Click outside to close dropdown */}
        {showDropdown && (
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
        )}
      </div>
    </>
  );
};

export default ProviderDashboardPage;