import { getAuth, onAuthStateChanged, signOut as firebaseSignOut } from '@react-native-firebase/auth';
import { doc, getDocFromServer, getFirestore, serverTimestamp, setDoc, updateDoc } from '@react-native-firebase/firestore';
import * as FileSystem from 'expo-file-system/legacy';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import type { UserProfile, UserRole } from '../../mobile/src/types/domain';
import { CITY_CENTERS, geohashForPoint, type SupportedCity } from '../../Pasindu/Discovery/geo';
import { ensureFirebaseApp, getSafeAuth, getSafeFirestore } from './firebase';

// File URI for persisting active user session cache on physical device disk.
const SESSION_FILE_URI = FileSystem.documentDirectory
  ? `${FileSystem.documentDirectory}linkworks_session.json`
  : null;

// Write session cache to device storage so closing and restarting the app provides instant profile hydration.
async function persistSessionToDisk(data: { user: AuthUser | null; profile: UserProfile | null; workerReady: boolean } | null) {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (!data) window.localStorage.removeItem('linkworks_session');
        else window.localStorage.setItem('linkworks_session', JSON.stringify(data));
      }
      return;
    }
    if (SESSION_FILE_URI) {
      if (!data) {
        await FileSystem.deleteAsync(SESSION_FILE_URI, { idempotent: true });
      } else {
        await FileSystem.writeAsStringAsync(SESSION_FILE_URI, JSON.stringify(data));
      }
    }
  } catch (err) {
    console.warn('[LinkWorks Auth] Could not persist session cache to disk:', err);
  }
}

// User credentials and authentication state contracts.
type AuthUser = { uid: string; phoneNumber: string | null };
type AuthState = {
  user: AuthUser | null;
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

const AuthContext = createContext<AuthState | null>(null);

// Convert Firestore document data into the strongly-typed UserProfile structure.
function readProfile(data: Record<string, unknown>): UserProfile {
  const isClient = data.isClient === true;
  const isWorker = data.isWorker === true;
  const requestedRole = data.activeRole;
  const activeRole: UserRole =
    requestedRole === 'worker' && isWorker ? 'worker' :
    requestedRole === 'client' && isClient ? 'client' :
    isClient ? 'client' : 'worker';

  return {
    name: typeof data.name === 'string' ? data.name : '',
    phone: typeof data.phone === 'string' ? data.phone : '',
    city: typeof data.city === 'string' ? data.city : '',
    isClient,
    isWorker,
    activeRole,
    photoUrl: typeof data.photoUrl === 'string' ? data.photoUrl : undefined,
  };
}

// Global authentication provider managing pure Firebase Auth and Firestore profile synchronization.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [workerReady, setWorkerReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const generation = useRef(0);

  // Safety fallback: ensure initial loading resolves quickly even on slow or offline cellular networks
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(fallbackTimer);
  }, []);

  // Fetch the current user's profile and worker status directly from Cloud Firestore.
  const refreshProfile = useCallback(async () => {
    let currentUser = null;
    try {
      currentUser = getSafeAuth().currentUser;
    } catch {
      // Safe fallback when Firebase native auth is initializing
    }
    const requestGeneration = generation.current;
    if (!currentUser) {
      setProfile(null);
      setWorkerReady(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const db = getSafeFirestore();
      // Read users/{uid} directly from the Firestore server to ensure freshness
      const account = await getDocFromServer(doc(db, 'users', currentUser.uid));
      const nextProfile = account.exists() ? readProfile(account.data()) : null;

      // If registered as worker, verify if the public worker profile document is created
      const worker = nextProfile?.isWorker
        ? await getDocFromServer(doc(db, 'workerProfiles', currentUser.uid))
        : null;

      if (requestGeneration !== generation.current) return;

      const isWorkerReady = worker?.exists() === true;
      setProfile(nextProfile);
      setWorkerReady(isWorkerReady);

      // Cache verified session data on disk for fast cold start hydration
      void persistSessionToDisk({
        user: { uid: currentUser.uid, phoneNumber: currentUser.phoneNumber },
        profile: nextProfile,
        workerReady: isWorkerReady,
      });
    } catch (cause) {
      if (requestGeneration === generation.current) {
        setError(cause instanceof Error ? cause.message : String(cause));
      }
    } finally {
      if (requestGeneration === generation.current) {
        setLoading(false);
      }
    }
  }, []);

  // Listen to native Firebase Auth state changes and trigger profile lookup on sign in.
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(getSafeAuth(), (nextUser) => {
        generation.current += 1;
        if (nextUser) {
          setUser({ uid: nextUser.uid, phoneNumber: nextUser.phoneNumber });
          setError(null);
          void refreshProfile();
        } else {
          setUser(null);
          setProfile(null);
          setWorkerReady(false);
          setLoading(false);
          void persistSessionToDisk(null);
        }
      });
    } catch (authErr) {
      console.warn('[LinkWorks Auth] Auth state listener notice:', authErr);
      setLoading(false);
    }
    return () => {
      generation.current += 1;
      unsubscribe();
    };
  }, [refreshProfile]);

  // Restore cached session on initial app launch to avoid UI flicker while network loads.
  useEffect(() => {
    async function restoreSavedSession() {
      try {
        let savedRaw: string | null = null;
        if (Platform.OS === 'web') {
          if (typeof window !== 'undefined' && window.localStorage) {
            savedRaw = window.localStorage.getItem('linkworks_session');
          }
        } else if (SESSION_FILE_URI) {
          const info = await FileSystem.getInfoAsync(SESSION_FILE_URI);
          if (info.exists) {
            savedRaw = await FileSystem.readAsStringAsync(SESSION_FILE_URI);
          }
        }

        if (savedRaw) {
          const parsed = JSON.parse(savedRaw);
          if (parsed?.user && parsed?.profile) {
            setUser(parsed.user);
            setProfile(parsed.profile);
            setWorkerReady(parsed.workerReady ?? false);
            console.log('[LinkWorks Auth] Cached session restored:', parsed.user.phoneNumber || parsed.user.uid);
          }
        }
      } catch (err) {
        console.warn('[LinkWorks Auth] Could not restore cached session from disk:', err);
      }
    }
    void restoreSavedSession();
  }, []);

  // Save or update account profile in Cloud Firestore, then refresh session state.
  const saveProfile = useCallback(async (input: Pick<UserProfile, 'name' | 'city' | 'isClient' | 'isWorker'> & {
    skills?: string[];
    dayRateLkr?: number;
    experienceYears?: number;
    serviceRadiusKm?: number;
    bio?: string;
  }) => {
    let currentUser = null;
    try {
      currentUser = getSafeAuth().currentUser;
    } catch {
      // Safe fallback
    }

    if (!currentUser || !currentUser.phoneNumber) {
      throw new Error('Sign in with a verified phone number first.');
    }

    const name = input.name.trim();
    const city = input.city.trim();
    if (!name || !city || (!input.isClient && !input.isWorker)) {
      throw new Error('Enter name and city, then choose at least one role.');
    }
    const activeRole: UserRole = input.isWorker && !input.isClient ? 'worker' : 'client';

    const db = getSafeFirestore();
    const userRef = doc(db, 'users', currentUser.uid);

    // Write user account document with serverTimestamp
    await setDoc(userRef, {
      name,
      city,
      phone: currentUser.phoneNumber,
      isClient: input.isClient,
      isWorker: input.isWorker,
      activeRole,
      updatedAt: serverTimestamp(),
      ...(!profile ? { createdAt: serverTimestamp() } : {}),
    }, { merge: true });

    // If the account offers worker services, create or update the public worker profile document
    if (input.isWorker && input.skills && input.skills.length > 0) {
      const workerRef = doc(db, 'workerProfiles', currentUser.uid);
      const supportedCity: SupportedCity = city in CITY_CENTERS ? (city as SupportedCity) : 'Colombo';
      const center = CITY_CENTERS[supportedCity];
      const existing = await getDocFromServer(workerRef);

      // Guarantee bio meets Firestore rules minimum length (>= 10 characters)
      const bioText = (input.bio || '').trim();
      const defaultBio = `Experienced tradesperson serving ${city} and nearby communities with reliable quality.`;
      const finalBio = bioText.length >= 10 ? bioText : defaultBio;

      await setDoc(workerRef, {
        userId: currentUser.uid,
        displayName: name,
        city,
        skills: input.skills,
        bio: finalBio,
        experienceYears: input.experienceYears ?? 1,
        dayRateLkr: input.dayRateLkr ?? 4500,
        serviceRadiusKm: input.serviceRadiusKm ?? 15,
        base: { ...center, geohash: geohashForPoint(center.lat, center.lng) },
        portfolio: [],
        isAvailable: true,
        updatedAt: serverTimestamp(),
        ...(existing.exists() ? {} : {
          createdAt: serverTimestamp(),
          ratingAvg: 0,
          ratingCount: 0,
          jobsCompleted: 0,
        }),
      }, { merge: true });
    }

    await refreshProfile();
  }, [profile, refreshProfile]);

  // Persist the user's active role switch to Cloud Firestore.
  const selectRole = useCallback(async (role: UserRole) => {
    if (!profile) throw new Error('Complete your account first.');
    if ((role === 'client' && !profile.isClient) || (role === 'worker' && (!profile.isWorker || !workerReady))) {
      throw new Error('This role is not ready on your account.');
    }

    let currentUser = null;
    try {
      currentUser = getSafeAuth().currentUser;
    } catch {
      // Safe fallback
    }

    if (currentUser) {
      await updateDoc(doc(getSafeFirestore(), 'users', currentUser.uid), {
        activeRole: role,
        updatedAt: serverTimestamp(),
      });
    }

    const updatedProfile = { ...profile, activeRole: role };
    setProfile(updatedProfile);
    void persistSessionToDisk({ user, profile: updatedProfile, workerReady });
  }, [profile, workerReady, user]);

  // Sign out cleanly by revoking Firebase Auth session and clearing local caches.
  const signOut = useCallback(async () => {
    setUser(null);
    setProfile(null);
    setWorkerReady(false);
    void persistSessionToDisk(null);
    try {
      await firebaseSignOut(getSafeAuth());
    } catch {
      // Ignored if already signed out
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        workerReady,
        loading,
        error,
        refreshProfile,
        saveProfile,
        selectRole,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access authentication context in screens and components.
export function useAuth(): AuthState {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider.');
  return value;
}
