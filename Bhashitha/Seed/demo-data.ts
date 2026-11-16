/**
 * LinkWorks Fast In-Memory Demo Workers
 * 
 * Owner: Bhashitha (Design system, navigation, reviews, moderation, seed data, integration and QA)
 * 
 * Compact static worker records used for unit test mocking and empty-state fallbacks.
 */

import { CITY_CENTERS, geohashForPoint } from '../../Pasindu/Discovery/geo';

// Keep fictional nearby workers ready for query and empty-state testing.
export const DEMO_WORKERS = [
  { id: 'demo-colombo-plumber', displayName: 'Demo Plumber', skills: ['Plumbing'], isAvailable: true, base: { ...CITY_CENTERS.Colombo, geohash: geohashForPoint(CITY_CENTERS.Colombo.lat, CITY_CENTERS.Colombo.lng) } },
  { id: 'demo-kelaniya-carpenter', displayName: 'Demo Carpenter', skills: ['Carpentry'], isAvailable: true, base: { ...CITY_CENTERS.Kelaniya, geohash: geohashForPoint(CITY_CENTERS.Kelaniya.lat, CITY_CENTERS.Kelaniya.lng) } },
  { id: 'demo-kandy-electrician', displayName: 'Unavailable Electrician', skills: ['Electrical'], isAvailable: false, base: { ...CITY_CENTERS.Kandy, geohash: geohashForPoint(CITY_CENTERS.Kandy.lat, CITY_CENTERS.Kandy.lng) } },
] as const;
