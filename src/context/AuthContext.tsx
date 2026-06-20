import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth, isFirebaseConfigured } from '../firebase/config';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  register: (email: string, pass: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  login: async () => {},
  register: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      // Set explicit persistence on init
      setPersistence(auth, browserLocalPersistence).catch(console.error);
      
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Demo Mode Local Storage Check
      const storedUser = localStorage.getItem('demo_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    if (isFirebaseConfigured && auth) {
      await setPersistence(auth, browserLocalPersistence);
      const credential = await signInWithEmailAndPassword(auth, email, pass);
      return credential.user;
    } else {
      const demoUser = { uid: 'demo_123', email, displayName: 'المستخدم التجريبي' };
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    }
  };

  const register = async (email: string, pass: string) => {
    if (isFirebaseConfigured && auth) {
      await setPersistence(auth, browserLocalPersistence);
      const credential = await createUserWithEmailAndPassword(auth, email, pass);
      return credential.user;
    } else {
      const demoUser = { uid: 'demo_123', email, displayName: 'المستخدم التجريبي' };
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    }
  };

  const loginWithGoogle = async () => {
    if (isFirebaseConfigured && auth) {
      await setPersistence(auth, browserLocalPersistence);
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      return credential.user;
    } else {
      // Mock Google Login in Demo Mode
      const demoUser = { uid: 'demo_google_123', email: 'google-user@demo.com', displayName: 'مستخدم جوجل تجريبي' };
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await firebaseSignOut(auth);
    } else {
      localStorage.removeItem('demo_user');
      localStorage.removeItem('demo_profile');
      setUser(null);
    }
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
