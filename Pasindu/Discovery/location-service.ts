/**
 * Location Service & Fused Location Provider Safe Wrapper
 *
 * Owner: Pasindu (Categories, location service, nearby worker discovery, search, public worker profiles, optional map)
 *
 * This service safely interfaces with Google's Fused Location Provider via `expo-location`.
 * If the current APK binary was compiled without the native 'ExpoLocation' module
 * (such as an older development build or web browser), this wrapper catches the missing native module
 * error, logs a non-fatal warning, and provides safe fallback responses so the application
 * continues to function smoothly without crashing.
 */

import { Linking } from 'react-native';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface LocationPermissionResult {
  status: 'granted' | 'denied' | 'undetermined';
}

export interface ReadableAddress {
  city?: string | null;
  district?: string | null;
  street?: string | null;
  subregion?: string | null;
  region?: string | null;
  name?: string | null;
  formattedAddress: string;
}

// Dynamically reference expo-location native module inside try-catch to avoid static import crashes
let expoLocationModule: typeof import('expo-location') | null = null;
let isNativeModulePresent = false;

try {
  // Use require inside try-catch to prevent uncaught module evaluation errors
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  expoLocationModule = require('expo-location');
  isNativeModulePresent = Boolean(expoLocationModule && typeof expoLocationModule.requestForegroundPermissionsAsync === 'function');
} catch (err) {
  // Caught when running inside an APK binary that does not include ExpoLocation native symbols
  console.warn(
    "[LinkWorks Location] 'ExpoLocation' native module is not present in this APK build. " +
    "GPS features will safely fallback to city center coordinates."
  );
  expoLocationModule = null;
  isNativeModulePresent = false;
}

// Check whether native Fused Location Provider hardware module is available in this APK
export function isFusedLocationAvailable(): boolean {
  return isNativeModulePresent && expoLocationModule !== null;
}

// Check whether system-level location services (GPS hardware switch) are enabled on the device.
// If disabled on Android, triggers Google Play Services' standard "Turn on device location" dialog
// so the user can enable GPS with a single tap without leaving the application.
export async function ensureLocationServicesEnabled(): Promise<boolean> {
  if (!expoLocationModule || typeof expoLocationModule.hasServicesEnabledAsync !== 'function') {
    return true; // Fallback to true if cannot check to allow downstream permission checks to handle it
  }
  try {
    const enabled = await expoLocationModule.hasServicesEnabledAsync();
    if (enabled) {
      return true;
    }
    // Location services are disabled at the system/hardware level.
    // On Android, enableNetworkProviderAsync prompts Google Play Services LocationSettings dialog.
    if (typeof expoLocationModule.enableNetworkProviderAsync === 'function') {
      try {
        await expoLocationModule.enableNetworkProviderAsync();
        return await expoLocationModule.hasServicesEnabledAsync();
      } catch (promptErr) {
        // User dismissed the Google Play Services dialog or hardware lacks provider
        console.warn('[LinkWorks Location] User declined to enable location services or prompt failed:', promptErr);
        return false;
      }
    }
    return false;
  } catch (err) {
    console.warn('[LinkWorks Location] Error checking system location services:', err);
    return true;
  }
}

// Request foreground location permissions safely without crashing if native module is absent
export async function requestLocationPermissions(): Promise<LocationPermissionResult> {
  if (!expoLocationModule) {
    return { status: 'denied' };
  }
  try {
    const result = await expoLocationModule.requestForegroundPermissionsAsync();
    return { status: result.status };
  } catch (err) {
    console.warn('[LinkWorks Location] Failed to request foreground permission:', err);
    return { status: 'denied' };
  }
}

// Query cached device coordinates from Android hardware cache in 0ms without waiting for GPS satellites.
// Allows the map to snap to the user's real location instantly on app launch.
export async function getLastKnownDeviceLocation(): Promise<LocationCoords | null> {
  if (!expoLocationModule || typeof expoLocationModule.getLastKnownPositionAsync !== 'function') {
    return null;
  }
  try {
    const position = await expoLocationModule.getLastKnownPositionAsync({});
    if (!position?.coords) {
      return null;
    }
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch (err) {
    console.warn('[LinkWorks Location] Failed to obtain cached device coordinates:', err);
    return null;
  }
}

// Query device coordinates using a multi-tier strategy (indoor-resilient Balanced + outdoor High satellite fix).
// If high accuracy GPS satellites time out indoors (obscured sky), gracefully falls back to the Balanced fix
// instead of failing and reverting to Colombo center coordinates.
export async function getCurrentDeviceLocation(
  accuracyHigh = true
): Promise<LocationCoords | null> {
  if (!expoLocationModule || typeof expoLocationModule.getCurrentPositionAsync !== 'function') {
    return null;
  }

  // Tier 1: Query with Balanced accuracy (Wi-Fi + cellular network triangulation)
  // Highly resilient indoors where satellite signals cannot penetrate building walls, resolving in 1-2s.
  let balancedCoords: LocationCoords | null = null;
  try {
    const balancedAccuracy = expoLocationModule.Accuracy?.Balanced ?? 3;
    const balancedPromise = expoLocationModule.getCurrentPositionAsync({ accuracy: balancedAccuracy });
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3500));
    const pos = await Promise.race([balancedPromise, timeoutPromise]);
    if (pos?.coords) {
      balancedCoords = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };
    }
  } catch (err) {
    console.warn('[LinkWorks Location] Balanced accuracy lookup encountered error:', err);
  }

  // If high accuracy is not requested and we already have a balanced fix, return it immediately
  if (!accuracyHigh && balancedCoords) {
    return balancedCoords;
  }

  // Tier 2: Query with High accuracy (GPS satellite lock)
  // Provides 3-5 meter pinpoint precision when outdoors with clear line of sight to satellites.
  try {
    const highAccuracy = expoLocationModule.Accuracy?.High ?? 4;
    const highPromise = expoLocationModule.getCurrentPositionAsync({ accuracy: highAccuracy });
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 4500));
    const pos = await Promise.race([highPromise, timeoutPromise]);
    if (pos?.coords) {
      return {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };
    }
  } catch (err) {
    console.warn('[LinkWorks Location] High accuracy lookup encountered error:', err);
  }

  // If High accuracy timed out (e.g. user is indoors with weak satellite signal), gracefully return the Balanced fix!
  if (balancedCoords) {
    return balancedCoords;
  }

  return null;
}

// Reverse-geocode latitude and longitude coordinates into a human-readable street/city address.
export async function getReadableAddress(coords: LocationCoords): Promise<ReadableAddress | null> {
  if (!expoLocationModule || typeof expoLocationModule.reverseGeocodeAsync !== 'function') {
    return null;
  }
  try {
    const results = await expoLocationModule.reverseGeocodeAsync({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
    if (!results || results.length === 0) {
      return null;
    }
    const item = results[0];
    const parts = [item.name, item.street, item.subregion || item.city, item.region]
      .filter(Boolean)
      .filter((val, idx, arr) => arr.indexOf(val) === idx);

    return {
      city: item.city,
      district: item.district,
      street: item.street,
      subregion: item.subregion,
      region: item.region,
      name: item.name,
      formattedAddress: parts.join(', ') || item.city || 'Current Location',
    };
  } catch (err) {
    console.warn('[LinkWorks Location] Failed to reverse geocode coordinates:', err);
    return null;
  }
}

// Open the operating system's native application settings screen so the user can easily grant location permissions.
export async function openLocationSettings(): Promise<void> {
  try {
    await Linking.openSettings();
  } catch (err) {
    console.warn('[LinkWorks Location] Could not open application settings:', err);
  }
}
