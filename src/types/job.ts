// src/types/job.ts

/* ------------------------------- Enums ------------------------------- */

export enum ContextType {
    ORDER = "order",
    SERVICE = "service",
  }
  
  export enum PricingType {
    PER_HOUR = "perHour",
    PER_PIECE = "perPiece",
    FIXED = "fixed"
  }
  
  export enum JobStatus {
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    DELIVERED = "delivered",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
  }
  
  /* ------------------------------- Types ------------------------------- */
  
  export interface Location {
    streetAndNumber: string;
    zip: string;
    city: string;
  }
  
  export interface Evidence {
    photos?: string[];       // z. B. Bild-URLs
    notes?: string;          // Freitext
    files?: string[];        // andere Dateien (PDFs etc.)
    signatureUrl?: string;   // Unterschrift als Bild-URL
  }
  
  export interface Job {
    jobId: string;
  
    contextType: ContextType;
    contextId: string; // z. B. orderId oder serviceId
  
    customerId: string;
    providerId: string;
  
    title: string;
    description: string;
  
    price: number;
    pricingType: PricingType;
  
    location: Location;
  
    durationInMin: number;
  
    createdAt: string; // ISO-String (new Date().toISOString())
  
    status: JobStatus;
  
    scheduled?: {
      start: string; // ISO 8601 Datum
      end?: string;  // optional
    };
  
    evidence?: Evidence;
  }
  