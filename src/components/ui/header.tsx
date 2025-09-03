'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface User {
  name: string;
  email: string;
  isVerified: boolean;
  type: 'provider' | 'customer';
}

interface HeaderProps {
  variant?: 'landing' | 'dashboard' | 'search' | 'auth';
  user?: User | null;
  onLogout?: () => void;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  className?: string;
}

const Header = ({ 
  variant = 'landing', 
  user = null, 
  onLogout, 
  showSearch = false,
  searchValue = '',
  onSearchChange,
  className = ''
}: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (onLogout) onLogout();
    setIsProfileMenuOpen(false);
  };

  const getSubtitle = () => {
    if (variant === 'dashboard' && user) {
      return user.type === 'provider' ? 'Professional Services' : 'Kunden-Portal';
    }
    return 'Professionelle Nachbarschaftshilfe';
  };

  const getNavigationLinks = () => {
    if (variant === 'landing') {
      return [
        { href: '/services', label: 'Services' },
        { href: '/providers', label: 'Anbieter' },
        { href: '/how-it-works', label: 'So funktioniert\'s' },
        { href: '/about', label: 'Über uns' }
      ];
    }
    if (variant === 'dashboard' && user) {
      if (user.type === 'provider') {
        return [
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/jobs', label: 'Aufträge' },
          { href: '/services', label: 'Meine Services' },
          { href: '/messages', label: 'Nachrichten' }
        ];
      } else {
        return [
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/requests', label: 'Meine Anfragen' },
          { href: '/providers', label: 'Anbieter finden' },
          { href: '/messages', label: 'Nachrichten' }
        ];
      }
    }
    return [];
  };

  const navigationLinks = getNavigationLinks();

  return (
    <>
      <style jsx global>{`
        .header-glass {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .primary-gradient {
          background: linear-gradient(135deg, #0E2A6D 0%, #1A4DB3 100%);
        }
        
        .dropdown-menu {
          background: #FFFFFF;
          border-radius: 12px;
          box-shadow: 
            0 4px 6px rgba(11, 18, 32, 0.07),
            0 8px 25px rgba(11, 18, 32, 0.12);
          border: 1px solid rgba(11, 18, 32, 0.06);
        }
        
        .mobile-menu {
          background: #FFFFFF;
          box-shadow: 
            0 4px 6px rgba(11, 18, 32, 0.07),
            0 8px 25px rgba(11, 18, 32, 0.12);
        }
        
        .search-input {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          transition: all 0.3s ease;
        }
        
        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .search-input:focus {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.4);
          outline: none;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
        }
        
        .btn-primary {
          background: #0E2A6D;
          color: white;
          border: none;
          transition: all 0.2s ease;
        }
        
        .btn-primary:hover {
          background: #1A4DB3;
          transform: translateY(-1px);
        }
        
        .btn-outline {
          background: transparent;
          color: white;
          border: 1.5px solid rgba(255, 255, 255, 0.3);
          transition: all 0.2s ease;
        }
        
        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }
        
        .nav-link {
          color: rgba(255, 255, 255, 0.9);
          transition: all 0.2s ease;
        }
        
        .nav-link:hover {
          color: white;
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
        }
        
        @media (max-width: 768px) {
          .mobile-menu {
            border-radius: 0 0 16px 16px;
          }
        }
      `}</style>

      <header className={`header-glass sticky top-0 z-50 border-b ${variant === 'landing' ? '' : 'border-gray-200/50'} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 primary-gradient">
            <div className="flex items-center justify-between py-4 sm:py-6"> {/* justify-start statt justify-center */}
              
              <div className="overflow-visible"> {/* Einfacher Container ohne Flex */}
                <Image
                  src="/logo_text_weiss.svg"
                  alt="Side-Hustlers Logo"
                  width={200}
                  height={40}
                  className="h-8 sm:h-10 w-auto transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>

              {/* Search Bar (for search pages) */}
              {showSearch && (
                <div className="hidden md:flex flex-1 max-w-lg mx-8">
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Services durchsuchen..."
                      value={searchValue}
                      onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                      className="search-input block w-full pl-10 pr-4 py-2.5 rounded-lg text-sm font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                {/* Navigation Links */}
                {navigationLinks.length > 0 && (
                  <nav className="flex items-center space-x-6">
                    {navigationLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="nav-link text-sm font-medium hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                )}

                {/* User Section */}
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center space-x-3 text-white hover:bg-white/10 rounded-lg px-3 py-2 transition-colors"
                    >
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white font-semibold text-sm border border-white/20">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {user.isVerified && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5" style={{color: '#0EA5E9'}} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="hidden xl:block text-left">
                        <div className="text-sm font-medium">{user.name}</div>
                        <div className="text-xs text-white/70">{user.email}</div>
                      </div>
                      <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 dropdown-menu py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                          {user.isVerified && (
                            <span className="inline-flex items-center mt-1 px-2 py-1 rounded-full text-xs font-medium text-blue-700 bg-blue-50">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Verifiziert
                            </span>
                          )}
                        </div>
                        <Link href="/profile" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Mein Profil
                        </Link>
                        <Link href="/settings" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Einstellungen
                        </Link>
                        <div className="border-t border-gray-100">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-sm text-red-700 hover:bg-red-50"
                          >
                            <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Abmelden
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link href="/login" className="btn-outline px-4 py-2 text-sm font-medium rounded-lg">
                      Anmelden
                    </Link>
                    <Link href="/register" className="btn-primary px-4 py-2 text-sm font-medium rounded-lg">
                      Registrieren
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden flex items-center space-x-3">
                {user && (
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white font-semibold text-sm border border-white/20">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    {user.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5" style={{color: '#0EA5E9'}} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
                
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              
              </div>
            </div>
          </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mobile-menu border-t border-white/10">
            <div className="px-4 py-4 space-y-3">
              {/* Search on mobile */}
              {showSearch && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Services durchsuchen..."
                    value={searchValue}
                    onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm"
                  />
                </div>
              )}

              {/* Navigation Links */}
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* User Actions */}
              {user ? (
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Mein Profil
                  </Link>
                  <Link
                    href="/settings"
                    className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Einstellungen
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-red-700 hover:text-red-900 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Abmelden
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <Link
                    href="/login"
                    className="block text-center text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Anmelden
                  </Link>
                  <Link
                    href="/register"
                    className="block text-center text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Registrieren
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Click outside to close dropdowns */}
      {(isMobileMenuOpen || isProfileMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsProfileMenuOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Header;