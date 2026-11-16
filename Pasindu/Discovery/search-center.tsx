/**
 * Search Center & GPS State Management Provider
 * 
 * Owner: Pasindu (Categories, location service, nearby worker discovery, search, public worker profiles, optional map)
 * 
 * This module provides the central spatial state context across all LinkWorks discovery feeds and job listings:
 * 1. Coordinates: Holds active search latitude and longitude (either live GPS fix or manual city center).
 * 2. Search Radius: Configures user-selected radial filter (5km to 50km).
 * 3. Hardware Fused Location Client: Safely requests Android foreground location permissions and fetches coordinates.
 * 4. Coverage Boundary Evaluation: Checks if device is outside LinkWorks' 45km coverage radius and flags out-of-coverage notices.
 * 5. City Override: Allows immediate manual city selection without requiring GPS hardware.
 */

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { CITY_CENTERS, findNearestSupportedCity, type SupportedCity } from './geo';
import { getCurrentDeviceLocation, getLastKnownDeviceLocation, isFusedLocationAvailable, requestLocationPermissions } from './location-service';
import { loadPersistedLocation, savePersistedLocation } from './location-storage';

export type SearchCenterState = {
  city: SupportedCity;
  lat: number;
  lng: number;
  radiusKm: number;
  isGpsActive: boolean;
  isLocating: boolean;
  isOutOfCoverage: boolean;
  coverageDistanceKm: number;
  permissionStatus: 'granted' | 'denied' | 'undetermined';
  locationError: string | null;
  requestDeviceLocation: (forceRefresh?: boolean) => Promise<boolean>;
  setCity: (city: SupportedCity) => void;
  setRadiusKm: (radius: number) => void;
};

// Create a shared context for holding the active search center across feeds.
const SearchCenterContext = createContext<SearchCenterState | null>(null);

// Provide dynamic search center state powered by Google's Fused Location Provider on Android.
export function SearchCenterProvider({
  initialCity = 'Colombo',
  children,
}: {
  initialCity?: SupportedCity;
  children: ReactNode;
}) {
  const initialCoords = CITY_CENTERS[initialCity] ?? CITY_CENTERS.Colombo;
  const [city, setCityState] = useState<SupportedCity>(initialCity);
  const [lat, setLat] = useState<number>(initialCoords.lat);
  const [lng, setLng] = useState<number>(initialCoords.lng);
  const [radiusKm, setRadiusKm] = useState<number>(15);
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isOutOfCoverage, setIsOutOfCoverage] = useState<boolean>(false);
  const [coverageDistanceKm, setCoverageDistanceKm] = useState<number>(0);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');
  const [locationError, setLocationError] = useState<string | null>(null);

  // Request device coordinates using two-stage lookup (0ms cache hit + fresh satellite fix).
  const requestDeviceLocation = useCallback(async (forceRefresh = false): Promise<boolean> => {
    try {
      setIsLocating(true);
      setLocationError(null);

      // Check if native Fused Location module is linked in the running APK binary
      if (!isFusedLocationAvailable()) {
        setIsGpsActive(false);
        setPermissionStatus('denied');
        setLocationError('Native location module not present in this APK build. Using city center.');
        return false;
      }

      // Check / request foreground location permission
      const { status } = await requestLocationPermissions();
      setPermissionStatus(status === 'granted' ? 'granted' : 'denied');

      if (status !== 'granted') {
        setIsGpsActive(false);
        setIsLocating(false);
        setLocationError('Location permission denied. Showing city center.');
        return false;
      }

      let hadCacheHit = false;

      // Stage A (0ms Cache Hit): Instantly read last known hardware location so map doesn't flash Colombo
      const cached = await getLastKnownDeviceLocation();
      if (cached) {
        hadCacheHit = true;
        const cachedCoords = { lat: cached.latitude, lng: cached.longitude };
        setLat(cachedCoords.lat);
        setLng(cachedCoords.lng);
        setIsGpsActive(true);

        const nearestMatch = findNearestSupportedCity(cachedCoords);
        setCityState(nearestMatch.city);
        setCoverageDistanceKm(nearestMatch.distanceKm);
        setIsOutOfCoverage(!nearestMatch.inCoverage);

        void savePersistedLocation({
          lat: cachedCoords.lat,
          lng: cachedCoords.lng,
          city: nearestMatch.city,
        });
      }

      // Stage B (High Accuracy Fix): Query Android Fused Location Provider with 8s timeout protection
      const fresh = await getCurrentDeviceLocation(true);
      if (fresh) {
        const freshCoords = { lat: fresh.latitude, lng: fresh.longitude };
        setLat(freshCoords.lat);
        setLng(freshCoords.lng);
        setIsGpsActive(true);

        const freshMatch = findNearestSupportedCity(freshCoords);
        setCityState(freshMatch.city);
        setCoverageDistanceKm(freshMatch.distanceKm);
        setIsOutOfCoverage(!freshMatch.inCoverage);

        void savePersistedLocation({
          lat: freshCoords.lat,
          lng: freshCoords.lng,
          city: freshMatch.city,
        });

        return true;
      }

      // If fresh satellites timed out indoors but we got a valid cache hit, consider it successful
      if (hadCacheHit) {
        return true;
      }

      // If no GPS fix could be acquired and we had no cache
      setIsGpsActive(false);
      setLocationError('Could not obtain GPS fix. Showing city center.');
      return false;
    } catch (err) {
      setIsGpsActive(false);
      setLocationError(err instanceof Error ? err.message : 'Could not obtain GPS fix');
      return false;
    } finally {
      setIsLocating(false);
    }
  }, []);

  // On mount, immediately restore persisted coordinates from flash disk, then fetch live hardware fix
  useEffect(() => {
    let isMounted = true;

    async function initializeLocation() {
      // Step 1: Read saved coordinates from disk immediately (0ms)
      const persisted = await loadPersistedLocation();
      if (isMounted && persisted) {
        setLat(persisted.lat);
        setLng(persisted.lng);
        setCityState(persisted.city);
        setIsGpsActive(true);

        const match = findNearestSupportedCity({ lat: persisted.lat, lng: persisted.lng });
        setCoverageDistanceKm(match.distanceKm);
        setIsOutOfCoverage(!match.inCoverage);
      }

      // Step 2: Acquire fresh hardware GPS fix in the background
      if (isMounted) {
        void requestDeviceLocation(true);
      }
    }

    void initializeLocation();

    return () => {
      isMounted = false;
    };
  }, [requestDeviceLocation]);

  // When user manually selects a city, switch coordinates to that city's center
  function setCity(nextCity: SupportedCity) {
    setCityState(nextCity);
    const coords = CITY_CENTERS[nextCity] ?? CITY_CENTERS.Colombo;
    setLat(coords.lat);
    setLng(coords.lng);
    setIsGpsActive(false);
    setIsOutOfCoverage(false);
    setLocationError(null);
  }

  const value: SearchCenterState = {
    city,
    lat,
    lng,
    radiusKm,
    isGpsActive,
    isLocating,
    isOutOfCoverage,
    coverageDistanceKm,
    permissionStatus,
    locationError,
    requestDeviceLocation,
    setCity,
    setRadiusKm,
  };

  return <SearchCenterContext.Provider value={value}>{children}</SearchCenterContext.Provider>;
}

// Hook for accessing the current search center, radius, and city switchers.
export function useSearchCenter(): SearchCenterState {
  const context = useContext(SearchCenterContext);
  if (!context) {
    // Return a safe fallback if rendered outside a provider (e.g. unit tests or standalone components).
    return {
      city: 'Colombo',
      lat: CITY_CENTERS.Colombo.lat,
      lng: CITY_CENTERS.Colombo.lng,
      radiusKm: 15,
      isGpsActive: false,
      isLocating: false,
      isOutOfCoverage: false,
      coverageDistanceKm: 0,
      permissionStatus: 'undetermined',
      locationError: null,
      requestDeviceLocation: async () => false,
      setCity: () => {},
      setRadiusKm: () => {},
    };
  }
  return context;
}
