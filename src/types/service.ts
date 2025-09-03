import { ServiceData } from "@/src/lib/db";

export interface Service extends ServiceData {
  id: string;
  providerId: string;
  serviceArea: {
    zip: string;
    maxDistance: number;
  };
  description: string;
  photoUrl: string;
  minBudget: number;
  maxBudget: number;
  pricingType: string;
  category: string;
  subcategory: string;
  cancellationPolicy: string;
  createdAt: Date;
  ratingAvg: number;
  orderCount: number;
  isActive: boolean;
}
