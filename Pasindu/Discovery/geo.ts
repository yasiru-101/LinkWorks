// These city centers provide an explicit fallback when foreground location is unavailable.
export const CITY_CENTERS = {
  Colombo: { lat: 6.9271, lng: 79.8612 },
  Gampaha: { lat: 7.0917, lng: 79.9997 },
  Moratuwa: { lat: 6.773, lng: 79.8816 },
  Negombo: { lat: 7.2083, lng: 79.8358 },
  Kandy: { lat: 7.2906, lng: 80.6337 },
  Galle: { lat: 6.0535, lng: 80.221 },
} as const;

export type SupportedCity = keyof typeof CITY_CENTERS;

// Maximum distance (km) from any supported hub to consider a user inside active trade coverage.
export const MAX_SERVICE_DISTANCE_KM = 45;

const GEOHASH_ALPHABET = '0123456789bcdefghjkmnpqrstuvwxyz';

// Encode a point with the standard base-32 geohash so Firestore can index it later.
export function geohashForPoint(lat: number, lng: number, precision = 9): string {
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw new Error('Invalid coordinates.');
  }
  let latitude = [-90, 90];
  let longitude = [-180, 180];
  let bits = 0;
  let value = 0;
  let hash = '';
  let useLongitude = true;

  while (hash.length < precision) {
    const range = useLongitude ? longitude : latitude;
    const coordinate = useLongitude ? lng : lat;
    const midpoint = (range[0] + range[1]) / 2;
    value = (value << 1) | (coordinate >= midpoint ? 1 : 0);
    if (coordinate >= midpoint) range[0] = midpoint;
    else range[1] = midpoint;
    useLongitude = !useLongitude;
    bits += 1;
    if (bits === 5) {
      hash += GEOHASH_ALPHABET[value];
      bits = 0;
      value = 0;
    }
  }
  return hash;
}

// Calculate exact distance after a geohash query has produced candidate documents.
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const deltaLat = radians(b.lat - a.lat);
  const deltaLng = radians(b.lng - a.lng);
  const arc = Math.sin(deltaLat / 2) ** 2 +
    Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) * Math.sin(deltaLng / 2) ** 2;
  return 6371.0088 * 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1 - arc));
}

// Find the closest supported Sri Lankan trade hub for a given GPS coordinate fix.
export function findNearestSupportedCity(coords: { lat: number; lng: number }): {
  city: SupportedCity;
  distanceKm: number;
  inCoverage: boolean;
} {
  const cities = Object.keys(CITY_CENTERS) as SupportedCity[];
  let nearestCity: SupportedCity = 'Colombo';
  let minDistance = Infinity;

  for (const city of cities) {
    const cityCoords = CITY_CENTERS[city];
    const dist = distanceKm(coords, cityCoords);
    if (dist < minDistance) {
      minDistance = dist;
      nearestCity = city;
    }
  }

  return {
    city: nearestCity,
    distanceKm: parseFloat(minDistance.toFixed(1)),
    inCoverage: minDistance <= MAX_SERVICE_DISTANCE_KM,
  };
}

// Apply the agreed availability and radius rules to worker candidates from a query.
export function nearbyWorkers<T extends { base: { lat: number; lng: number }; isAvailable: boolean }>(
  candidates: T[],
  center: { lat: number; lng: number },
  radiusKm: number,
): Array<T & { distanceKm: number }> {
  return candidates
    .filter((candidate) => candidate.isAvailable)
    .map((candidate) => ({ ...candidate, distanceKm: distanceKm(center, candidate.base) }))
    .filter((candidate) => candidate.distanceKm <= radiusKm)
    .sort((first, second) => first.distanceKm - second.distanceKm);
}
