import { getAuth, onAuthStateChanged, signOut as firebaseSignOut } from '@react-native-firebase/auth';
import { doc, getDocFromServer, getFirestore, serverTimestamp, setDoc, updateDoc } from '@react-native-firebase/firestore';
import * as FileSystem from 'expo-file-system/legacy';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import type { UserProfile, UserRole } from '../../mobile/src/types/domain';
import { CITY_CENTERS, geohashForPoint, type SupportedCity } from '../../Pasindu/Discovery/geo';
import { ensureFirebaseApp, getSafeAuth, getSafeFirestore } from './firebase';

// File URI for persisting active user session on physical device disk.
const SESSION_FILE_URI = FileSystem.documentDirectory
  ? `${FileSystem.documentDirectory}linkworks_session.json`
  : null;

// Write session to device storage so closing and restarting the app keeps the user signed in.
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
    console.warn('[LinkWorks Auth] Could not persist session to disk:', err);
  }
}

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
  signInDemoClient?: () => void;
  signInDemoWorker?: () => void;
  signInWithPhoneMock?: (phoneNumber: string, isRegister?: boolean) => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

// Convert unknown Firestore data into the private account shape used by navigation.
function readProfile(data: Record<string, unknown>): UserProfile {
  const isClient = data.isClient === true;
  const isWorker = data.isWorker === true;
  const requestedRole = data.activeRole;
  const activeRole: UserRole = requestedRole === 'worker' && isWorker ? 'worker' :
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

// Own the Firebase session and account profile so all screens share one consistent role.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [workerReady, setWorkerReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const generation = useRef(0);

  // Read both profile documents from the server after sign-in or a successful save.
  const refreshProfile = useCallback(async () => {
    let currentUser = null;
    try {
      currentUser = getSafeAuth().currentUser;
    } catch {
      // Safe fallback when Firebase native auth is unavailable
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
      const account = await getDocFromServer(doc(db, 'users', currentUser.uid));
      const nextProfile = account.exists() ? readProfile(account.data()) : null;
      const worker = nextProfile?.isWorker
        ? await getDocFromServer(doc(db, 'workerProfiles', currentUser.uid))
        : null;
      if (requestGeneration !== generation.current) return;
      setProfile(nextProfile);
      setWorkerReady(worker?.exists() === true);
    } catch (cause) {
      if (requestGeneration === generation.current) {
        setError(cause instanceof Error ? cause.message : String(cause));
      }
    } finally {
      if (requestGeneration === generation.current) setLoading(false);
    }
  }, []);

  // React to native Firebase sign-in changes and prevent an old read replacing a new session.
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(getSafeAuth(), (nextUser) => {
        generation.current += 1;
        if (nextUser) {
          setUser({ uid: nextUser.uid, phoneNumber: nextUser.phoneNumber });
          setProfile(null);
          setWorkerReady(false);
          setError(null);
          void refreshProfile();
        }
      });
    } catch (authErr) {
      console.warn('[LinkWorks Auth] Auth state listener notice:', authErr);
    }
    return () => {
      generation.current += 1;
      unsubscribe();
    };
  }, [refreshProfile]);

  // Restore persisted session from on-device storage on app boot.
  // This keeps the user logged in across app restarts and process kills.
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
            setLoading(false);
            console.log('[LinkWorks Auth] Session restored from device storage:', parsed.user.phoneNumber || parsed.user.uid);
          }
        }
      } catch (err) {
        console.warn('[LinkWorks Auth] Could not restore session from disk:', err);
      }
    }
    void restoreSavedSession();
  }, []);

  // Save the private account to Firestore (and worker profile if worker role is selected), then re-fetch.
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
    const name = input.name.trim();
    const city = input.city.trim();
    if (!name || !city || (!input.isClient && !input.isWorker)) {
      throw new Error('Enter name and city, then choose at least one role.');
    }
    const activeRole: UserRole = input.isWorker && !input.isClient ? 'worker' : 'client';

    // Support local demo account saving when bypassing native Firebase SMS
    if (!currentUser) {
      const nextProfile: UserProfile = {
        name,
        city,
        phone: user?.phoneNumber || '+94771234567',
        isClient: input.isClient,
        isWorker: input.isWorker,
        activeRole,
      };
      setProfile(nextProfile);
      const isReady = input.isWorker ? true : workerReady;
      if (input.isWorker) {
        setWorkerReady(true);
      }
      void persistSessionToDisk({ user, profile: nextProfile, workerReady: isReady });
      return;
    }

    if (!currentUser.phoneNumber) throw new Error('Sign in with a phone number first.');
    const db = getSafeFirestore();
    const userRef = doc(db, 'users', currentUser.uid);
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
      // Guarantee bio meets Firestore rules minimum length (>= 10 chars)
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
  }, [profile, refreshProfile, user]);

  // Persist the chosen role in the private account, while allowing only enabled roles.
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
      try {
        await updateDoc(doc(getSafeFirestore(), 'users', currentUser.uid), {
          activeRole: role,
          updatedAt: serverTimestamp(),
        });
      } catch {
        // Fallback for offline or test mode
      }
    }
    const updatedProfile = { ...profile, activeRole: role };
    setProfile(updatedProfile);
    void persistSessionToDisk({ user, profile: updatedProfile, workerReady });
  }, [profile, workerReady, user]);

  // Sign in as a demo client to explore discovery and job posting without SMS requirements.
  const signInDemoClient = useCallback(() => {
    const demoUser = { uid: 'client-demo-1', phoneNumber: '+94771234567' };
    const demoProfile: UserProfile = {
      name: 'Kamal Perera',
      phone: '+94771234567',
      city: 'Colombo',
      isClient: true,
      isWorker: true,
      activeRole: 'client',
    };
    setUser(demoUser);
    setProfile(demoProfile);
    setWorkerReady(true);
    setLoading(false);
    setError(null);
    void persistSessionToDisk({ user: demoUser, profile: demoProfile, workerReady: true });
  }, []);

  // Sign in as a demo worker to explore matching job feeds and quote submissions.
  const signInDemoWorker = useCallback(() => {
    const demoUser = { uid: 'worker-colombo-plumber-1', phoneNumber: '+94779876543' };
    const demoProfile: UserProfile = {
      name: 'Sunil Shantha',
      phone: '+94779876543',
      city: 'Colombo',
      isClient: true,
      isWorker: true,
      activeRole: 'worker',
    };
    setUser(demoUser);
    setProfile(demoProfile);
    setWorkerReady(true);
    setLoading(false);
    setError(null);
    void persistSessionToDisk({ user: demoUser, profile: demoProfile, workerReady: true });
  }, []);

  // Firebase sign-out clears both local state and native Firebase session.
  // Sign in with phone number directly for presentation / fallback testing when carrier SMS or regional policy blocks Firebase SMS.
  // When isRegister is true, profile starts as null to guide the user into the profile setup screen.
  const signInWithPhoneMock = useCallback(async (phoneNumber: string, isRegister = false) => {
    const phoneClean = phoneNumber.replace(/[\s()-]/g, '');
    const uid = 'user_' + phoneClean.replace('+', '');
    const activeUser = { uid, phoneNumber: phoneClean };
    setUser(activeUser);

    // Explicit registration mode always starts with an empty profile
    if (isRegister) {
      setProfile(null);
      setWorkerReady(false);
      setLoading(false);
      return;
    }

    try {
      const db = getSafeFirestore();
      const account = await getDocFromServer(doc(db, 'users', uid));
      if (account.exists()) {
        const nextProfile = readProfile(account.data());
        const worker = nextProfile.isWorker
          ? await getDocFromServer(doc(db, 'workerProfiles', uid))
          : null;
        setProfile(nextProfile);
        const isReady = worker?.exists() === true;
        setWorkerReady(isReady);
        void persistSessionToDisk({ user: activeUser, profile: nextProfile, workerReady: isReady });
      } else {
        setProfile(null);
        setWorkerReady(false);
      }
    } catch {
      // Offline fallback: for pre-configured test accounts provide default profile; new accounts start with null
      let fallbackProfile: UserProfile | null = null;
      if (phoneClean === '+94771234567') {
        fallbackProfile = {
          name: 'Kamal Perera',
          phone: phoneClean,
          city: 'Colombo',
          isClient: true,
          isWorker: true,
          activeRole: 'client',
        };
      } else if (phoneClean === '+94779876543') {
        fallbackProfile = {
          name: 'Sunil Shantha',
          phone: phoneClean,
          city: 'Colombo',
          isClient: true,
          isWorker: true,
          activeRole: 'worker',
        };
      }

      setProfile(fallbackProfile);
      setWorkerReady(!!fallbackProfile);
      if (fallbackProfile) {
        void persistSessionToDisk({ user: activeUser, profile: fallbackProfile, workerReady: true });
      }
    }
    setLoading(false);
    setError(null);
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    setProfile(null);
    setWorkerReady(false);
    void persistSessionToDisk(null);
    try {
      await firebaseSignOut(getAuth());
    } catch {
      // Ignored if not signed in via native Firebase
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
        signInDemoClient,
        signInDemoWorker,
        signInWithPhoneMock,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

// Fail clearly if a screen is mounted outside the auth provider.
export function useAuth(): AuthState {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider.');
  return value;
}
