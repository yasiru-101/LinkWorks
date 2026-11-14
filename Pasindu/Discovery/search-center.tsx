import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { CITY_CENTERS, findNearestSupportedCity, type SupportedCity } from './geo';
import { getCurrentDeviceLocation, isFusedLocationAvailable, requestLocationPermissions } from './location-service';

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

  // Request device coordinates from the native Fused Location Provider client.
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

      // Query Android Fused Location Provider with balanced power/accuracy
      const location = await getCurrentDeviceLocation(false);
      if (!location) {
        setIsGpsActive(false);
        setLocationError('Could not obtain GPS fix. Showing city center.');
        return false;
      }

      const coords = {
        lat: location.latitude,
        lng: location.longitude,
      };

      setLat(coords.lat);
      setLng(coords.lng);
      setIsGpsActive(true);

      // Identify nearest Sri Lankan trade hub and check coverage
      const nearestMatch = findNearestSupportedCity(coords);
      setCityState(nearestMatch.city);
      setCoverageDistanceKm(nearestMatch.distanceKm);
      setIsOutOfCoverage(!nearestMatch.inCoverage);

      return true;
    } catch (err) {
      setIsGpsActive(false);
      setLocationError(err instanceof Error ? err.message : 'Could not obtain GPS fix');
      return false;
    } finally {
      setIsLocating(false);
    }
  }, []);

  // Request foreground location on initial mount per Option A
  useEffect(() => {
    void requestDeviceLocation();
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
