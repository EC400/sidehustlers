// src/app/dashboard/customer
"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Booking } from "@/src/types/booking";

interface CustomerData {
  name: string;
  email: string;
  isVerified: boolean;
  completedBookings: number;
  timeSaved: number;
  averageRating: number;
}

const CustomerDashboardPage = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [customerData] = useState<CustomerData>({
    name: "Anna Schneider",
    email: "anna.schneider@email.com",
    isVerified: true,
    completedBookings: 18,
    timeSaved: 47,
    averageRating: 4.9,
  });

  const [activeBookings] = useState<Booking[]>([
    {
      bookingId: "1",
      customerId: "customer1",
      serviceId: "service1",
      message: "Wohnungsrenovierung Küche",
      time: "20. März 2025",
      budget: 450.0,
      description: "Küche komplett renovieren",
      status: "accepted",
      createdAt: "2025-03-15T10:00:00Z",
      response: "Angenommen von Michael Weber"
    },
    {
      bookingId: "2",
      customerId: "customer1",
      serviceId: "service2",
      message: "Entrümpelung Keller",
      time: "22. März 2025",
      budget: 30,
      description: "Keller entrümpeln",
      status: "answered",
      createdAt: "2025-03-16T14:00:00Z",
      response: "7 Angebote erhalten"
    },
    {
      bookingId: "3",
      customerId: "customer1",
      serviceId: "service3",
      message: "Fahrrad reparieren",
      time: "25. März 2025",
      budget: 20,
      description: "Fahrrad Wartung",
      status: "open",
      createdAt: "2025-03-17T09:00:00Z"
    },
  ]);

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

  const updateBookingStatus = (bookingId: string, status: Booking["status"]) => {
    console.log(`Update booking ${bookingId} to status ${status}`);
  };

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

        .status-open {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #cbd5e1;
        }

        .status-answered {
          background: #e0f2fe;
          color: #0369a1;
          border: 1px solid #7dd3fc;
        }

        .status-accepted {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .status-denied {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
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

        .content-loaded {
          opacity: 1;
          transform: translateY(0);
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
                    <img 
                      src="/logo.svg" 
                      alt="SideHustlers Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                      Sidehustlers
                    </h1>
                    <p className="text-white/80 text-sm hidden sm:block font-medium">
                      Kunden-Portal
                    </p>
                  </div>
                </div>

                {/* Navigation - Desktop */}
                <nav className="hidden lg:flex items-center space-x-8">
                  <Link 
                    href="/dashboard/customer" 
                    className="text-white/90 hover:text-white font-medium transition-colors border-b-2 border-white/30 pb-1"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/services" 
                    className="text-white/70 hover:text-white font-medium transition-colors"
                  >
                    Services
                  </Link>
                  <Link 
                    href="/bookings" 
                    className="text-white/70 hover:text-white font-medium transition-colors"
                  >
                    Meine Buchungen
                  </Link>
                  <Link 
                    href="/chats" 
                    className="text-white/70 hover:text-white font-medium transition-colors"
                  >
                    Chats
                  </Link>
                </nav>

                {/* User Info & Dropdown */}
                <div className="flex items-center space-x-3 sm:space-x-6">
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-2 hover:bg-white/20 transition-all duration-200"
                    >
                      <div className="relative">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white font-semibold text-sm border border-white/20">
                          {customerData.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        {customerData.isVerified && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#06d6a0] rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="hidden sm:block">
                        <div className="text-white font-medium text-sm">{customerData.name}</div>
                        <div className="text-white/70 text-xs">{customerData.email}</div>
                      </div>

                      <svg className={`w-4 h-4 text-white/70 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                        {/* Mobile Navigation Links */}
                        <div className="lg:hidden border-b border-gray-100 pb-2 mb-2">
                          <Link href="/dashboard/customer" className="flex items-center px-4 py-3 text-sm font-medium text-[#0a1b3d] bg-[#0a1b3d]/5" onClick={() => setShowDropdown(false)}>
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Dashboard
                          </Link>
                          <Link href="/services" className="flex items-center px-4 py-3 text-sm text-[#0f172a] hover:bg-gray-50" onClick={() => setShowDropdown(false)}>
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H8a2 2 0 00-2-2V6" />
                            </svg>
                            Services
                          </Link>
                          <Link href="/bookings" className="flex items-center px-4 py-3 text-sm text-[#0f172a] hover:bg-gray-50" onClick={() => setShowDropdown(false)}>
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            Meine Buchungen
                          </Link>
                          <Link href="/chats" className="flex items-center px-4 py-3 text-sm text-[#0f172a] hover:bg-gray-50" onClick={() => setShowDropdown(false)}>
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Chats
                          </Link>
                        </div>

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
          <div className="mb-8 sm:mb-12 content-loaded">
            <div className="text-center sm:text-left mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-color mb-2 sm:mb-3">
                Willkommen zurück, <span className="primary-color">{customerData.name.split(" ")[0]}!</span>
              </h2>
              <p className="text-muted text-sm sm:text-base">
                Verwalten Sie Ihre Buchungen und finden Sie professionelle Helfer
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Abgeschlossene Buchungen */}
              <div className="professional-card p-4 sm:p-6 content-loaded">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#0a1b3d] flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-muted mb-1">Abgeschlossene Buchungen</p>
                  <p className="text-2xl sm:text-3xl font-bold primary-color">{customerData.completedBookings}</p>
                </div>
              </div>

              {/* Gesparte Zeit */}
              <div className="professional-card p-4 sm:p-6 content-loaded">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#1e4a72] flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-muted mb-1">Gesparte Zeit</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold primary-color">{customerData.timeSaved} Std.</p>
                </div>
              </div>

              {/* Meine Bewertung */}
              <div className="professional-card p-4 sm:p-6 content-loaded">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#00b4d8] flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-muted mb-1">Meine Bewertung</p>
                  <div className="flex items-center justify-center space-x-2">
                    <p className="text-2xl sm:text-3xl font-bold primary-color">{customerData.averageRating.toFixed(1)}</p>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(customerData.averageRating) ? "text-[#f77f00]" : "text-gray-300"}`}
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

              {/* Aktive Buchungen */}
              <div className="professional-card p-4 sm:p-6 content-loaded">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl accent-gradient flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-muted mb-1">Aktive Buchungen</p>
                  <p className="text-2xl sm:text-3xl font-bold primary-color">{activeBookings.length}</p>
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
                  href: "/booking",
                  title: "Hilfe buchen",
                  desc: "Neue Buchung erstellen",
                  icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
                  color: "#0a1b3d",
                },
                {
                  href: "/services",
                  title: "Services finden",
                  desc: "Profile durchsuchen",
                  icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
                  color: "#1e4a72",
                },
                {
                  href: "/chats",
                  title: "Nachrichten",
                  desc: "Mit Anbietern chatten",
                  icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
                  color: "#00b4d8",
                },
                {
                  href: "/profile",
                  title: "Mein Profil",
                  desc: "Einstellungen verwalten",
                  icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
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

          {/* Meine Buchungen */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-color">Meine Buchungen</h3>
              <Link href="/bookings" className="text-sm font-medium secondary-color hover:underline flex items-center space-x-1">
                <span>Alle anzeigen</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="space-y-4">
              {activeBookings.map((booking) => (
                <div key={booking.bookingId} className="professional-card p-4 sm:p-6 subtle-animation">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                        <h4 className="font-semibold text-color text-base sm:text-lg">{booking.message}</h4>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium w-fit ${
                            booking.status === "open"
                              ? "status-open"
                              : booking.status === "answered"
                              ? "status-answered"
                              : booking.status === "accepted"
                              ? "status-accepted"
                              : booking.status === "denied"
                              ? "status-denied"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {booking.status === "open"
                            ? "Offen"
                            : booking.status === "answered"
                            ? "Angebote erhalten"
                            : booking.status === "accepted"
                            ? "Akzeptiert"
                            : booking.status === "denied"
                            ? "Abgelehnt"
                            : "Unbekannt"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted mb-4">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          <span>€{booking.budget.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h.5a2.5 2.5 0 010 5H16v4a1 1 0 01-1 1H9a1 1 0 01-1-1v-4h-.5a2.5 2.5 0 010-5H8z" />
                          </svg>
                          <span>{booking.time}</span>
                        </div>
                        {booking.status === "answered" && booking.response && (
                          <div className="flex items-center space-x-2 font-medium accent-color">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>{booking.response}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {booking.status === "answered" && (
                      <Link
                        href={`/bookings/${booking.bookingId}/offers`}
                        className="btn-primary flex-1 sm:flex-none px-4 py-3 sm:py-2 text-sm font-medium rounded-lg shadow-sm hover:shadow-md text-center"
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Angebote ansehen</span>
                        </span>
                      </Link>
                    )}

                    {booking.status === "accepted" && (
                      <button
                        onClick={() => updateBookingStatus(booking.bookingId, "accepted")}
                        className="btn-secondary flex-1 sm:flex-none px-4 py-3 sm:py-2 text-sm font-medium rounded-lg shadow-sm hover:shadow-md"
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Als erledigt markieren</span>
                        </span>
                      </button>
                    )}

                    {booking.status === "open" && (
                      <Link
                        href={`/bookings/${booking.bookingId}/edit`}
                        className="btn-outline flex-1 sm:flex-none px-4 py-3 sm:py-2 text-sm font-medium rounded-lg text-center"
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Bearbeiten</span>
                        </span>
                      </Link>
                    )}

                    <Link
                      href={`/bookings/${booking.bookingId}`}
                      className="btn-outline flex-1 sm:flex-none px-4 py-3 sm:py-2 text-sm font-medium rounded-lg text-center"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Details</span>
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {activeBookings.length === 0 && (
              <div className="professional-card p-8 sm:p-12 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#f1f5f9] flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-color mb-2">Keine aktiven Buchungen</h3>
                <p className="text-muted mb-6">
                  Sie haben derzeit keine laufenden Buchungen. Erstellen Sie eine neue Buchung für Ihre nächste Aufgabe!
                </p>
                <Link
                  href="/booking"
                  className="btn-primary inline-flex items-center space-x-2 px-6 py-3 text-sm font-medium rounded-lg shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Neue Buchung erstellen</span>
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
                    action: "Buchung angenommen",
                    detail: "Küchenmontage von Michael Weber",
                    time: "3 Std. ago",
                    icon: "✓",
                    color: "#06d6a0",
                  },
                  {
                    action: "Neue Nachricht",
                    detail: "Antwort von Sarah Koch erhalten",
                    time: "5 Std. ago",
                    icon: "💬",
                    color: "#00b4d8",
                  },
                  {
                    action: "Bewertung abgegeben",
                    detail: "5 Sterne für Gartenpflege",
                    time: "1 Tag ago",
                    icon: "⭐",
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

            {/* Statistiken & Ersparnis */}
            <div className="professional-card p-6">
              <h3 className="text-lg font-semibold text-color mb-6">Ihre Statistiken</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-muted font-medium">Anbieter-Zufriedenheit</span>
                    <span className="font-semibold text-color">4.9/5</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#06d6a0] rounded-full subtle-animation" style={{ width: "98%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-muted font-medium">Pünktliche Zahlung</span>
                    <span className="font-semibold text-color">100%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#f77f00] rounded-full subtle-animation" style={{ width: "100%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-muted font-medium">Antwortzeit</span>
                    <span className="font-semibold text-color"> 1h</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00b4d8] rounded-full subtle-animation" style={{ width: "95%" }}></div>
                  </div>
                </div>
              </div>

              {/* Ersparnis Box */}
              <div className="mt-6 p-4 rounded-lg bg-[#e0f2fe] border border-[#b3e5fc]">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#00b4d8] flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-color text-sm">Geschätzte Ersparnis</p>
                    <p className="text-xs text-muted">Verglichen mit traditionellen Dienstleistern</p>
                    <p className="text-lg font-bold primary-color">€340</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Empfohlene Anbieter */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-color">Empfohlene Anbieter</h3>
              <Link href="/services" className="text-sm font-medium secondary-color hover:underline flex items-center space-x-1">
                <span>Alle anzeigen</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  name: "Michael Weber",
                  skills: "Handwerk, Renovierung",
                  rating: 4.9,
                  jobs: 45,
                  image: "MW",
                },
                {
                  name: "Sarah Koch",
                  skills: "Garten, Reinigung",
                  rating: 4.8,
                  jobs: 32,
                  image: "SK",
                },
                {
                  name: "Thomas Müller",
                  skills: "Umzug, Transport",
                  rating: 4.9,
                  jobs: 28,
                  image: "TM",
                },
              ].map((provider) => (
                <div key={provider.name} className="professional-card p-4 hover:scale-105 subtle-animation">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-[#1e4a72] flex items-center justify-center text-white font-semibold">
                      {provider.image}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-color text-sm">{provider.name}</h4>
                      <p className="text-xs text-muted">{provider.skills}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-[#f77f00]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium text-color">{provider.rating}</span>
                    </div>
                    <span className="text-xs text-muted">{provider.jobs} Buchungen</span>
                  </div>

                  <Link
                    href={`/services/${provider.name.toLowerCase().replace(" ", "-")}`}
                    className="btn-outline w-full mt-3 px-3 py-2 text-xs font-medium rounded-lg text-center"
                  >
                    Profil ansehen
                  </Link>
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

export default CustomerDashboardPage;