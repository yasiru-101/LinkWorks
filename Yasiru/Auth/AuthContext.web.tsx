import { createContext, useContext, useState, type ReactNode } from 'react';
import type { UserProfile, UserRole } from '../../mobile/src/types/domain';

type WebAuthUser = { uid: string; phoneNumber: string | null };

type WebAuthState = {
  user: WebAuthUser | null;
  profile: UserProfile | null;
  workerReady: boolean;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  saveProfile: (input: Pick<UserProfile, 'name' | 'city' | 'isClient' | 'isWorker'>) => Promise<void>;
  selectRole: (role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  signInDemoClient: () => void;
  signInDemoWorker: () => void;
};

const AuthContext = createContext<WebAuthState | null>(null);

// Interactive provider for web browser testing allowing immediate preview of all client & worker flows.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<WebAuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [workerReady, setWorkerReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sign in as a demo client to explore discovery and job posting.
  function signInDemoClient() {
    setUser({ uid: 'demo-client-1', phoneNumber: '+94771234567' });
    setProfile({
      name: 'Kamal Perera',
      phone: '+94771234567',
      city: 'Colombo',
      isClient: true,
      isWorker: true,
      activeRole: 'client',
    });
    setWorkerReady(true);
  }

  // Sign in as a demo worker to explore matching job feeds.
  function signInDemoWorker() {
    setUser({ uid: 'worker-colombo-plumber-1', phoneNumber: '+94779876543' });
    setProfile({
      name: 'Sunil Shantha',
      phone: '+94779876543',
      city: 'Colombo',
      isClient: true,
      isWorker: true,
      activeRole: 'worker',
    });
    setWorkerReady(true);
  }

  // Save profile and hydrate state for web preview.
  async function saveProfile(input: Pick<UserProfile, 'name' | 'city' | 'isClient' | 'isWorker'>) {
    setUser({ uid: 'demo-user-1', phoneNumber: '+94771234567' });
    setProfile({
      name: input.name || 'Demo User',
      phone: '+94771234567',
      city: input.city || 'Colombo',
      isClient: input.isClient,
      isWorker: input.isWorker,
      activeRole: input.isClient ? 'client' : 'worker',
    });
    setWorkerReady(true);
  }

  // Toggle active role between Client and Worker tabs.
  async function selectRole(role: UserRole) {
    setProfile((prev) => (prev ? { ...prev, activeRole: role } : null));
  }

  // Sign out and return to the entry welcome screen.
  async function signOut() {
    setUser(null);
    setProfile(null);
    setWorkerReady(false);
  }

  const value: WebAuthState = {
    user,
    profile,
    workerReady,
    loading,
    error,
    refreshProfile: async () => {},
    saveProfile,
    selectRole,
    signOut,
    signInDemoClient,
    signInDemoWorker,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to access auth and web simulation methods.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
