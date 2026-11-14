/**
 * Location Service (Safe Native Module Wrapper)
 *
 * This service safely interfaces with Google's Fused Location Provider via `expo-location`.
 * If the current APK binary was compiled without the native 'ExpoLocation' module
 * (such as an older development build), this wrapper catches the missing native module
 * error, logs a non-fatal warning, and provides safe fallback responses so the application
 * continues to function smoothly without crashing.
 */

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface LocationPermissionResult {
  status: 'granted' | 'denied' | 'undetermined';
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

// Query device coordinates from Fused Location Provider with balanced power/accuracy
export async function getCurrentDeviceLocation(
  accuracyHigh = false
): Promise<LocationCoords | null> {
  if (!expoLocationModule) {
    return null;
  }
  try {
    const accuracy = accuracyHigh
      ? (expoLocationModule.Accuracy?.High ?? 4)
      : (expoLocationModule.Accuracy?.Balanced ?? 3);

    const position = await expoLocationModule.getCurrentPositionAsync({
      accuracy,
    });

    if (!position?.coords) {
      return null;
    }

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch (err) {
    console.warn('[LinkWorks Location] Failed to obtain device coordinates:', err);
    return null;
  }
}
