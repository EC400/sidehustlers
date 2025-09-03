// types/userProfile.ts
export interface UserProfile {
  id: string;
  email: string;
  accountType: 'customer' | 'seller';
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  phone?: string;
  dob?: string;
  orderCount?: number;
  ratingAvg?: number;
  ratingCount?: number;
  adress?: {
    city?: string;
    streetAndNumber?: string;
    zip?: string;
  };
}
