// src/types
// Typdefinitionen
export interface Booking {
    // Basic Request Info
    bookingId: string;
    customerId: string;
    serviceId: string;
    
    // Request Content
    message: string;
    time: string; // Gewünschte Zeit/Datum
    budget: number;
    description: string;
    
    // Status & Metadata
    status: "open" | "answered" | "accepted" | "denied";
    createdAt: string;
    response?: string;
  }