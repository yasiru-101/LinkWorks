import { createContext, useContext, type ReactNode } from 'react';
import type { UserProfile, UserRole } from '../../mobile/src/types/domain';

type WebAuthState = {
  user: null;
  profile: UserProfile | null;
  workerReady: boolean;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  saveProfile: (input: Pick<UserProfile, 'name' | 'city' | 'isClient' | 'isWorker'>) => Promise<void>;
  selectRole: (role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
};

// Web is a visual preview because the native phone verification SDK runs on Android.
const preview: WebAuthState = {
  user: null,
  profile: null,
  workerReady: false,
  loading: false,
  error: null,
  refreshProfile: async () => {},
  saveProfile: async () => { throw new Error('Use the Android development build to save a profile.'); },
  selectRole: async () => { throw new Error('Use the Android development build to switch roles.'); },
  signOut: async () => {},
};

const AuthContext = createContext(preview);

// Keep the same provider interface so shared navigation can render on web.
export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthContext.Provider value={preview}>{children}</AuthContext.Provider>;
}

// Expose the preview session to routes without loading native Firebase modules.
export function useAuth() {
  return useContext(AuthContext);
}
