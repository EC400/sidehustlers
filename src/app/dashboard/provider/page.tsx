'use client';

import { useState } from 'react';
import Link from 'next/link';
import "../dashboard.css"
import Header from '@/src/components/ui/header';
import Footer from '@/src/components/ui/footer';

// Typdefinitionen
interface Job {
  id: string;
  title: string;
  client: string;
  date: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'disputed';
  price?: number;
}

interface UserData {
  name: string;
  email: string;
  isVerified: boolean;
  rating: number;
  completedJobs: number;
  totalEarnings: number;
}

const DashboardPage = () => {
  const [userData] = useState<UserData>({
    name: 'Max Mustermann',
    email: 'max.mustermann@email.com',
    isVerified: true,
    rating: 4.8,
    completedJobs: 28,
    totalEarnings: 1850.00
  });

  const [activeJobs] = useState<Job[]>([
    {
      id: '1',
      title: 'Umzug 3-Zimmer Wohnung',
      client: 'Familie Müller',
      date: '15. März 2025',
      status: 'in-progress',
      price: 280.00
    },
    {
      id: '2',
      title: 'Garten winterfest machen',
      client: 'Herr Schmidt',
      date: '18. März 2025',
      status: 'pending',
      price: 120.00
    },
    {
      id: '3',
      title: 'Möbel aufbauen (IKEA)',
      client: 'Sarah Weber',
      date: '22. März 2025',
      status: 'accepted',
      price: 85.00
    }
  ]);

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const updateJobStatus = (jobId: string, status: Job['status']) => {
    console.log(`Update job ${jobId} to status ${status}`);
  };

  return (
    <>
      <div className="min-h-screen mobile-safe" style={{background: '#F8FAFC'}}>
        {/* Header Component */}
        <Header 
          variant="dashboard"
          user={{
            name: userData.name,
            email: userData.email,
            isVerified: userData.isVerified,
            type: 'provider'
          }}
          onLogout={handleLogout}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Welcome Section */}
          <div className="mb-8 sm:mb-12 fade-in">
            <div className="text-center sm:text-left mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-color mb-2 sm:mb-3">
                Willkommen zurück, <span className="primary-color">{userData.name.split(' ')[0]}!</span>
              </h2>
              <p className="text-muted text-sm sm:text-base">Hier ist eine Übersicht über Ihre aktuellen Aktivitäten</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
              <div className="professional-card p-4 sm:p-6 stagger-1 slide-up">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4" style={{backgroundColor: '#0E2A6D'}}>
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-muted mb-1">Erledigte Aufträge</p>
                  <p className="text-2xl sm:text-3xl font-bold primary-color">{userData.completedJobs}</p>
                </div>
              </div>

              <div className="professional-card p-4 sm:p-6 stagger-2 slide-up">
                <div className="text-center sm:text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mx-auto sm-0 mb-3 sm:mb-4" style={{backgroundColor: '#1A4DB3'}}>
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-muted mb-1">Gesamtverdienst</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold primary-color">€{userData.totalEarnings.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              <div className="professional-card p-4 sm:p-6 stagger-3 slide-up">
                <div className="text-center sm:text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mx-auto sm-0 mb-3 sm:mb-4" style={{backgroundColor: '#0EA5E9'}}>
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-muted mb-1">Durchschnittsbewertung</p>
                  <div className="flex items-center justify-center sm:justify-center space-x-2">
                    <p className="text-2xl sm:text-3xl font-bold primary-color">{userData.rating.toFixed(1)}</p>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.floor(userData.rating) ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="professional-card p-4 sm:p-6 stagger-4 slide-up">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4" style={{backgroundColor: '#1A4DB3'}}>
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-muted mb-1">Laufende Aufträge</p>
                  <p className="text-2xl sm:text-3xl font-bold primary-color">{activeJobs.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8 sm:mb-12">
            <h3 className="text-lg sm:text-xl font-semibold text-color mb-4 sm:mb-6 text-center sm:text-left">Schnellaktionen</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { href: '/services', title: 'Hilfe anbieten', desc: 'Neue Services erstellen', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6', color: '#0E2A6D' },
                { href: '/jobs', title: 'Aufträge finden', desc: 'Verfügbare Jobs durchsuchen', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', color: '#1A4DB3' },
                { href: '/messages', title: 'Nachrichten', desc: 'Mit Kunden kommunizieren', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', color: '#0EA5E9' },
                { href: '/profile', title: 'Profil', desc: 'Einstellungen verwalten', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: '#1A4DB3' }
              ].map((action, index) => (
                <Link key={action.href} href={action.href} className="group professional-card p-4 sm:p-6 text-center hover:scale-105 subtle-animation touch-action">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 subtle-animation`} style={{backgroundColor: action.color}}>
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

          {/* Active Jobs */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-color">Aktuelle Aufträge</h3>
              <Link href="/jobs" className="text-sm font-medium secondary-color hover:underline flex items-center space-x-1 touch-action">
                <span>Alle anzeigen</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="space-y-4">
              {activeJobs.map((job, index) => (
                <div key={job.id} className={`professional-card p-4 sm:p-6 subtle-animation stagger-${index + 1}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                        <h4 className="font-semibold text-color text-base sm:text-lg">{job.title}</h4>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium w-fit ${
                          job.status === 'pending' ? 'status-pending' :
                          job.status === 'accepted' ? 'status-accepted' :
                          job.status === 'in-progress' ? 'status-progress' :
                          job.status === 'completed' ? 'status-completed' :
                          'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {job.status === 'pending' ? 'Anstehend' :
                           job.status === 'accepted' ? 'Akzeptiert' :
                           job.status === 'in-progress' ? 'In Bearbeitung' :
                           job.status === 'completed' ? 'Abgeschlossen' : 'Streitfall'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted mb-4">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{job.client}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-6 6v6a4 4 0 108 0v-6m-6-6h8" />
                          </svg>
                          <span>{job.date}</span>
                        </div>
                        {job.price && (
                          <div className="flex items-center space-x-2 font-medium primary-color">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span>€{job.price.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => updateJobStatus(job.id, 'in-progress')}
                      className="btn-primary touch-action flex-1 sm:flex-none px-4 py-3 sm:py-2 text-sm font-medium rounded-lg shadow-sm hover:shadow-md"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-7 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Starten</span>
                      </span>
                    </button>
                    
                    <button 
                      onClick={() => updateJobStatus(job.id, 'completed')}
                      className="btn-secondary touch-action flex-1 sm:flex-none px-4 py-3 sm:py-2 text-sm font-medium rounded-lg shadow-sm hover:shadow-md"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Abschließen</span>
                      </span>
                    </button>
                    
                    <Link
                      href={`/auftraege/${job.id}`}
                      className="bg-transparent text-[#1A4DB3] border border-[#1A4DB3] hover:bg-[#1A4DB3] hover:text-white transition-all touch-action flex-1 sm:flex-none px-4 py-3 sm:py-2 text-sm font-medium rounded-lg text-center"
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
            {activeJobs.length === 0 && (
              <div className="professional-card p-8 sm:p-12 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#F1F5F9'}}>
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-color mb-2">Keine aktiven Aufträge</h3>
                <p className="text-muted mb-6">Sie haben derzeit keine laufenden Projekte. Zeit für neue Herausforderungen!</p>
                <Link 
                  href="/jobs"
                  className="btn-primary inline-flex items-center space-x-2 px-6 py-3 text-sm font-medium rounded-lg shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Aufträge finden</span>
                </Link>
              </div>
            )}
          </div>

          {/* Additional Insights Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Activity */}
            <div className="professional-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-color">Letzte Aktivitäten</h3>
                <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#10B981'}}></div>
              </div>
              <div className="space-y-4">
                {[
                  { action: 'Auftrag abgeschlossen', detail: 'Gartenarbeit bei Familie Weber', time: '2 Std. ago', icon: '✓', color: '#10B981' },
                  { action: 'Neue Nachricht', detail: 'Von Herr Schmidt erhalten', time: '4 Std. ago', icon: '💬', color: '#0EA5E9' },
                  { action: 'Bewertung erhalten', detail: '5 Sterne für Umzugshilfe', time: '1 Tag ago', icon: '★', color: '#F59E0B' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 subtle-animation">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium" style={{backgroundColor: activity.color}}>
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

            {/* Performance Metrics */}
            <div className="professional-card p-6">
              <h3 className="text-lg font-semibold text-color mb-6">Leistungsübersicht</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-muted font-medium">Auftragserfolg</span>
                    <span className="font-semibold text-color">96%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full subtle-animation" style={{width: '96%', backgroundColor: '#10B981'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-muted font-medium">Kundenzufriedenheit</span>
                    <span className="font-semibold text-color">4.8/5</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full subtle-animation" style={{width: '96%', backgroundColor: '#F59E0B'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-muted font-medium">Antwortzeit</span>
                    <span className="font-semibold text-color"> 2h</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full subtle-animation" style={{width: '92%', backgroundColor: '#0EA5E9'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer Component */}
        <Footer variant="app" />

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 lg:hidden glass-effect border-t z-40" style={{borderColor: 'rgba(11, 18, 32, 0.08)'}}>
          <div className="grid grid-cols-4 gap-1 px-4 py-3">
            {[
              { href: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Home', active: true },
              { href: '/jobs', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', label: 'Jobs' },
              { href: '/messages', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', label: 'Chat' },
              { href: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: 'Profil' }
            ].map((item, index) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`touch-action flex flex-col items-center py-2 px-2 rounded-lg subtle-animation ${
                  item.active 
                    ? 'text-white' 
                    : 'text-muted hover:text-color'
                }`}
                style={item.active ? {backgroundColor: '#0E2A6D'} : {}}
              >
                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={item.active ? 2.5 : 2} d={item.icon} />
                </svg>
                <span className={`text-xs font-medium ${item.active ? 'font-semibold' : ''}`}>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Floating Action Button (Mobile) */}
        <div className="fixed bottom-20 right-4 lg:hidden z-50">
          <Link
            href="/services"
            className="touch-action w-14 h-14 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center subtle-animation"
            style={{backgroundColor: '#0E2A6D'}}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </Link>
        </div>

        {/* Scroll to Top Button */}
        <div className="fixed bottom-20 left-4 lg:bottom-8 lg:right-8 z-50">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="touch-action w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg flex items-center justify-center subtle-animation border"
            style={{borderColor: 'rgba(11, 18, 32, 0.08)'}}
          >
            <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;