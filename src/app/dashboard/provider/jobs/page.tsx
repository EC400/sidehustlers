// src/app/dashboard/provider/jobs/page.tsx - Vollständige Provider Jobs Seite
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Job, JobStatus, PricingType, ContextType } from '@/src/types/job';
import { jobQueries } from '@/src/lib/db';

type FilterStatus = 'all' | JobStatus;
type SortOption = 'date' | 'price' | 'status' | 'duration';

const ProviderJobsPage = () => {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Filter and sort states
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  // Firestore states
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time jobs subscription
  useEffect(() => {
    if (!user?.id) {
      console.log('⚠️ No user ID found');
      setLoading(false);
      return;
    }

    console.log('🔔 Setting up real-time jobs subscription for user:', user.id);

    try {
      const unsubscribe = jobQueries.subscribeToProviderJobs(
        user.id,
        (jobs) => {
          console.log('📦 Received jobs update:', jobs.length, 'jobs');
          setAllJobs(jobs as Job[]);
          setLoading(false);
          setError(null);
        }
      );

      return () => {
        console.log('🧹 Cleaning up jobs subscription');
        unsubscribe();
      };
    } catch (err: any) {
      console.error('❌ Error setting up jobs subscription:', err);
      setError('Fehler beim Laden der Aufträge');
      setLoading(false);
    }
  }, [user?.id]);

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

  const updateJobStatus = async (jobId: string, status: JobStatus) => {
    console.log('🔄 Updating job status:', { jobId, status });
    
    try {
      await jobQueries.updateJob(jobId, { status });
      console.log('✅ Job status updated successfully');
    } catch (error) {
      console.error('❌ Error updating job status:', error);
      setError('Fehler beim Aktualisieren des Job-Status');
    }
  };

  // Helper functions
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

  const getPricingDisplay = (price: number, pricingType: PricingType): string => {
    switch (pricingType) {
      case PricingType.PER_HOUR: return `${price.toFixed(2)}€/Std`;
      case PricingType.PER_PIECE: return `${price.toFixed(2)}€/Stück`;
      case PricingType.FIXED:
      default: return `${price.toFixed(2)}€`;
    }
  };

  // Filtered and sorted jobs
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = allJobs;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(job => job.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.location.city.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'duration':
          comparison = a.durationInMin - b.durationInMin;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [allJobs, filterStatus, searchTerm, sortBy, sortOrder]);

  // Job statistics
  const jobStats = useMemo(() => {
    const total = allJobs.length;
    const scheduled = allJobs.filter(j => j.status === JobStatus.SCHEDULED).length;
    const inProgress = allJobs.filter(j => j.status === JobStatus.IN_PROGRESS).length;
    const completed = allJobs.filter(j => j.status === JobStatus.COMPLETED).length;
    const totalEarnings = allJobs
      .filter(j => j.status === JobStatus.COMPLETED)
      .reduce((sum, job) => sum + job.price, 0);

    return { total, scheduled, inProgress, completed, totalEarnings };
  }, [allJobs]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show loading while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
          <div className="animate-spin w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Authentifizierung wird überprüft...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-200">
        <div className="bg-gradient-to-r from-slate-900 to-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              {/* Logo & Brand */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center p-2">
                  <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">SideHustlers</h1>
                  <p className="text-white/80 text-sm hidden sm:block font-medium">Meine Aufträge</p>
                </div>
              </div>

              {/* Navigation - Desktop */}
              <nav className="hidden lg:flex items-center space-x-8">
                <Link href="/dashboard/provider" className="text-white/70 hover:text-white font-medium transition-colors">
                  Dashboard
                </Link>
                <Link href="/dashboard/provider/jobs" className="text-white/90 hover:text-white font-medium transition-colors border-b-2 border-white/30 pb-1">
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
                    {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <svg className={`w-4 h-4 text-white/70 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <Link href="/profile" className="flex items-center px-4 py-3 text-sm text-slate-900 hover:bg-gray-50" onClick={() => setShowDropdown(false)}>
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Mein Profil
                      </Link>
                      <Link href="/settings" className="flex items-center px-4 py-3 text-sm text-slate-900 hover:bg-gray-50" onClick={() => setShowDropdown(false)}>
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
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Meine Aufträge</h2>
          <p className="text-slate-600">Verwalten Sie alle Ihre Jobs und deren Status</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="animate-spin w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Aufträge werden geladen...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-2xl p-6 mb-6 border-red-200 bg-red-50 shadow-sm">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="text-center">
                  <p className="text-xs font-medium text-slate-600 mb-1">Gesamt</p>
                  <p className="text-xl font-bold text-slate-900">{jobStats.total}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="text-center">
                  <p className="text-xs font-medium text-slate-600 mb-1">Geplant</p>
                  <p className="text-xl font-bold text-amber-600">{jobStats.scheduled}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="text-center">
                  <p className="text-xs font-medium text-slate-600 mb-1">Laufend</p>
                  <p className="text-xl font-bold text-green-600">{jobStats.inProgress}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="text-center">
                  <p className="text-xs font-medium text-slate-600 mb-1">Erledigt</p>
                  <p className="text-xl font-bold text-emerald-600">{jobStats.completed}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="text-center">
                  <p className="text-xs font-medium text-slate-600 mb-1">Verdienst</p>
                  <p className="text-xl font-bold text-slate-900">{jobStats.totalEarnings.toFixed(0)}€</p>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 mb-6 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Jobs durchsuchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="w-full lg:w-48">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="all">Alle Status</option>
                    <option value={JobStatus.SCHEDULED}>Geplant</option>
                    <option value={JobStatus.IN_PROGRESS}>In Bearbeitung</option>
                    <option value={JobStatus.DELIVERED}>Geliefert</option>
                    <option value={JobStatus.COMPLETED}>Abgeschlossen</option>
                    <option value={JobStatus.CANCELLED}>Storniert</option>
                  </select>
                </div>

                {/* Sort */}
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="date">Nach Datum</option>
                    <option value="price">Nach Preis</option>
                    <option value="status">Nach Status</option>
                    <option value="duration">Nach Dauer</option>
                  </select>
                  
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <svg className={`w-4 h-4 transform transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
              {filteredAndSortedJobs.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 sm:p-12 text-center shadow-sm">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Keine Aufträge gefunden</h3>
                  <p className="text-slate-600 mb-6">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Versuchen Sie andere Suchkriterien oder Filter.' 
                      : 'Sie haben noch keine Aufträge. Zeit für neue Projekte!'}
                  </p>
                  {(!searchTerm && filterStatus === 'all') && (
                    <Link 
                      href="/dashboard/provider"
                      className="inline-flex items-center space-x-2 px-6 py-3 text-sm font-medium rounded-lg bg-slate-900 text-white hover:bg-slate-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span>Zum Dashboard</span>
                    </Link>
                  )}
                </div>
              ) : (
                filteredAndSortedJobs.map((job) => (
                  <div key={job.jobId} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                      {/* Job Info */}
                      <div className="flex-1 lg:mr-6">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                          <h3 className="font-semibold text-slate-900 text-lg">{job.title}</h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium w-fit ${getStatusClass(job.status)}`}>
                            {getStatusText(job.status)}
                          </span>
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                            {job.contextType === ContextType.ORDER ? 'Bestellung' : 'Service'}
                          </span>
                        </div>

                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{job.description}</p>

                        {/* Job Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-slate-600">{job.location.city}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-slate-600">
                              {job.scheduled ? formatDate(job.scheduled.start) : 'Nicht geplant'}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-slate-600">
                              {Math.floor(job.durationInMin / 60)}h {job.durationInMin % 60}min
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium text-slate-900">
                              {getPricingDisplay(job.price, job.pricingType)}
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
                            className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-900 text-white hover:bg-slate-700 transition-colors"
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
                            className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-600 text-white hover:bg-slate-700 transition-colors"
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
                          href={`/dashboard/provider/jobs/${job.jobId}`}
                          className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-400 transition-colors text-center"
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
                          className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-400 transition-colors text-center"
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
                      <div className="flex items-center justify-between text-xs text-slate-500">
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
                ))
              )}
            </div>

            {/* Results Summary */}
            {filteredAndSortedJobs.length > 0 && (
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                  {filteredAndSortedJobs.length} von {allJobs.length} Aufträgen angezeigt
                  {searchTerm && ` für "${searchTerm}"`}
                  {filterStatus !== 'all' && ` mit Status "${getStatusText(filterStatus as JobStatus)}"`}
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
      )}
    </div>
  );
};

export default ProviderJobsPage;