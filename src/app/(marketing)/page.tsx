'use client';

import { useState } from 'react';
import Link from 'next/link';

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
  // Dummy-Daten
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
    // Hier würde die Logout-Logik stehen
  };

  const updateJobStatus = (jobId: string, status: Job['status']) => {
    console.log(`Update job ${jobId} to status ${status}`);
    // Hier würde die Status-Update-Logik stehen
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#0E2A6D' }} className="text-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0EA5E9' }}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold tracking-tight">Side-Hustlers</h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white" style={{ backgroundColor: '#1A4DB3' }}>
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium">{userData.name}</div>
                  <div className="text-xs text-blue-200">{userData.email}</div>
                </div>
              </div>
              
              {userData.isVerified && (
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: '#0EA5E9' }}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Verifiziert</span>
                </div>
              )}
              
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:bg-white/10 border border-white/20"
              >
                Abmelden
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Willkommensbereich */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight" style={{ color: '#0B1220' }}>
                Willkommen zurück, {userData.name.split(' ')[0]}!
              </h2>
              <p className="text-slate-600 mt-1">Hier ist eine Übersicht über Ihre aktuellen Aktivitäten</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">Heute</div>
              <div className="text-lg font-semibold" style={{ color: '#0B1220' }}>
                {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
            </div>
          </div>

          {/* Statistiken */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Erledigte Aufträge</p>
                  <p className="text-3xl font-bold mt-2" style={{ color: '#0E2A6D' }}>{userData.completedJobs}</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0EA5E9' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Gesamtverdienst</p>
                  <p className="text-3xl font-bold mt-2" style={{ color: '#0E2A6D' }}>€{userData.totalEarnings.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#1A4DB3' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Durchschnittsbewertung</p>
                  <div className="flex items-center mt-2">
                    <p className="text-3xl font-bold" style={{ color: '#0E2A6D' }}>{userData.rating.toFixed(1)}</p>
                    <div className="flex items-center ml-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.floor(userData.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0EA5E9' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Laufende Aufträge</p>
                  <p className="text-3xl font-bold mt-2" style={{ color: '#0E2A6D' }}>{activeJobs.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#1A4DB3' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schnellaktionen */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-6" style={{ color: '#0B1220' }}>Schnellaktionen</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link 
              href="/services"
              className="group bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 hover:border-slate-200"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#0EA5E9' }}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-1" style={{ color: '#0B1220' }}>Hilfe anbieten</h4>
                <p className="text-sm text-slate-600">Neue Services erstellen</p>
              </div>
            </Link>
            
            <Link 
              href="/jobs"
              className="group bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 hover:border-slate-200"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#1A4DB3' }}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-1" style={{ color: '#0B1220' }}>Aufträge finden</h4>
                <p className="text-sm text-slate-600">Verfügbare Jobs durchsuchen</p>
              </div>
            </Link>
            
            <Link 
              href="/messages"
              className="group bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 hover:border-slate-200"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#0EA5E9' }}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-1" style={{ color: '#0B1220' }}>Nachrichten</h4>
                <p className="text-sm text-slate-600">Mit Kunden chatten</p>
              </div>
            </Link>
            
            <Link 
              href="/profile"
              className="group bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 hover:border-slate-200"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#1A4DB3' }}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-1" style={{ color: '#0B1220' }}>Profil bearbeiten</h4>
                <p className="text-sm text-slate-600">Einstellungen verwalten</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Aktuelle Aufträge */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold" style={{ color: '#0B1220' }}>Aktuelle Aufträge</h3>
            <Link 
              href="/jobs" 
              className="text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-100"
              style={{ color: '#1A4DB3' }}
            >
              Alle anzeigen →
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {activeJobs.map((job, index) => (
                <div key={job.id} className="p-6 hover:bg-slate-50/50 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-lg" style={{ color: '#0B1220' }}>{job.title}</h4>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          job.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          job.status === 'accepted' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          job.status === 'in-progress' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          job.status === 'completed' ? 'bg-green-50 text-green-700 border border-green-200' :
                          'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {job.status === 'pending' ? 'Anstehend' :
                           job.status === 'accepted' ? 'Akzeptiert' :
                           job.status === 'in-progress' ? 'In Bearbeitung' :
                           job.status === 'completed' ? 'Abgeschlossen' : 'Streitfall'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-slate-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{job.client}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-6 6v6a4 4 0 108 0v-6m-6-6h8" />
                          </svg>
                          <span>{job.date}</span>
                        </div>
                        {job.price && (
                          <div className="flex items-center space-x-1 font-semibold" style={{ color: '#0E2A6D' }}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span>€{job.price.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => updateJobStatus(job.id, 'in-progress')}
                      className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:shadow-md hover:scale-105"
                      style={{ backgroundColor: '#1A4DB3' }}
                    >
                      Starten
                    </button>
                    <button 
                      onClick={() => updateJobStatus(job.id, 'completed')}
                      className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:shadow-md hover:scale-105"
                      style={{ backgroundColor: '#0EA5E9' }}
                    >
                      Abschließen
                    </button>
                    <Link 
                      href={`/auftraege/${job.id}`}
                      className="px-4 py-2 text-sm font-medium border rounded-lg transition-all duration-200 hover:bg-slate-50"
                      style={{ color: '#1A4DB3', borderColor: '#1A4DB3' }}
                    >
                      Details anzeigen
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;