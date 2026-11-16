/**
 * LinkWorks Physical Location Persistence Storage
 * 
 * Owner: Pasindu (Categories, location service, nearby worker discovery, search, public worker profiles, optional map)
 * 
 * This module persists verified GPS coordinates to the device's physical flash storage:
 * 1. Disk Persistence: Saves `linkworks_location.json` to `FileSystem.documentDirectory` across restarts.
 * 2. Instant Load: Loads the real coordinates on app boot so the map doesn't flash Colombo.
 * 3. Cross-Platform: Works on physical Android devices, emulators, and web localStorage.
 */

import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import type { SupportedCity } from './geo';

export interface PersistedLocation {
  lat: number;
  lng: number;
  city: SupportedCity;
  timestamp: number;
}

// File URI for persistent storage of confirmed user coordinates on physical flash disk.
const LOCATION_STORAGE_FILE_URI = FileSystem.documentDirectory
  ? `${FileSystem.documentDirectory}linkworks_location.json`
  : null;

// In-memory cache of the verified user location across the active session.
let CACHED_LOCATION: PersistedLocation | null = null;

// Safely read the saved GPS location from flash disk or web storage.
// Ensures the app immediately loads with the user's real location across restarts instead of defaulting to Colombo.
export async function loadPersistedLocation(): Promise<PersistedLocation | null> {
  if (CACHED_LOCATION) {
    return CACHED_LOCATION;
  }

  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem('linkworks_user_location');
        if (raw) {
          CACHED_LOCATION = JSON.parse(raw);
          return CACHED_LOCATION;
        }
      }
      return null;
    }

    if (LOCATION_STORAGE_FILE_URI) {
      const info = await FileSystem.getInfoAsync(LOCATION_STORAGE_FILE_URI);
      if (info.exists) {
        const content = await FileSystem.readAsStringAsync(LOCATION_STORAGE_FILE_URI);
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
          CACHED_LOCATION = parsed;
          return CACHED_LOCATION;
        }
      }
    }
  } catch (err) {
    console.warn('[LinkWorks Location Storage] Could not read saved location from disk:', err);
  }

  return null;
}

// Safely persist confirmed device GPS coordinates to flash storage.
// Called whenever a live GPS fix is successfully acquired in Discover, Post Job, or Search.
export async function savePersistedLocation(data: {
  lat: number;
  lng: number;
  city: SupportedCity;
}): Promise<void> {
  try {
    const payload: PersistedLocation = {
      lat: data.lat,
      lng: data.lng,
      city: data.city,
      timestamp: Date.now(),
    };

    CACHED_LOCATION = payload;
    const json = JSON.stringify(payload);

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('linkworks_user_location', json);
      }
      return;
    }

    if (LOCATION_STORAGE_FILE_URI) {
      await FileSystem.writeAsStringAsync(LOCATION_STORAGE_FILE_URI, json);
    }
  } catch (err) {
    console.warn('[LinkWorks Location Storage] Could not write location to disk:', err);
  }
}
