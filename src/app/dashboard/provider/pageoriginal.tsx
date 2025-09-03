'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAuth, 
  onAuthStateChanged, 
  User,
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  onSnapshot,
  updateDoc
} from 'firebase/firestore';
import Link from 'next/link';
import { auth, db } from "../../../lib/firebase/client";

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
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Benutzerdaten aus Firestore abrufen
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
        
        // Aktive Jobs des Benutzers abrufen
        const jobsQuery = query(
          collection(db, 'jobs'),
          where('providerId', '==', user.uid),
          where('status', 'in', ['pending', 'accepted', 'in-progress'])
        );
        
        const unsubscribeJobs = onSnapshot(jobsQuery, (snapshot) => {
          const jobs: Job[] = [];
          snapshot.forEach((doc) => {
            jobs.push({ id: doc.id, ...doc.data() } as Job);
          });
          setActiveJobs(jobs);
          setLoading(false);
        });
        
        return () => unsubscribeJobs();
      } else {
        setUser(null);
        setLoading(false);
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Fehler beim Abmelden:', error);
    }
  };

  const updateJobStatus = async (jobId: string, status: Job['status']) => {
    try {
      await updateDoc(doc(db, 'jobs', jobId), { status });
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Job-Status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text">Lade Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Side-Hustlers Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>Hallo, {userData?.name || user?.email}</span>
            {userData?.isVerified && (
              <span className="bg-accents text-white text-xs px-2 py-1 rounded-full">Verifiziert</span>
            )}
            <button 
              onClick={handleLogout}
              className="bg-secondary hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Abmelden
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        {/* Willkommensbereich und Statistiken */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-text mb-4">Willkommen zurück, {userData?.name || 'Dienstleister'}!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-text">Abgeschlossene Jobs</h3>
              <p className="text-3xl font-bold text-primary">{userData?.completedJobs || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-text">Verdienst (insgesamt)</h3>
              <p className="text-3xl font-bold text-primary">{userData?.totalEarnings ? `€${userData.totalEarnings.toFixed(2)}` : '€0,00'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-text">Durchschnittliche Bewertung</h3>
              <p className="text-3xl font-bold text-primary">{userData?.rating?.toFixed(1) || '0.0'}/5</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-text">Aktive Jobs</h3>
              <p className="text-3xl font-bold text-primary">{activeJobs.length}</p>
            </div>
          </div>
        </div>

        {/* Schnellaktionen */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-text mb-4">Schnellaktionen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              href="/services"
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <div className="bg-accents text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="font-medium text-text">Service anbieten</span>
            </Link>
            
            <Link 
              href="/jobs"
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <div className="bg-secondary text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-medium text-text">Jobs durchsuchen</span>
            </Link>
            
            <Link 
              href="/messages"
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <div className="bg-accents text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="font-medium text-text">Nachrichten</span>
            </Link>
            
            <Link 
              href="/profile"
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <div className="bg-secondary text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="font-medium text-text">Profil bearbeiten</span>
            </Link>
          </div>
        </div>

        {/* Aktuelle Jobs */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-text">Aktuelle Jobs</h2>
            <Link href="/jobs" className="text-secondary hover:underline">Alle anzeigen</Link>
          </div>
          
          {activeJobs.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {activeJobs.map((job) => (
                  <li key={job.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-text">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.client} • {job.date}</p>
                        {job.price && <p className="text-sm text-text font-medium">Preis: €{job.price.toFixed(2)}</p>}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        job.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        job.status === 'in-progress' ? 'bg-accents text-white' :
                        job.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {job.status === 'pending' ? 'Anstehend' :
                         job.status === 'accepted' ? 'Akzeptiert' :
                         job.status === 'in-progress' ? 'In Bearbeitung' :
                         job.status === 'completed' ? 'Abgeschlossen' : 'Streitfall'}
                      </span>
                    </div>
                    <div className="mt-2 flex space-x-2">
                      <button 
                        onClick={() => updateJobStatus(job.id, 'in-progress')}
                        className="text-sm bg-secondary text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                      >
                        Starten
                      </button>
                      <button 
                        onClick={() => updateJobStatus(job.id, 'completed')}
                        className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                      >
                        Abschließen
                      </button>
                      <Link 
                        href={`/jobs/${job.id}`}
                        className="text-sm text-secondary hover:underline pt-1"
                      >
                        Details
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-medium text-text mb-2">Keine aktiven Jobs</h3>
              <p className="text-gray-600 mb-4">Sie haben derzeit keine aktiven Aufträge.</p>
              <Link 
                href="/jobs"
                className="bg-secondary hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Jobs durchsuchen
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;