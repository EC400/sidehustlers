// src/types/userprofile.ts
export type AccountType = 'provider' | 'customer';

export interface Address {
  streetAndNumber: string;
  zip: string;
  city: string;
}

export interface Verification {
  emailVerified: boolean;
  idVerified: boolean;
}

export interface UserDocuments {
  idUrl?: string;
  tradeLicenseUrl?: string;
  criminalRegisterUrl?: string;
  taxId?: string;
}

export interface UserProfileBase {
  uid: string;
  email: string;
  accountType: AccountType;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  dob?: string;
  phone?: string;
  address?: Address;
  profilePictureUrl?: string;
  isProfileComplete: boolean; // Neu: Flag für vollständige Profile
}

export interface ProviderProfile extends UserProfileBase {
  accountType: 'provider';
  providerId: string;
  displayName?: string;
  bio?: string;
  status: 'active' | 'restricted' | 'deleted';
  verification: Verification;
  documents: UserDocuments;
  serviceCount: number;
  orderCount: number;
  ratingAvg: number;
  ratingCount: number;
  // Neue Felder für vollständiges Profil
  businessName?: string;
  businessDescription?: string;
  services?: string[];
  workingHours?: {
    start: string;
    end: string;
  };
  serviceArea?: string[]; // Array of cities/regions
}

export interface CustomerProfile extends UserProfileBase {
  accountType: 'customer';
  customerId: string;
  ratingAvg: number;
  ratingCount: number;
  orderCount: number;
}

// Union type für alle Profile
export type UserProfile = CustomerProfile | ProviderProfile;

// Type Guards
export function isCustomerProfile(profile: UserProfile): profile is CustomerProfile {
  return profile.accountType === 'customer';
}

export function isProviderProfile(profile: UserProfile): profile is ProviderProfile {
  return profile.accountType === 'provider';
}

// Interface für unvollständige Profile (direkt nach Registrierung)
export interface IncompleteProfile {
  uid: string;
  email: string;
  accountType: AccountType;
  firstName: string;
  lastName: string;
  isProfileComplete: false;
  createdAt: string;
  updatedAt: string;
  profilePictureUrl?: string; // Hinzugefügt für Kompatibilität
}