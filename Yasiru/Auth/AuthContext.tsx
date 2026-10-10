import { getAuth, onAuthStateChanged, signOut as firebaseSignOut } from '@react-native-firebase/auth';
import { doc, getDocFromServer, getFirestore, serverTimestamp, setDoc, updateDoc } from '@react-native-firebase/firestore';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { UserProfile, UserRole } from '../../mobile/src/types/domain';

type AuthUser = { uid: string; phoneNumber: string | null };
type AuthState = {
  user: AuthUser | null;
  profile: UserProfile | null;
  workerReady: boolean;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  saveProfile: (input: Pick<UserProfile, 'name' | 'city' | 'isClient' | 'isWorker'>) => Promise<void>;
  selectRole: (role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
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
    const currentUser = getAuth().currentUser;
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
      const account = await getDocFromServer(doc(getFirestore(), 'users', currentUser.uid));
      const nextProfile = account.exists() ? readProfile(account.data()) : null;
      const worker = nextProfile?.isWorker
        ? await getDocFromServer(doc(getFirestore(), 'workerProfiles', currentUser.uid))
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
    const unsubscribe = onAuthStateChanged(getAuth(), (nextUser) => {
      generation.current += 1;
      setUser(nextUser ? { uid: nextUser.uid, phoneNumber: nextUser.phoneNumber } : null);
      setProfile(null);
      setWorkerReady(false);
      setError(null);
      void refreshProfile();
    });
    return () => {
      generation.current += 1;
      unsubscribe();
    };
  }, [refreshProfile]);

  // Save the private account and let the server read-back confirm the result.
  const saveProfile = useCallback(async (input: Pick<UserProfile, 'name' | 'city' | 'isClient' | 'isWorker'>) => {
    const currentUser = getAuth().currentUser;
    if (!currentUser?.phoneNumber) throw new Error('Sign in with a phone number first.');
    const name = input.name.trim();
    const city = input.city.trim();
    if (!name || !city || (!input.isClient && !input.isWorker)) {
      throw new Error('Enter name and city, then choose at least one role.');
    }
    const activeRole: UserRole = input.isClient ? 'client' : 'worker';
    const reference = doc(getFirestore(), 'users', currentUser.uid);
    await setDoc(reference, {
      name,
      city,
      phone: currentUser.phoneNumber,
      isClient: input.isClient,
      isWorker: input.isWorker,
      activeRole,
      updatedAt: serverTimestamp(),
      ...(!profile ? { createdAt: serverTimestamp() } : {}),
    }, { merge: true });
    await refreshProfile();
  }, [profile, refreshProfile]);

  // Persist the chosen role in the private account, while allowing only enabled roles.
  const selectRole = useCallback(async (role: UserRole) => {
    const currentUser = getAuth().currentUser;
    if (!currentUser || !profile) throw new Error('Complete your account first.');
    if ((role === 'client' && !profile.isClient) || (role === 'worker' && (!profile.isWorker || !workerReady))) {
      throw new Error('This role is not ready on your account.');
    }
    await updateDoc(doc(getFirestore(), 'users', currentUser.uid), {
      activeRole: role,
      updatedAt: serverTimestamp(),
    });
    setProfile({ ...profile, activeRole: role });
  }, [profile, workerReady]);

  // Firebase sign-out clears the session through the listener above.
  const signOut = useCallback(async () => {
    await firebaseSignOut(getAuth());
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, workerReady, loading, error, refreshProfile, saveProfile, selectRole, signOut }}>
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
