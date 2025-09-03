"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";

// Typdefinitionen
interface Request {
  id: string;
  title: string;
  provider: string;
  date: string;
  status:
    | "posted"
    | "offers-received"
    | "in-progress"
    | "completed"
    | "disputed";
  price: number;
  offersCount?: number;
}

interface CustomerData {
  name: string;
  email: string;
  isVerified: boolean;
  completedRequests: number;
  timeSaved: number;
  averageRating: number;
}

const CustomerDashboardPage = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false); // <- Diese Zeile hinzufügen

  const [customerData] = useState<CustomerData>({
    name: "Anna Schneider",
    email: "anna.schneider@email.com",
    isVerified: true,
    completedRequests: 18,
    timeSaved: 47,
    averageRating: 4.9,
  });

  const [activeRequests] = useState<Request[]>([
    {
      id: "1",
      title: "Wohnungsrenovierung Küche",
      provider: "Michael Weber",
      date: "20. März 2025",
      status: "in-progress",
      price: 450.0,
    },
    {
      id: "2",
      title: "Entrümpelung Keller",
      provider: "",
      date: "22. März 2025",
      status: "offers-received",
      price: 30,
      offersCount: 7,
    },
    {
      id: "3",
      title: "Fahrrad reparieren",
      provider: "",
      date: "25. März 2025",
      status: "posted",
      price: 20,
      offersCount: 0,
    },
  ]);

  // KORRIGIERTE LOGOUT FUNKTION
  const handleLogout = async () => {
    try {
      console.log("🔄 Starting logout...");
      setIsLoggingOut(true);
      
      await logout(); // Echte Logout-Funktion aufrufen
      
      console.log("✅ Logout successful - redirecting to login");
      router.push("/login");
      
    } catch (error) {
      console.error("❌ Logout error:", error);
      setIsLoggingOut(false);
      // Optionally show error message to user
    }
  };

  const updateRequestStatus = (
    requestId: string,
    status: Request["status"]
  ) => {
    console.log(`Update request ${requestId} to status ${status}`);
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
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            system-ui, sans-serif;
          font-feature-settings: "cv02", "cv03", "cv04", "cv11";
          background: #f8fafc;
          min-height: 100vh;
          margin: 0;
          padding: 0;
          overscroll-behavior: none;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          color: #0b1220;
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
          box-shadow: 0 1px 3px rgba(11, 18, 32, 0.04),
            0 4px 12px rgba(11, 18, 32, 0.08);
          border: 1px solid rgba(11, 18, 32, 0.06);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .professional-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(11, 18, 32, 0.07),
            0 8px 25px rgba(11, 18, 32, 0.12);
        }

        .primary-gradient {
          background: linear-gradient(135deg, #0e2a6d 0%, #1a4db3 100%);
        }

        .accent-gradient {
          background: linear-gradient(135deg, #1a4db3 0%, #0ea5e9 100%);
        }

        .primary-color {
          color: #0e2a6d;
        }
        .secondary-color {
          color: #1a4db3;
        }
        .accent-color {
          color: #0ea5e9;
        }
        .text-color {
          color: #0b1220;
        }
        .text-muted {
          color: #64748b;
        }

        .btn-primary {
          background: #0e2a6d;
          color: white;
          border: none;
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          background: #1a4db3;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: #1a4db3;
          color: white;
          border: none;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          background: #0ea5e9;
          transform: translateY(-1px);
        }

        .btn-outline {
          background: transparent;
          color: #1a4db3;
          border: 1.5px solid #1a4db3;
          transition: all 0.2s ease;
        }

        .btn-outline:hover {
          background: #1a4db3;
          color: white;
        }

        .status-posted {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #cbd5e1;
        }

        .status-offers {
          background: #dbeafe;
          color: #1e40af;
          border: 1px solid #93c5fd;
        }

        .status-progress {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .status-completed {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .touch-action {
          touch-action: manipulation;
          user-select: none;
          -webkit-user-select: none;
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

        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .slide-up {
          animation: slideUp 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .stagger-1 {
          animation-delay: 0.1s;
        }
        .stagger-2 {
          animation-delay: 0.2s;
        }
        .stagger-3 {
          animation-delay: 0.3s;
        }
        .stagger-4 {
          animation-delay: 0.4s;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .professional-card {
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(11, 18, 32, 0.06),
              0 2px 8px rgba(11, 18, 32, 0.1);
          }

          .professional-card:hover {
            transform: none;
          }
        }
      `}</style>

      <div
        className="min-h-screen mobile-safe"
        style={{ background: "#F8FAFC" }}
      >
        {/* Header */}
        <header
          className="glass-effect sticky top-0 z-50 border-b"
          style={{ borderColor: "rgba(11, 18, 32, 0.08)" }}
        >
          <div className="primary-gradient">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="flex items-center justify-between">
                {/* Logo & Brand */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                    <svg
                      className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                      Side-Hustlers
                    </h1>
                    <p className="text-white/80 text-sm hidden sm:block font-medium">
                      Kunden-Portal
                    </p>
                  </div>
                </div>

                {/* User Info & Actions */}
                <div className="flex items-center space-x-3 sm:space-x-6">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white font-semibold text-sm sm:text-base border border-white/20">
                        {customerData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      {customerData.isVerified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3"
                            style={{ color: "#0EA5E9" }}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="hidden sm:block">
                      <div className="text-white font-medium text-sm">
                        {customerData.name}
                      </div>
                      <div className="text-white/70 text-xs">
                        {customerData.email}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="touch-action px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium text-white rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 subtle-animation disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoggingOut ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full sm:hidden"></div>
                        <span className="hidden sm:inline flex items-center">
                          <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Abmelden...
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Abmelden</span>
                        <svg
                          className="w-5 h-5 sm:hidden"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Welcome Section */}
          <div className="mb-8 sm:mb-12 fade-in">
            <div className="text-center sm:text-left mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-color mb-2 sm:mb-3">
                Willkommen zurück,{" "}
                <span className="primary-color">
                  {customerData.name.split(" ")[0]}!
                </span>
              </h2>
              <p className="text-muted text-sm sm:text-base">
                Verwalten Sie Ihre Aufträge und finden Sie professionelle Helfer
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="professional-card p-4 sm:p-6 stagger-1 slide-up">
                <div className="text-center sm:text-left">
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mx-auto sm:mx-0 mb-3 sm:mb-4"
                    style={{ backgroundColor: "#0E2A6D" }}
                  >
                    <svg
                      className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-muted mb-1">
                    Abgeschlossene Aufträge
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold primary-color">
                    {customerData.completedRequests}
                  </p>
                </div>
              </div>

              <div className="professional-card p-4 sm:p-6 stagger-2 slide-up">
                <div className="text-center sm:text-left">
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mx-auto sm:mx-0 mb-3 sm:mb-4"
                    style={{ backgroundColor: "#1A4DB3" }}
                  >
                    <svg
                      className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-muted mb-1">
                    Gesparte Zeit
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold primary-color">
                    {customerData.timeSaved} Std.
                  </p>
                </div>
              </div>

              <div className="professional-card p-4 sm:p-6 stagger-3 slide-up">
                <div className="text-center sm:text-left">
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mx-auto sm:mx-0 mb-3 sm:mb-4"
                    style={{ backgroundColor: "#0EA5E9" }}
                  >
                    <svg
                      className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-muted mb-1">
                    Meine Bewertung
                  </p>
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <p className="text-2xl sm:text-3xl font-bold primary-color">
                      {customerData.averageRating.toFixed(1)}
                    </p>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(customerData.averageRating)
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
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

              <div className="professional-card p-4 sm:p-6 stagger-4 slide-up">
                <div className="text-center sm:text-left">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mx-auto sm:mx-0 mb-3 sm:mb-4 accent-gradient">
                    <svg
                      className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-muted mb-1">
                    Aktive Anfragen
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold primary-color">
                    {activeRequests.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8 sm:mb-12">
            <h3 className="text-lg sm:text-xl font-semibold text-color mb-4 sm:mb-6 text-center sm:text-left">
              Schnellaktionen
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                {
                  href: "/request",
                  title: "Hilfe suchen",
                  desc: "Neue Anfrage erstellen",
                  icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
                  color: "#0E2A6D",
                },
                {
                  href: "/providers",
                  title: "Anbieter finden",
                  desc: "Profile durchsuchen",
                  icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
                  color: "#1A4DB3",
                },
                {
                  href: "/messages",
                  title: "Nachrichten",
                  desc: "Mit Anbietern chatten",
                  icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
                  color: "#0EA5E9",
                },
                {
                  href: "/profile",
                  title: "Mein Profil",
                  desc: "Einstellungen verwalten",
                  icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                  color: "#1A4DB3",
                },
              ].map((action, index) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group professional-card p-4 sm:p-6 text-center hover:scale-105 subtle-animation touch-action"
                >
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 subtle-animation`}
                    style={{ backgroundColor: action.color }}
                  >
                    <svg
                      className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={action.icon}
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-color mb-1 text-sm sm:text-base">
                    {action.title}
                  </h4>
                  <p className="text-xs text-muted hidden sm:block">
                    {action.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Active Requests */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-color">
                Meine Anfragen
              </h3>
              <Link
                href="/requests"
                className="text-sm font-medium secondary-color hover:underline flex items-center space-x-1 touch-action"
              >
                <span>Alle anzeigen</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            <div className="space-y-4">
              {activeRequests.map((request, index) => (
                <div
                  key={request.id}
                  className={`professional-card p-4 sm:p-6 subtle-animation stagger-${
                    index + 1
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                        <h4 className="font-semibold text-color text-base sm:text-lg">
                          {request.title}
                        </h4>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium w-fit ${
                            request.status === "posted"
                              ? "status-posted"
                              : request.status === "offers-received"
                              ? "status-offers"
                              : request.status === "in-progress"
                              ? "status-progress"
                              : request.status === "completed"
                              ? "status-completed"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {request.status === "posted"
                            ? "Veröffentlicht"
                            : request.status === "offers-received"
                            ? `${request.offersCount} Angebote`
                            : request.status === "in-progress"
                            ? "In Bearbeitung"
                            : request.status === "completed"
                            ? "Abgeschlossen"
                            : "Streitfall"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted mb-4">
                        {request.provider && (
                          <div className="flex items-center space-x-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                              />
                            </svg>
                            <span>€{request.price.toFixed(2)}</span>
                          </div>
                        )}
                        {request.status === "offers-received" &&
                          request.offersCount &&
                          request.offersCount > 0 && (
                            <div className="flex items-center space-x-2 font-medium accent-color">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              <span>
                                {request.offersCount} Angebote erhalten
                              </span>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {request.status === "offers-received" && (
                      <Link
                        href={`/requests/${request.id}/offers`}
                        className="btn-primary touch-action flex-1 sm:flex-none px-4 py-3 sm:py-2 text-sm font-medium rounded-lg shadow-sm hover:shadow-md text-center"
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span>Angebote ansehen</span>
                        </span>
                      </Link>
                    )}

                    {request.status === "in-progress" && (
                      <button
                        onClick={() =>
                          updateRequestStatus(request.id, "completed")
                        }
                        className="btn-secondary touch-action flex-1 sm:flex-none px-4 py-3 sm:py-2 text-sm font-medium rounded-lg shadow-sm hover:shadow-md"
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>Als erledigt markieren</span>
                        </span>
                      </button>
                    )}

                    {request.status === "posted" && (
                      <Link
                        href={`/requests/${request.id}/edit`}
                        className="btn-outline touch-action flex-1 sm:flex-none px-4 py-3 sm:py-2 text-sm font-medium rounded-lg text-center"
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          <span>Bearbeiten</span>
                        </span>
                      </Link>
                    )}

                    <Link
                      href={`/requests/${request.id}`}
                      className="btn-outline touch-action flex-1 sm:flex-none px-4 py-3 sm:py-2 text-sm font-medium rounded-lg text-center"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        <span>Details</span>
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {activeRequests.length === 0 && (
              <div className="professional-card p-8 sm:p-12 text-center">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: "#F1F5F9" }}
                >
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-color mb-2">
                  Keine aktiven Anfragen
                </h3>
                <p className="text-muted mb-6">
                  Sie haben derzeit keine laufenden Anfragen. Erstellen Sie eine
                  neue Anfrage für Ihre nächste Aufgabe!
                </p>
                <Link
                  href="/request"
                  className="btn-primary inline-flex items-center space-x-2 px-6 py-3 text-sm font-medium rounded-lg shadow-sm hover:shadow-md"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Neue Anfrage erstellen</span>
                </Link>
              </div>
            )}
          </div>

          {/* Additional Insights Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Activity */}
            <div className="professional-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-color">
                  Letzte Aktivitäten
                </h3>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "#10B981" }}
                ></div>
              </div>
              <div className="space-y-4">
                {[
                  {
                    action: "Angebot angenommen",
                    detail: "Küchenmontage von Michael Weber",
                    time: "3 Std. ago",
                    icon: "✓",
                    color: "#10B981",
                  },
                  {
                    action: "Neue Nachricht",
                    detail: "Antwort von Sarah Koch erhalten",
                    time: "5 Std. ago",
                    icon: "💬",
                    color: "#0EA5E9",
                  },
                  {
                    action: "Bewertung abgegeben",
                    detail: "5 Sterne für Gartenpflege",
                    time: "1 Tag ago",
                    icon: "★",
                    color: "#F59E0B",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 subtle-animation"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: activity.color }}
                    >
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-color text-sm">
                        {activity.action}
                      </p>
                      <p className="text-muted text-xs truncate">
                        {activity.detail}
                      </p>
                    </div>
                    <div className="text-xs text-muted">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Savings & Stats */}
            <div className="professional-card p-6">
              <h3 className="text-lg font-semibold text-color mb-6">
                Ihre Statistiken
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-muted font-medium">
                      Anbieter-Zufriedenheit
                    </span>
                    <span className="font-semibold text-color">4.9/5</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full subtle-animation"
                      style={{ width: "98%", backgroundColor: "#10B981" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-muted font-medium">
                      Pünktliche Zahlung
                    </span>
                    <span className="font-semibold text-color">100%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full subtle-animation"
                      style={{ width: "100%", backgroundColor: "#F59E0B" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-muted font-medium">Antwortzeit</span>
                    <span className="font-semibold text-color"> 1h</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full subtle-animation"
                      style={{ width: "95%", backgroundColor: "#0EA5E9" }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Savings Box */}
              <div
                className="mt-6 p-4 rounded-lg"
                style={{
                  backgroundColor: "#F0F9FF",
                  border: "1px solid #E0F2FE",
                }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#0EA5E9" }}
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-color text-sm">
                      Geschätzte Ersparnis
                    </p>
                    <p className="text-xs text-muted">
                      Verglichen mit traditionellen Dienstleistern
                    </p>
                    <p className="text-lg font-bold primary-color">€340</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Providers Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-color">
                Empfohlene Anbieter
              </h3>
              <Link
                href="/providers"
                className="text-sm font-medium secondary-color hover:underline flex items-center space-x-1 touch-action"
              >
                <span>Alle anzeigen</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
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
              ].map((provider, index) => (
                <div
                  key={provider.name}
                  className="professional-card p-4 hover:scale-105 subtle-animation"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: "#1A4DB3" }}
                    >
                      {provider.image}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-color text-sm">
                        {provider.name}
                      </h4>
                      <p className="text-xs text-muted">{provider.skills}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <svg
                        className="w-4 h-4 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium text-color">
                        {provider.rating}
                      </span>
                    </div>
                    <span className="text-xs text-muted">
                      {provider.jobs} Aufträge
                    </span>
                  </div>

                  <Link
                    href={`/providers/${provider.name
                      .toLowerCase()
                      .replace(" ", "-")}`}
                    className="btn-outline w-full mt-3 px-3 py-2 text-xs font-medium rounded-lg text-center"
                  >
                    Profil ansehen
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <div
          className="fixed bottom-0 left-0 right-0 lg:hidden glass-effect border-t z-40"
          style={{ borderColor: "rgba(11, 18, 32, 0.08)" }}
        >
          <div className="grid grid-cols-4 gap-1 px-4 py-3">
            {[
              {
                href: "/",
                icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
                label: "Home",
                active: true,
              },
              {
                href: "/requests",
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
                label: "Anfragen",
              },
              {
                href: "/messages",
                icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
                label: "Chat",
              },
              {
                href: "/profile",
                icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                label: "Profil",
              },
            ].map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`touch-action flex flex-col items-center py-2 px-2 rounded-lg subtle-animation ${
                  item.active ? "text-white" : "text-muted hover:text-color"
                }`}
                style={item.active ? { backgroundColor: "#0E2A6D" } : {}}
              >
                <svg
                  className="w-5 h-5 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={item.active ? 2.5 : 2}
                    d={item.icon}
                  />
                </svg>
                <span
                  className={`text-xs font-medium ${
                    item.active ? "font-semibold" : ""
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Floating Action Button (Mobile) */}
        <div className="fixed bottom-20 right-4 lg:hidden z-50">
          <Link
            href="/request"
            className="touch-action w-14 h-14 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center subtle-animation"
            style={{ backgroundColor: "#0E2A6D" }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </Link>
        </div>

        {/* Scroll to Top Button */}
        <div className="fixed bottom-20 left-4 lg:bottom-8 lg:right-8 z-50">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="touch-action w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg flex items-center justify-center subtle-animation border"
            style={{ borderColor: "rgba(11, 18, 32, 0.08)" }}
          >
            <svg
              className="w-5 h-5 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default CustomerDashboardPage;
