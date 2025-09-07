// lib/db.ts - Reparierter Firestore Service
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Unsubscribe,
  DocumentData,
  QueryConstraint,
  serverTimestamp,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { UserProfile, IncompleteProfile } from "../types/userprofile";
import { db } from "./firebase/client";

export { getDoc, doc, db };

// Collections References
export const collections = {
  users: "users",
  services: "services",
  orders: "orders",
  reviews: "reviews",
  categories: "categories",
  conversations: "conversations",
  disputes: "disputes",
  notifications: "notifications",
  payments: "payments",
  jobs: "jobs", // Hinzugefügt für Jobs
} as const;

// Helper function to convert Firestore Timestamps to ISO strings
function convertTimestamps(data: any): any {
  if (!data) return data;

  const converted = { ...data };

  // Convert Firestore Timestamps to ISO strings for consistency
  if (converted.createdAt && converted.createdAt instanceof Timestamp) {
    converted.createdAt = converted.createdAt.toDate().toISOString();
  }
  if (converted.updatedAt && converted.updatedAt instanceof Timestamp) {
    converted.updatedAt = converted.updatedAt.toDate().toISOString();
  }

  // Convert scheduled times for jobs
  if (converted.scheduled) {
    if (converted.scheduled.start && converted.scheduled.start instanceof Timestamp) {
      converted.scheduled.start = converted.scheduled.start.toDate().toISOString();
    }
    if (converted.scheduled.end && converted.scheduled.end instanceof Timestamp) {
      converted.scheduled.end = converted.scheduled.end.toDate().toISOString();
    }
  }

  return converted;
}

function getDb() {
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }
  return db;
}

// Firestore Service für sidehustlers Database
export class FirestoreService {
  // Get document by ID
  static async getDocument<T = DocumentData>(
    collectionName: string,
    id: string
  ): Promise<(T & { id: string }) | null> {
    try {
      console.log(`📖 Getting document: ${collectionName}/${id}`);
      const database = getDb();
      const docRef = doc(database, collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = convertTimestamps(docSnap.data());
        console.log(`✅ Document found: ${docSnap.id}`);
        return { id: docSnap.id, ...data } as T & { id: string };
      } else {
        console.log(`📭 Document not found: ${collectionName}/${id}`);
        return null;
      }
    } catch (error) {
      console.error("Error getting document:", error);
      throw error;
    }
  }

  // Get all documents from collection
  static async getCollection<T = DocumentData>(
    collectionName: string,
    constraints: QueryConstraint[] = []
  ): Promise<(T & { id: string })[]> {
    try {
      console.log(`📚 Getting collection: ${collectionName} with ${constraints.length} constraints`);
      const database = getDb();
      const collectionRef = collection(database, collectionName);
      const q =
        constraints.length > 0
          ? query(collectionRef, ...constraints)
          : collectionRef;
      const querySnapshot = await getDocs(q);

      const results = querySnapshot.docs.map((doc) => {
        const data = convertTimestamps(doc.data());
        return {
          id: doc.id,
          ...data,
        } as T & { id: string };
      });

      console.log(`✅ Collection retrieved: ${results.length} documents`);
      return results;
    } catch (error) {
      console.error("Error getting collection:", error);
      throw error;
    }
  }

  // Add new document
  static async addDocument(
    collectionName: string,
    data: DocumentData
  ): Promise<string> {
    try {
      console.log(`➕ Adding document to: ${collectionName}`);
      const database = getDb();
      const collectionRef = collection(database, collectionName);
      
      const docData = {
        ...data,
        createdAt: data.createdAt || serverTimestamp(),
        updatedAt: data.updatedAt || serverTimestamp(),
      };

      const docRef = await addDoc(collectionRef, docData);
      console.log(`✅ Document added with ID: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error("Error adding document:", error);
      throw error;
    }
  }

  // Set document with specific ID (for user profiles)
  static async setDocument(
    collectionName: string,
    id: string,
    data: DocumentData
  ): Promise<void> {
    try {
      console.log(`📝 Setting document: ${collectionName}/${id}`);
      const database = getDb();
      const docRef = doc(database, collectionName, id);
      
      const docData = {
        ...data,
        createdAt: data.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(docRef, docData);
      console.log(`✅ Document set: ${id}`);
    } catch (error) {
      console.error("Error setting document:", error);
      throw error;
    }
  }

  // Update document
  static async updateDocument(
    collectionName: string,
    id: string,
    data: Partial<DocumentData>
  ): Promise<void> {
    try {
      console.log(`📝 Updating document: ${collectionName}/${id}`);
      const database = getDb();
      const docRef = doc(database, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      console.log(`✅ Document updated: ${id}`);
    } catch (error) {
      console.error("Error updating document:", error);
      throw error;
    }
  }

  // Delete document
  static async deleteDocument(
    collectionName: string,
    id: string
  ): Promise<void> {
    try {
      console.log(`🗑️ Deleting document: ${collectionName}/${id}`);
      const database = getDb();
      const docRef = doc(database, collectionName, id);
      await deleteDoc(docRef);
      console.log(`✅ Document deleted: ${id}`);
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  }

  // Real-time listener
  static subscribeToDocument<T = DocumentData>(
    collectionName: string,
    id: string,
    callback: (data: (T & { id: string }) | null) => void
  ): Unsubscribe {
    console.log(`👂 Setting up real-time listener for: ${collectionName}/${id}`);
    const database = getDb();
    const docRef = doc(database, collectionName, id);

    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = convertTimestamps(doc.data());
        callback({ id: doc.id, ...data } as T & { id: string });
      } else {
        callback(null);
      }
    });
  }

  // Real-time collection listener
  static subscribeToCollection<T = DocumentData>(
    collectionName: string,
    callback: (data: (T & { id: string })[]) => void,
    constraints: QueryConstraint[] = []
  ): Unsubscribe {
    console.log(`👂 Setting up real-time collection listener for: ${collectionName}`);
    const database = getDb();
    const collectionRef = collection(database, collectionName);
    const q =
      constraints.length > 0
        ? query(collectionRef, ...constraints)
        : collectionRef;

    return onSnapshot(q, (querySnapshot) => {
      const docs = querySnapshot.docs.map((doc) => {
        const data = convertTimestamps(doc.data());
        return {
          id: doc.id,
          ...data,
        } as T & { id: string };
      });
      callback(docs);
    });
  }
}

// Service Data Interface
export interface ServiceData {
  title: string;
  description: string;
  category: string;
  price: number;
  sellerId: string;
  images?: string[];
  tags?: string[];
  status: "active" | "paused" | "inactive";
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Order Data Interface
export interface OrderData {
  serviceId?: string;
  buyerId: string;
  sellerId?: string;
  status: "pending" | "active" | "completed" | "cancelled" | "disputed";
  totalAmount?: number;
  title: string;
  description: string;
  requirements?: string;
  deliveryDate?: Date;
  location?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// User-specific functions - nutzt korrigierte UserProfile Interfaces
export const userQueries = {
  // Get user by email
  getUserByEmail: async (email: string): Promise<UserProfile | IncompleteProfile | null> => {
    console.log(`👤 Getting user by email: ${email}`);
    const users = await FirestoreService.getCollection<UserProfile | IncompleteProfile>(
      collections.users,
      [where("email", "==", email), limit(1)]
    );
    return users[0] || null;
  },

  // Get user by ID
  getUserById: async (id: string): Promise<UserProfile | IncompleteProfile | null> => {
    console.log(`👤 Getting user by ID: ${id}`);
    return await FirestoreService.getDocument<UserProfile | IncompleteProfile>(
      collections.users,
      id
    );
  },

  // Create user (uses setDoc instead of addDoc to use UID as document ID)
  createUser: async (userData: Omit<UserProfile | IncompleteProfile, "id">): Promise<void> => {
    console.log(`👤 Creating user: ${userData.uid}`);
    await FirestoreService.setDocument(collections.users, userData.uid, userData);
  },

  // Update user
  updateUser: async (userId: string, userData: Partial<UserProfile | IncompleteProfile>): Promise<void> => {
    console.log(`👤 Updating user: ${userId}`);
    await FirestoreService.updateDocument(collections.users, userId, userData);
  },
};

// Service-specific functions
export const serviceQueries = {
  // Get services by category
  getServicesByCategory: (category: string) =>
    FirestoreService.getCollection<ServiceData>(collections.services, [
      where("category", "==", category),
      where("status", "==", "active"),
      orderBy("createdAt", "desc"),
    ]),

  // Get featured services
  getFeaturedServices: (limitCount = 6) =>
    FirestoreService.getCollection<ServiceData>(collections.services, [
      where("featured", "==", true),
      where("status", "==", "active"),
      orderBy("rating", "desc"),
      limit(limitCount),
    ]),

  // Get services by seller
  getServicesBySeller: (sellerId: string) =>
    FirestoreService.getCollection<ServiceData>(collections.services, [
      where("sellerId", "==", sellerId),
      orderBy("createdAt", "desc"),
    ]),

  // Get all active services
  getAllServices: () =>
    FirestoreService.getCollection<ServiceData>(collections.services, [
      where("status", "==", "active"),
      orderBy("createdAt", "desc"),
    ]),
};

// Order-specific functions
export const orderQueries = {
  // Get orders by buyer
  getOrdersByBuyer: (buyerId: string) =>
    FirestoreService.getCollection<OrderData>(collections.orders, [
      where("buyerId", "==", buyerId),
      orderBy("createdAt", "desc"),
    ]),

  // Get orders by seller
  getOrdersBySeller: (sellerId: string) =>
    FirestoreService.getCollection<OrderData>(collections.orders, [
      where("sellerId", "==", sellerId),
      orderBy("createdAt", "desc"),
    ]),

  // Get active orders
  getActiveOrders: () =>
    FirestoreService.getCollection<OrderData>(collections.orders, [
      where("status", "in", ["pending", "active"]),
      orderBy("createdAt", "desc"),
    ]),
};

// Job-specific functions (neu hinzugefügt)
export const jobQueries = {
  // Get jobs by provider
  getJobsByProvider: (providerId: string) =>
    FirestoreService.getCollection(collections.jobs, [
      where("providerId", "==", providerId),
      orderBy("createdAt", "desc"),
    ]),

  // Get jobs by customer
  getJobsByCustomer: (customerId: string) =>
    FirestoreService.getCollection(collections.jobs, [
      where("customerId", "==", customerId),
      orderBy("createdAt", "desc"),
    ]),

  // Get job by ID
  getJobById: (jobId: string) =>
    FirestoreService.getDocument(collections.jobs, jobId),

  // Subscribe to provider jobs (real-time)
  subscribeToProviderJobs: (providerId: string, callback: (jobs: any[]) => void) =>
    FirestoreService.subscribeToCollection(
      collections.jobs,
      callback,
      [where("providerId", "==", providerId)]
    ),

  // Update job
  updateJob: (jobId: string, updates: any) =>
    FirestoreService.updateDocument(collections.jobs, jobId, updates),
};