'use client';

import Link from 'next/link';
import Image from 'next/image';

interface FooterProps {
  variant?: 'landing' | 'app' | 'minimal';
  className?: string;
}

const Footer = ({ variant = 'landing', className = '' }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  const getFooterLinks = () => {
    return {
      company: [
        { label: 'Über uns', href: '/about' },
        { label: 'Karriere', href: '/careers' },
        { label: 'Presse', href: '/press' },
        { label: 'Blog', href: '/blog' }
      ],
      services: [
        { label: 'Für Anbieter', href: '/providers' },
        { label: 'Für Kunden', href: '/customers' },
        { label: 'Preise', href: '/pricing' },
        { label: 'So funktioniert\'s', href: '/how-it-works' }
      ],
      support: [
        { label: 'Hilfe-Center', href: '/help' },
        { label: 'Kontakt', href: '/contact' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Status', href: '/status' }
      ],
      legal: [
        { label: 'Datenschutz', href: '/privacy' },
        { label: 'AGB', href: '/terms' },
        { label: 'Impressum', href: '/imprint' },
        { label: 'Cookies', href: '/cookies' }
      ]
    };
  };

  if (variant === 'minimal') {
    return (
      <>
        <style jsx global>{`
          .footer-minimal {
            background: #F8FAFC;
            border-top: 1px solid rgba(11, 18, 32, 0.08);
          }
          
          .text-color { color: #0B1220; }
          .text-muted { color: #64748B; }
          .primary-color { color: #0E2A6D; }
          .hover-primary:hover { color: #1A4DB3; }
        `}</style>
        
        <footer className={`footer-minimal py-6 ${className}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <Image
                  src="/logo_text_weiss.svg"
                  alt="Side-Hustlers Logo"
                  width={120}
                  height={24}
                  className="h-6 w-auto opacity-60"
                />
                <span className="text-muted text-sm">
                  © {currentYear} Side-Hustlers. Alle Rechte vorbehalten.
                </span>
              </div>
              <div className="flex items-center space-x-6">
                <Link href="/privacy" className="text-muted hover-primary text-sm transition-colors">
                  Datenschutz
                </Link>
                <Link href="/terms" className="text-muted hover-primary text-sm transition-colors">
                  AGB
                </Link>
                <Link href="/imprint" className="text-muted hover-primary text-sm transition-colors">
                  Impressum
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </>
    );
  }

  const footerLinks = getFooterLinks();

  return (
    <>
      <style jsx global>{`
        .footer-gradient {
          background: linear-gradient(135deg, #0E2A6D 0%, #1A4DB3 50%, #0EA5E9 100%);
        }
        
        .footer-app {
          background: #F8FAFC;
          border-top: 1px solid rgba(11, 18, 32, 0.08);
        }
        
        .text-color { color: #0B1220; }
        .text-muted { color: #64748B; }
        .primary-color { color: #0E2A6D; }
        .hover-primary:hover { color: #1A4DB3; }
        
        .footer-link {
          transition: all 0.2s ease;
        }
        
        .footer-link:hover {
          transform: translateY(-1px);
        }
        
        .social-icon {
          transition: all 0.3s ease;
        }
        
        .social-icon:hover {
          transform: scale(1.1);
        }
        
        .newsletter-input {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          transition: all 0.3s ease;
        }
        
        .newsletter-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .newsletter-input:focus {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.4);
          outline: none;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
        }
        
        .btn-newsletter {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.2s ease;
        }
        
        .btn-newsletter:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }
      `}</style>

      <footer className={`${variant === 'landing' ? 'footer-gradient' : 'footer-app'} ${className}`}>
        {variant === 'landing' && (
          <>
            {/* Main Footer Content */}
            <div className="py-12 lg:py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                  
                  {/* Brand & Newsletter */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <Image
                        src="/logo_text_weiss.svg"
                        alt="Side-Hustlers Logo"
                        width={200}
                        height={48}
                        className="h-10 sm:h-12 w-auto mb-4"
                      />
                      <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-md">
                        Verbinden Sie sich mit vertrauenswürdigen Helfern in Ihrer Nachbarschaft. 
                        Professionelle Services für alle Lebensbereiche.
                      </p>
                    </div>
                    
                    {/* Newsletter */}
                    <div className="max-w-md">
                      <h4 className="text-white font-semibold mb-3">Newsletter abonnieren</h4>
                      <p className="text-white/70 text-sm mb-4">
                        Bleiben Sie über neue Services und Angebote informiert.
                      </p>
                      <div className="flex space-x-2">
                        <input
                          type="email"
                          placeholder="Ihre E-Mail-Adresse"
                          className="newsletter-input flex-1 px-4 py-2.5 rounded-lg text-sm"
                        />
                        <button className="btn-newsletter px-6 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap">
                          Abonnieren
                        </button>
                      </div>
                    </div>

                    {/* Social Media */}
                    <div>
                      <h4 className="text-white font-semibold mb-3">Folgen Sie uns</h4>
                      <div className="flex space-x-4">
                        {[
                          { name: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                          { name: 'Twitter', icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
                          { name: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                          { name: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' }
                        ].map((social) => (
                          <a
                            key={social.name}
                            href={`#${social.name.toLowerCase()}`}
                            className="social-icon w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300"
                            aria-label={social.name}
                          >
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d={social.icon} />
                            </svg>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Links Sections */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-8 lg:col-span-3">
                    
                    {/* Company */}
                    <div>
                      <h4 className="text-white font-semibold mb-4">Unternehmen</h4>
                      <ul className="space-y-3">
                        {footerLinks.company.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className="footer-link text-white/70 hover:text-white text-sm transition-colors"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Services */}
                    <div>
                      <h4 className="text-white font-semibold mb-4">Services</h4>
                      <ul className="space-y-3">
                        {footerLinks.services.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className="footer-link text-white/70 hover:text-white text-sm transition-colors"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Support & Legal */}
                    <div className="space-y-8">
                      <div>
                        <h4 className="text-white font-semibold mb-4">Support</h4>
                        <ul className="space-y-3">
                          {footerLinks.support.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                className="footer-link text-white/70 hover:text-white text-sm transition-colors"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-semibold mb-4">Rechtliches</h4>
                        <ul className="space-y-3">
                          {footerLinks.legal.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                className="footer-link text-white/70 hover:text-white text-sm transition-colors"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
                    <p className="text-white/60 text-sm">
                      © {currentYear} Side-Hustlers GmbH. Alle Rechte vorbehalten.
                    </p>
                    <div className="flex items-center space-x-4 text-white/60 text-sm">
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Deutschland</span>
                      </span>
                      <span>•</span>
                      <span>Deutsch</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-white/60 text-sm">
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Alle Systeme funktionsfähig</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {variant === 'app' && (
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                
                {/* Brand */}
                <div className="space-y-4">
                  <Image
                    src="/logo_text_weiss.svg"
                    alt="Side-Hustlers Logo"
                    width={140}
                    height={32}
                    className="h-8 w-auto opacity-60"
                  />
                  <p className="text-muted text-sm leading-relaxed">
                    Ihre vertrauensvolle Plattform für professionelle Nachbarschaftshilfe.
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h4 className="text-color font-semibold mb-3">Navigation</h4>
                  <ul className="space-y-2">
                    {[
                      { label: 'Dashboard', href: '/dashboard' },
                      { label: 'Meine Services', href: '/services' },
                      { label: 'Nachrichten', href: '/messages' },
                      { label: 'Profil', href: '/profile' }
                    ].map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-muted hover-primary text-sm transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h4 className="text-color font-semibold mb-3">Support</h4>
                  <ul className="space-y-2">
                    {footerLinks.support.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-muted hover-primary text-sm transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h4 className="text-color font-semibold mb-3">Rechtliches</h4>
                  <ul className="space-y-2">
                    {footerLinks.legal.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-muted hover-primary text-sm transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between">
                <p className="text-muted text-sm">
                  © {currentYear} Side-Hustlers. Alle Rechte vorbehalten.
                </p>
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <span className="text-muted text-sm">Made with ❤️ in Deutschland</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </footer>
    </>
  );
};

export default Footer;