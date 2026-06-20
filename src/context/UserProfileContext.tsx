import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db, isFirebaseConfigured } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type UseCase = 'attendance' | 'business' | 'portfolio' | 'restaurant' | 'small_business' | 'inventory' | 'events' | 'personal' | 'other' | null;

export interface UserProfile {
  name: string;
  email: string;
  useCase: UseCase;
  plan?: 'free' | 'pro' | 'enterprise';
  billingCycle?: 'monthly' | 'yearly';
  subscriptionActive?: boolean;
}

interface UserProfileContextType {
  profile: UserProfile | null;
  loadingProfile: boolean;
  setProfile: (profile: UserProfile | null) => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType>({
  profile: null,
  loadingProfile: true,
  setProfile: async () => {},
});

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoadingProfile(false);
        return;
      }

      // Check local cache first for instant loading
      const localCache = localStorage.getItem(`profile_${user.uid}`);
      if (localCache) {
        setProfile(JSON.parse(localCache));
      }

      if (isFirebaseConfigured && db) {
        try {
          // Set a timeout for Firestore fetch so it doesn't hang if database is locked/not created
          const fetchPromise = getDoc(doc(db, 'users', user.uid));
          const timeoutPromise = new Promise<null>((_, reject) => 
            setTimeout(() => reject(new Error('Firestore timeout')), 3000)
          );

          const docSnap = await Promise.race([fetchPromise, timeoutPromise]) as any;

          if (docSnap && docSnap.exists()) {
            const data = docSnap.data();
            const firestoreProfile = data.profile || null;
            // Ensure plan fields are set in profile if missing
            if (firestoreProfile && !firestoreProfile.plan) {
              firestoreProfile.plan = 'free';
              firestoreProfile.billingCycle = 'monthly';
              firestoreProfile.subscriptionActive = true;
            }
            setProfile(firestoreProfile);
            if (firestoreProfile) {
              localStorage.setItem(`profile_${user.uid}`, JSON.stringify(firestoreProfile));
            }
          } else {
            // Document doesn't exist, create it
            const defaultProfile = { 
              name: user.displayName || user.email.split('@')[0], 
              email: user.email, 
              useCase: null,
              plan: 'free' as const,
              billingCycle: 'monthly' as const,
              subscriptionActive: true
            };
            // Async write in background so we don't block loading
            setDoc(doc(db, 'users', user.uid), { profile: defaultProfile }).catch(err => {
              console.warn("Background Firestore set doc failed:", err);
            });
            setProfile(defaultProfile);
            localStorage.setItem(`profile_${user.uid}`, JSON.stringify(defaultProfile));
          }
        } catch (error) {
          console.warn("Firestore fetch failed, relying on local cache or default:", error);
          if (!localCache) {
            setProfile({ 
              name: user.displayName || user.email.split('@')[0], 
              email: user.email, 
              useCase: null,
              plan: 'free',
              billingCycle: 'monthly',
              subscriptionActive: true
            });
          }
        }
      } else {
        if (!localCache) {
          setProfile({ 
            name: user.displayName || 'المستخدم التجريبي', 
            email: user.email, 
            useCase: null,
            plan: 'free',
            billingCycle: 'monthly',
            subscriptionActive: true
          });
        }
      }
      setLoadingProfile(false);
    };

    loadProfile();
  }, [user]);

  // Handle color accent theme setup based on useCase color code
  useEffect(() => {
    if (profile?.useCase) {
      const useCaseColorMap: Record<string, string> = {
        business: '#3B82F6', // Blue
        attendance: '#10B981', // Green
        restaurant: '#F59E0B', // Orange
        events: '#8B5CF6', // Purple
        portfolio: '#EC4899', // Pink
      };
      if (useCaseColorMap[profile.useCase]) {
        document.documentElement.style.setProperty('--accent-color', useCaseColorMap[profile.useCase]);
      }
    }
  }, [profile]);

  const handleSetProfile = async (newProfile: UserProfile | null) => {
    setProfile(newProfile);
    if (!user) return;

    // Always cache in localStorage instantly
    if (newProfile) {
      localStorage.setItem(`profile_${user.uid}`, JSON.stringify(newProfile));
    }

    if (isFirebaseConfigured && db) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { profile: newProfile }, { merge: true });
      } catch (error) {
        console.warn("Error saving profile to Firestore, cached locally:", error);
      }
    }
  };

  return (
    <UserProfileContext.Provider value={{ profile, loadingProfile, setProfile: handleSetProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext);
