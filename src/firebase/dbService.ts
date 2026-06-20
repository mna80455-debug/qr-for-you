import { db } from './config';
import { 
  collection, doc, getDoc, getDocs, addDoc, updateDoc, 
  deleteDoc, query, QueryConstraint 
} from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';

// ==========================================
// 1. TYPE-SAFE INTERFACES FOR ALL 20 COLLECTIONS
// ==========================================

export interface UserAuth {
  uid: string;
  email: string;
  emailVerified: boolean;
}

export interface UserProfile {
  id: string; // matches uid
  name: string;
  email: string;
  useCase: 'business' | 'attendance' | 'portfolio' | 'restaurant' | 'events';
  language: 'ar' | 'en';
  theme: 'light' | 'dark';
  createdAt: Date;
}

export interface QRCodeModel {
  id?: string;
  userId: string;
  workspaceId: string;
  name: string;
  content: string;
  qrType: string; // e.g. whatsapp, vcard, url
  fgColor: string;
  bgColor: string;
  gradientType: 'none' | 'linear' | 'radial';
  gradColor1: string;
  gradColor2: string;
  gradAngle: number;
  dotStyle: string;
  eyeStyle: string;
  eyeColor: string;
  logo: string | null;
  logoSize: number;
  frameType: string;
  frameText: string;
  frameColor: string;
  ctaTextSize: number;
  scansCount: number;
  isArchived: boolean;
  createdAt: Date;
}

export interface DynamicLink {
  id?: string;
  qrId: string;
  shortId: string;
  targetUrl: string;
  scansCount: number;
  isActive: boolean;
  createdAt: Date;
}

export interface QRTemplate {
  id?: string;
  userId: string;
  name: string;
  fgColor: string;
  bgColor: string;
  gradientType: 'none' | 'linear' | 'radial';
  gradColor1: string;
  gradColor2: string;
  gradAngle: number;
  dotStyle: string;
  eyeStyle: string;
  eyeColor: string;
  logo: string | null;
  logoSize: number;
  frameType: string;
  frameText: string;
  frameColor: string;
  ctaTextSize: number;
  createdAt: Date;
}

export interface CustomDesign {
  id?: string;
  qrId: string;
  dotStyle: string;
  eyeStyle: string;
  logo: string | null;
  logoSize: number;
  frameType: string;
  frameText: string;
}

export interface AnalyticsSummary {
  id?: string;
  qrId: string;
  totalScans: number;
  uniqueScans: number;
  devices: Record<string, number>;
  browsers: Record<string, number>;
  oss: Record<string, number>;
  countries: Record<string, number>;
  cities: Record<string, number>;
}

export interface ScanLog {
  id?: string;
  qrId: string;
  ip: string;
  device: string; // Mobile, Desktop, Tablet
  browser: string; // Chrome, Safari, Firefox, Edge, etc.
  os: string; // iOS, Android, Windows, macOS, Linux
  country: string;
  city: string;
  timestamp: Date;
}

export interface AttendanceSession {
  id?: string;
  userId: string;
  workspaceId: string;
  className: string;
  date: string;
  isActive: boolean;
  studentsCount: number;
  createdAt: Date;
}

export interface EventDetails {
  id?: string;
  userId: string;
  title: string;
  date: string;
  location: string;
  description: string;
  guestsCount: number;
  createdAt: Date;
}

export interface RestaurantMenu {
  id?: string;
  userId: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
}

export interface PortfolioModel {
  id?: string;
  userId: string;
  name: string;
  githubLink?: string;
  linkedinLink?: string;
  resumeUrl?: string;
  scansCount: number;
  createdAt: Date;
}

export interface Team {
  id?: string;
  name: string;
  ownerId: string;
  membersCount: number;
  createdAt: Date;
}

export interface Workspace {
  id?: string;
  name: string;
  type: 'personal' | 'team';
  ownerId: string;
  membersCount: number;
  createdAt: Date;
}

export interface NotificationModel {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'scan_alert' | 'team' | 'billing' | 'security';
  isRead: boolean;
  createdAt: Date;
}

export interface SubscriptionModel {
  id?: string;
  userId: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
}

export interface PaymentModel {
  id?: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed';
  invoiceId: string;
  receiptUrl: string;
  timestamp: Date;
}

export interface ApiKey {
  id?: string;
  userId: string;
  label: string;
  prefix: string;
  hash: string;
  isActive: boolean;
  createdAt: Date;
}

export interface ReportModel {
  id?: string;
  userId: string;
  name: string;
  type: 'csv' | 'pdf';
  fileUrl: string;
  createdAt: Date;
}

export interface FavoriteModel {
  id?: string;
  userId: string;
  qrId: string;
  createdAt: Date;
}

// ==========================================
// 2. DATABASE OPERATIONS LAYER (CRUD WRAAPERS)
// ==========================================

export const dbService = {
  /**
   * Add a document to a specific collection
   */
  async add<T extends DocumentData>(collectionName: string, data: T): Promise<string> {
    const colRef = collection(db, collectionName);
    const docRef = await addDoc(colRef, data);
    return docRef.id;
  },

  /**
   * Set or update a specific document by ID
   */
  async update<T extends DocumentData>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data as DocumentData);
  },

  /**
   * Retrieve a single document by ID
   */
  async get<T>(collectionName: string, id: string): Promise<T | null> {
    const docRef = doc(db, collectionName, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as T;
    }
    return null;
  },

  /**
   * Delete a document by ID
   */
  async delete(collectionName: string, id: string): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  },

  /**
   * Run a custom query with constraints
   */
  async query<T>(collectionName: string, ...constraints: QueryConstraint[]): Promise<T[]> {
    const colRef = collection(db, collectionName);
    const q = query(colRef, ...constraints);
    const snap = await getDocs(q);
    const results: T[] = [];
    snap.forEach((docSnap) => {
      results.push({ id: docSnap.id, ...docSnap.data() } as T);
    });
    return results;
  },

  /**
   * Get all documents in a collection
   */
  async getAll<T>(collectionName: string): Promise<T[]> {
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    const results: T[] = [];
    snap.forEach((docSnap) => {
      results.push({ id: docSnap.id, ...docSnap.data() } as T);
    });
    return results;
  }
};
