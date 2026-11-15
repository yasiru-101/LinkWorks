import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, where } from '@react-native-firebase/firestore';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import type { Job } from '../../mobile/src/types/domain';
import { getSafeFirestore } from '../../Yasiru/Auth/firebase';

// File URI for persistent JSON storage on the physical device flash disk.
const STORAGE_FILE_URI = FileSystem.documentDirectory
  ? `${FileSystem.documentDirectory}linkworks_jobs.json`
  : null;

// Memory cache of persistent jobs across the active session.
let CACHED_PERSISTENT_JOBS: Array<Job & { id: string }> = [];

// Safely read saved jobs from device flash storage or web localStorage.
export async function loadPersistentJobs(): Promise<Array<Job & { id: string }>> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem('linkworks_jobs');
        if (raw) {
          CACHED_PERSISTENT_JOBS = JSON.parse(raw);
          return CACHED_PERSISTENT_JOBS;
        }
      }
      return CACHED_PERSISTENT_JOBS;
    }

    if (STORAGE_FILE_URI) {
      const info = await FileSystem.getInfoAsync(STORAGE_FILE_URI);
      if (info.exists) {
        const content = await FileSystem.readAsStringAsync(STORAGE_FILE_URI);
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          CACHED_PERSISTENT_JOBS = parsed;
          return CACHED_PERSISTENT_JOBS;
        }
      }
    }
  } catch (err) {
    console.warn('[LinkWorks Storage] Could not read saved jobs from disk:', err);
  }
  return CACHED_PERSISTENT_JOBS;
}

// Safely persist the current jobs array to device flash storage or web localStorage.
async function writePersistentJobsToDisk(jobs: Array<Job & { id: string }>): Promise<void> {
  try {
    CACHED_PERSISTENT_JOBS = jobs;
    const json = JSON.stringify(jobs);

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('linkworks_jobs', json);
      }
      return;
    }

    if (STORAGE_FILE_URI) {
      await FileSystem.writeAsStringAsync(STORAGE_FILE_URI, json);
    }
  } catch (err) {
    console.warn('[LinkWorks Storage] Could not write jobs to disk:', err);
  }
}

// Save a newly published job to both Cloud Firestore and physical device storage.
// This ensures the job remains permanent across app restarts, reboots, and offline presentation modes.
export async function savePersistentJob(newJob: Job & { id: string }): Promise<void> {
  // 1. Attempt Cloud Firestore write
  try {
    const db = getSafeFirestore();
    await addDoc(collection(db, 'jobs'), {
      clientId: newJob.clientId,
      title: newJob.title.trim(),
      description: newJob.description.trim(),
      categoryId: newJob.categoryId,
      photos: newJob.photos || [],
      budgetMinLkr: newJob.budgetMinLkr,
      budgetMaxLkr: newJob.budgetMaxLkr,
      geo: newJob.geo,
      addressText: newJob.addressText,
      preferredDate: newJob.preferredDate,
      status: 'open',
      applicationCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('[LinkWorks Storage] Job successfully synced to Cloud Firestore.');
  } catch (firestoreErr) {
    console.warn('[LinkWorks Storage] Cloud Firestore write notice:', firestoreErr);
  }

  // 2. Persist to on-device flash storage
  const current = await loadPersistentJobs();
  const updated = [newJob, ...current.filter((j) => j.id !== newJob.id)];
  await writePersistentJobsToDisk(updated);
}

// Permanently delete a job from Cloud Firestore and on-device storage.
// Called when the job owner taps the Delete Job button.
export async function removePersistentJob(jobId: string): Promise<void> {
  // 1. Attempt deletion from Cloud Firestore
  try {
    const db = getSafeFirestore();
    await deleteDoc(doc(db, 'jobs', jobId));
    console.log('[LinkWorks Storage] Job successfully deleted from Cloud Firestore.');
  } catch (firestoreErr) {
    console.warn('[LinkWorks Storage] Cloud Firestore delete notice:', firestoreErr);
  }

  // 2. Remove from on-device flash storage
  const current = await loadPersistentJobs();
  const updated = current.filter((j) => j.id !== jobId);
  await writePersistentJobsToDisk(updated);
}

// Synchronous accessor returning all currently loaded persistent jobs.
export function getPersistentJobs(): Array<Job & { id: string }> {
  return CACHED_PERSISTENT_JOBS;
}

// Eagerly trigger load on module import so jobs are ready immediately.
void loadPersistentJobs();
