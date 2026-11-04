import { createContext, useContext, useState, type ReactNode } from 'react';
import { CITY_CENTERS, type SupportedCity } from './geo';

export type SearchCenterState = {
  city: SupportedCity;
  lat: number;
  lng: number;
  radiusKm: number;
  setCity: (city: SupportedCity) => void;
  setRadiusKm: (radius: number) => void;
};

// Create a shared context for holding the active search center across feeds.
const SearchCenterContext = createContext<SearchCenterState | null>(null);

// Provide search center state initialized to Colombo or a user's chosen city.
export function SearchCenterProvider({
  initialCity = 'Colombo',
  children,
}: {
  initialCity?: SupportedCity;
  children: ReactNode;
}) {
  const [city, setCityState] = useState<SupportedCity>(initialCity);
  const [radiusKm, setRadiusKm] = useState<number>(15);

  // When changing city, update the center coordinates from the standard catalog.
  function setCity(nextCity: SupportedCity) {
    setCityState(nextCity);
  }

  const coordinates = CITY_CENTERS[city] ?? CITY_CENTERS.Colombo;

  const value: SearchCenterState = {
    city,
    lat: coordinates.lat,
    lng: coordinates.lng,
    radiusKm,
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
      setCity: () => {},
      setRadiusKm: () => {},
    };
  }
  return context;
}
