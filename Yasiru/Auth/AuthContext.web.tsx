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
  saveProfile: (input: Pick<UserProfile, 'name' | 'city' | 'isClient' | 'isWorker'> & {
    skills?: string[];
    dayRateLkr?: number;
    experienceYears?: number;
    serviceRadiusKm?: number;
    bio?: string;
  }) => Promise<void>;
  selectRole: (role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<WebAuthState | null>(null);

// Interactive provider for web browser testing allowing state synchronization across screens.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<WebAuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [workerReady, setWorkerReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refresh profile from backend session.
  async function refreshProfile() {
    // In web mode, session state is managed via React state and local storage
  }

  // Save the user profile and worker profile in memory for web preview and testing.
  async function saveProfile(input: Pick<UserProfile, 'name' | 'city' | 'isClient' | 'isWorker'> & {
    skills?: string[];
    dayRateLkr?: number;
    experienceYears?: number;
    serviceRadiusKm?: number;
    bio?: string;
  }) {
    const currentUid = user?.uid || 'user_' + Date.now();
    const currentPhone = user?.phoneNumber || '+94771234567';
    setUser({ uid: currentUid, phoneNumber: currentPhone });

    // Build the user profile object with chosen roles
    const newProfile: UserProfile = {
      name: input.name || 'LinkWorks Member',
      phone: currentPhone,
      city: input.city || 'Colombo',
      isClient: input.isClient,
      isWorker: input.isWorker,
      activeRole: input.isWorker && !input.isClient ? 'worker' : 'client',
    };
    setProfile(newProfile);

    // If worker role is selected, mark worker profile as ready
    if (input.isWorker) {
      setWorkerReady(true);
    }
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
    refreshProfile,
    saveProfile,
    selectRole,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to access auth and web simulation methods.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
