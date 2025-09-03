// lib/db.ts - Firestore Service für CRUD Operationen
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
} from "firebase/firestore";
import { UserProfile } from "../types/userProfile";
import { db } from "./firebase/client"; // deine Instanz aus client.ts

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
} as const;

// Helper function to convert Firestore Timestamps to Dates
function convertTimestamps(data: any): any {
  if (!data) return data;

  const converted = { ...data };

  // Convert Firestore Timestamps to JavaScript Dates
  if (converted.createdAt && converted.createdAt instanceof Timestamp) {
    converted.createdAt = converted.createdAt.toDate();
  }
  if (converted.updatedAt && converted.updatedAt instanceof Timestamp) {
    converted.updatedAt = converted.updatedAt.toDate();
  }

  return converted;
}

function getDb() {
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }
  return db;
}

// Firestore Service für deine sidehustlers Datenbank
export class FirestoreService {
  // Get document by ID
  static async getDocument<T = DocumentData>(
    collectionName: string,
    id: string
  ): Promise<(T & { id: string }) | null> {
    try {
      const database = getDb();
      const docRef = doc(database, collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = convertTimestamps(docSnap.data());
        return { id: docSnap.id, ...data } as T & { id: string };
      } else {
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
      const database = getDb();
      const collectionRef = collection(database, collectionName);
      const q =
        constraints.length > 0
          ? query(collectionRef, ...constraints)
          : collectionRef;
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => {
        const data = convertTimestamps(doc.data());
        return {
          id: doc.id,
          ...data,
        } as T & { id: string };
      });
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
      const database = getDb();
      const collectionRef = collection(database, collectionName);
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: data.createdAt || serverTimestamp(),
        updatedAt: data.updatedAt || serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error("Error adding document:", error);
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
      const database = getDb();
      const docRef = doc(database, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
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
      const database = getDb();
      const docRef = doc(database, collectionName, id);
      await deleteDoc(docRef);
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

// User-specific functions - nutzt dein UserProfile Interface
export const userQueries = {
  // Get user by email
  getUserByEmail: async (email: string): Promise<UserProfile | null> => {
    const users = await FirestoreService.getCollection<UserProfile>(
      collections.users,
      [where("email", "==", email), limit(1)]
    );
    return users[0] || null;
  },

  // Get user by ID
  getUserById: async (id: string): Promise<UserProfile | null> => {
    return await FirestoreService.getDocument<UserProfile>(
      collections.users,
      id
    );
  },

  // Create user
  createUser: (userData: Omit<UserProfile, "id">): Promise<string> =>
    FirestoreService.addDocument(collections.users, userData),

  // Update user
  updateUser: (userId: string, userData: Partial<UserProfile>): Promise<void> =>
    FirestoreService.updateDocument(collections.users, userId, userData),
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
