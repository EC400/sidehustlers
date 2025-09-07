// src/app/complete-profile/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import { AuthService } from '@/src/lib/firebase/auth';
import { AccountType } from '@/src/types/userprofile';

interface CustomerData {
  phone: string;
  street: string;
  zip: string;
  city: string;
  dob: string;
}

interface ProviderData {
  businessName: string;
  businessDescription: string;
  services: string[];
  phone: string;
  street: string;
  zip: string;
  city: string;
  serviceAreas: string[];
  workingStart: string;
  workingEnd: string;
}

const AVAILABLE_SERVICES = [
  'Hausreinigung', 'Gartenpflege', 'Handwerk', 'Umzugshilfe', 
  'Reparaturen', 'Montage', 'Malerarbeiten', 'Elektriker',
  'Klempner', 'Fensterreinigung', 'Teppichreinigung', 'Catering'
];

const MAJOR_CITIES = [
  'Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt am Main',
  'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dortmund', 'Essen',
  'Bremen', 'Dresden', 'Hannover', 'Nürnberg', 'Duisburg'
];

export default function CompleteProfilePage() {
  const { user, isProfileComplete, refreshProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accountType, setAccountType] = useState<AccountType | null>(null);

  // Customer form data
  const [customerData, setCustomerData] = useState<CustomerData>({
    phone: '',
    street: '',
    zip: '',
    city: '',
    dob: '',
  });

  // Provider form data
  const [providerData, setProviderData] = useState<ProviderData>({
    businessName: '',
    businessDescription: '',
    services: [],
    phone: '',
    street: '',
    zip: '',
    city: '',
    serviceAreas: [],
    workingStart: '09:00',
    workingEnd: '17:00',
  });

  // Redirect wenn bereits vollständig oder nicht angemeldet
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (isProfileComplete) {
      const dashboardPath = user.role === 'provider' ? '/dashboard/provider' : '/dashboard/customer';
      router.push(dashboardPath);
      return;
    }

    setAccountType(user.role);
  }, [user, isProfileComplete, router]);

  const handleAccountTypeSelect = (type: AccountType) => {
    setAccountType(type);
  };

  const handleServiceToggle = (service: string) => {
    setProviderData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleServiceAreaToggle = (area: string) => {
    setProviderData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.includes(area)
        ? prev.serviceAreas.filter(a => a !== area)
        : [...prev.serviceAreas, area]
    }));
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const profileData = {
        phone: customerData.phone || undefined,
        address: customerData.street ? {
          streetAndNumber: customerData.street,
          zip: customerData.zip,
          city: customerData.city,
        } : undefined,
        dob: customerData.dob || undefined,
      };

      await AuthService.completeCustomerProfile(user.id, profileData);
      await refreshProfile();
      
      router.push('/dashboard/customer');
    } catch (err: any) {
      console.error('Profile completion error:', err);
      setError('Fehler beim Vervollständigen des Profils');
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (providerData.services.length === 0) {
      setError('Bitte wählen Sie mindestens einen Service aus');
      return;
    }

    if (providerData.serviceAreas.length === 0) {
      setError('Bitte wählen Sie mindestens ein Servicegebiet aus');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const profileData = {
        businessName: providerData.businessName,
        businessDescription: providerData.businessDescription,
        services: providerData.services,
        phone: providerData.phone,
        address: {
          streetAndNumber: providerData.street,
          zip: providerData.zip,
          city: providerData.city,
        },
        serviceArea: providerData.serviceAreas,
        workingHours: {
          start: providerData.workingStart,
          end: providerData.workingEnd,
        },
      };

      await AuthService.completeProviderProfile(user.id, profileData);
      await refreshProfile();
      
      router.push('/dashboard/provider');
    } catch (err: any) {
      console.error('Profile completion error:', err);
      setError('Fehler beim Vervollständigen des Profils');
    } finally {
      setLoading(false);
    }
  };

  if (!user || accountType === null) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Lade...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#0F172A] mb-2">
              Profil vervollständigen
            </h1>
            <p className="text-[#64748B]">
              Helfen Sie uns, Ihr Profil zu vervollständigen, um das beste Erlebnis zu bieten
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {accountType === 'customer' ? (
            <form onSubmit={handleCustomerSubmit} className="space-y-6">
              <h2 className="text-xl font-semibold text-[#0F172A] mb-4">
                Kundenprofil vervollständigen
              </h2>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Telefonnummer (optional)
                </label>
                <input
                  type="tel"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1B3D]"
                  placeholder="+49 123 456789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Geburtsdatum (optional)
                </label>
                <input
                  type="date"
                  value={customerData.dob}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, dob: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1B3D]"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-[#374151]">Adresse (optional)</h3>
                
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Straße und Hausnummer
                  </label>
                  <input
                    type="text"
                    value={customerData.street}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, street: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1B3D]"
                    placeholder="Musterstraße 123"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">
                      PLZ
                    </label>
                    <input
                      type="text"
                      value={customerData.zip}
                      onChange={(e) => setCustomerData(prev => ({ ...prev, zip: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1B3D]"
                      placeholder="12345"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">
                      Stadt
                    </label>
                    <input
                      type="text"
                      value={customerData.city}
                      onChange={(e) => setCustomerData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1B3D]"
                      placeholder="Berlin"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0A1B3D] hover:bg-[#1E4A72] text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Wird gespeichert...' : 'Profil vervollständigen'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleProviderSubmit} className="space-y-6">
              <h2 className="text-xl font-semibold text-[#0F172A] mb-4">
                Anbieter-Profil vervollständigen
              </h2>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Firmenname / Geschäftsname *
                </label>
                <input
                  type="text"
                  required
                  value={providerData.businessName}
                  onChange={(e) => setProviderData(prev => ({ ...prev, businessName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1B3D]"
                  placeholder="Meine Dienstleistungen GmbH"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Geschäftsbeschreibung *
                </label>
                <textarea
                  required
                  rows={4}
                  value={providerData.businessDescription}
                  onChange={(e) => setProviderData(prev => ({ ...prev, businessDescription: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1B3D]"
                  placeholder="Beschreiben Sie Ihre Dienstleistungen und Ihre Erfahrung..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Telefonnummer *
                </label>
                <input
                  type="tel"
                  required
                  value={providerData.phone}
                  onChange={(e) => setProviderData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1B3D]"
                  placeholder="+49 123 456789"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-[#374151]">Geschäftsadresse *</h3>
                
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Straße und Hausnummer
                  </label>
                  <input
                    type="text"
                    required
                    value={providerData.street}
                    onChange={(e) => setProviderData(prev => ({ ...prev, street: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1B3D]"
                    placeholder="Geschäftsstraße 123"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">
                      PLZ
                    </label>
                    <input
                      type="text"
                      required
                      value={providerData.zip}
                      onChange={(e) => setProviderData(prev => ({ ...prev, zip: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1B3D]"
                      placeholder="12345"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">
                      Stadt
                    </label>
                    <input
                      type="text"
                      required
                      value={providerData.city}
                      onChange={(e) => setProviderData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1B3D]"
                      placeholder="Berlin"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-3">
                  Angebotene Services * (mindestens einen auswählen)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_SERVICES.map((service) => (
                    <label key={service} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={providerData.services.includes(service)}
                        onChange={() => handleServiceToggle(service)}
                        className="rounded border-gray-300 text-[#0A1B3D] focus:ring-[#0A1B3D]"
                      />
                      <span className="text-sm text-[#374151]">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-3">
                  Servicegebiete * (mindestens eines auswählen)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MAJOR_CITIES.map((city) => (
                    <label key={city} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={providerData.serviceAreas.includes(city)}
                        onChange={() => handleServiceAreaToggle(city)}
                        className="rounded border-gray-300 text-[#0A1B3D] focus:ring-[#0A1B3D]"
                      />
                      <span className="text-sm text-[#374151]">{city}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-3">
                  Arbeitszeiten
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#6B7280] mb-1">Von</label>
                    <input
                      type="time"
                      value={providerData.workingStart}
                      onChange={(e) => setProviderData(prev => ({ ...prev, workingStart: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1B3D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#6B7280] mb-1">Bis</label>
                    <input
                      type="time"
                      value={providerData.workingEnd}
                      onChange={(e) => setProviderData(prev => ({ ...prev, workingEnd: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1B3D]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0A1B3D] hover:bg-[#1E4A72] text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Wird gespeichert...' : 'Profil vervollständigen'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}