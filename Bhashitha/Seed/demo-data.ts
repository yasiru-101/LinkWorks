import { CITY_CENTERS, geohashForPoint } from '../../Pasindu/Discovery/geo';

// Keep fictional nearby workers ready for query and empty-state testing.
export const DEMO_WORKERS = [
  { id: 'demo-colombo-plumber', displayName: 'Demo Plumber', skills: ['Plumbing'], isAvailable: true, base: { ...CITY_CENTERS.Colombo, geohash: geohashForPoint(CITY_CENTERS.Colombo.lat, CITY_CENTERS.Colombo.lng) } },
  { id: 'demo-moratuwa-carpenter', displayName: 'Demo Carpenter', skills: ['Carpentry'], isAvailable: true, base: { ...CITY_CENTERS.Moratuwa, geohash: geohashForPoint(CITY_CENTERS.Moratuwa.lat, CITY_CENTERS.Moratuwa.lng) } },
  { id: 'demo-kandy-electrician', displayName: 'Unavailable Electrician', skills: ['Electrical'], isAvailable: false, base: { ...CITY_CENTERS.Kandy, geohash: geohashForPoint(CITY_CENTERS.Kandy.lat, CITY_CENTERS.Kandy.lng) } },
] as const;
