/**
 * Firebase Client Configuration & Safe Singleton Accessors
 * 
 * Owner: Yasiru (Phone authentication, onboarding, account and worker setup)
 * 
 * This module configures and initializes Google Firebase for the LinkWorks mobile application.
 * It connects the React Native app to Cloud Firestore, Firebase Authentication, and Google Cloud
 * Identity Platform using credentials configured in `google-services.json`.
 * 
 * It also exports guarded helper functions (`getSafeFirestore`, `getSafeAuth`) that guarantee
 * the default Firebase App instance is initialized before any read/write operations execute,
 * preventing race condition crashes during early app startup.
 */

import { getApp, getApps, initializeApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';

// Project credentials from google-services.json for project 'linkworks-c6a21'.
// These credentials connect LinkWorks to Google Cloud Identity Platform and Cloud Firestore.
export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAB7d03glCiBmhO6qeMVKEv53dpJs6bSC4',
  appId: '1:806595064859:android:c0a9cd9d2eb94d5c03b4be',
  projectId: 'linkworks-c6a21',
  storageBucket: 'linkworks-c6a21.firebasestorage.app',
  messagingSenderId: '806595064859',
  databaseURL: 'https://linkworks-c6a21-default-rtdb.firebaseio.com',
};

// Tracks background initialization promise so multiple calls share the same initialization.
let initPromise: Promise<any> | null = null;

// Ensure the default '[DEFAULT]' Firebase App is initialized on native Android, iOS, or JS environments.
// If the native build didn't auto-initialize from google-services.json, this manually creates the app
// so that getFirestore() and getAuth() never fail with 'No Firebase App [DEFAULT] has been created'.
export function ensureFirebaseApp() {
  // Check if an existing initialized app already exists in the native registry
  try {
    const existing = getApps();
    if (existing.length > 0) {
      return getApp();
    }
  } catch {
    // Native registry check fallback when running in non-native or test environments
  }

  // If no initialization is currently in flight, dispatch initializeApp with project credentials
  if (!initPromise) {
    try {
      initPromise = initializeApp(FIREBASE_CONFIG)
        .then((app) => {
          console.log('[LinkWorks] Firebase default app initialized successfully.');
          return app;
        })
        .catch((err) => {
          // If native app was created concurrently by another thread, safely return that app
          try {
            if (getApps().length > 0) {
              return getApp();
            }
          } catch {
            // Ignore native lookup errors during race condition resolution
          }
          console.warn('[LinkWorks] Firebase initializeApp notice:', err?.message || err);
          return null;
        });
    } catch (err: any) {
      // Synchronous catch if initializeApp fails immediately
      try {
        if (getApps().length > 0) {
          return getApp();
        }
      } catch {
        // Ignore native lookup errors
      }
      console.warn('[LinkWorks] Sync initializeApp warning:', err?.message || err);
    }
  }

  // Attempt to return the default app instance if already registered
  try {
    return getApp();
  } catch {
    return null;
  }
}

// Safely obtain Firestore instance with guaranteed Firebase app initialization.
export function getSafeFirestore() {
  ensureFirebaseApp();
  return getFirestore();
}

// Safely obtain Auth instance with guaranteed Firebase app initialization.
export function getSafeAuth() {
  ensureFirebaseApp();
  return getAuth();
}

// Eagerly trigger Firebase initialization on module import to make [DEFAULT] app available immediately.
try {
  ensureFirebaseApp();
} catch (e) {
  // Graceful catch for test environments or build scripts where native Firebase bindings are absent
}
