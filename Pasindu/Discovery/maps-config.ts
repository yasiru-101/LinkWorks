/**
 * LinkWorks Map Projection & Google Maps Navigation Engine
 * 
 * Owner: Pasindu (Categories, location service, nearby worker discovery, search, public worker profiles, optional map)
 * 
 * This module powers the spatial projection and navigation features of the LinkWorks marketplace:
 * 1. Web Mercator Projection: Converts physical GPS coordinates into 2D pixel coordinates for exact marker placement.
 * 2. Slippy Map Tile Math: Calculates OpenStreetMap/CartoDB/ArcGIS tile coordinates (X, Y, Zoom) and fractional offsets.
 * 3. Google Static Maps API: Constructs signed static imagery requests when an API key is provided.
 * 4. Deep-Link Navigation: Triggers native Android/iOS turn-by-turn driving directions to workers via Google Maps intent.
 */

import { Linking, Platform } from 'react-native';

// Google Cloud Maps configuration.
// If an API key is provided via EXPO_PUBLIC_GOOGLE_MAPS_API_KEY or pasted here,
// the map will use Google's official Static Maps API.
// Otherwise, it automatically falls back to high-resolution CartoDB/OpenStreetMap tiles.
export const GOOGLE_MAPS_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';

// Geographic projection utility: converts latitude and longitude into Web Mercator pixel coordinates.
// This ensures worker pins and user location pins are positioned with geographic precision on the map.
export function projectLatLngToPixels(lat: number, lng: number, zoom: number): { x: number; y: number } {
  const scale = 256 * Math.pow(2, zoom);
  const x = ((lng + 180) / 360) * scale;
  const latClamped = Math.max(-85.05112878, Math.min(85.05112878, lat));
  const sinLat = Math.sin((latClamped * Math.PI) / 180);
  const y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale;
  return { x, y };
}

// Calculate the slippy tile indices and fractional pixel offsets for the focal center.
export function getCenterTileData(lat: number, lng: number, zoom: number) {
  const n = Math.pow(2, zoom);
  const exactX = ((lng + 180) / 360) * n;
  const latRad = (Math.max(-85.05112878, Math.min(85.05112878, lat)) * Math.PI) / 180;
  const exactY = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;

  const tileX = Math.floor(exactX);
  const tileY = Math.floor(exactY);

  // Fractional pixel offset within the center tile (0 to 256)
  const offsetX = (exactX - tileX) * 256;
  const offsetY = (exactY - tileY) * 256;

  return { tileX, tileY, offsetX, offsetY, zoom };
}

// Construct an official Google Static Maps API URL when an API key is available.
export function getGoogleStaticMapUrl(params: {
  centerLat: number;
  centerLng: number;
  zoom: number;
  width?: number;
  height?: number;
  mapType?: 'roadmap' | 'satellite' | 'terrain' | 'hybrid';
  apiKey?: string;
  workers?: Array<{ lat: number; lng: number; label?: string }>;
}): string {
  const {
    centerLat,
    centerLng,
    zoom,
    width = 640,
    height = 320,
    mapType = 'roadmap',
    apiKey = GOOGLE_MAPS_API_KEY,
    workers = [],
  } = params;

  if (!apiKey) {
    // Return empty string to signal that tile fallback should be rendered
    return '';
  }

  const base = 'https://maps.googleapis.com/maps/api/staticmap';
  const centerParam = `center=${centerLat},${centerLng}`;
  const zoomParam = `zoom=${zoom}`;
  const sizeParam = `size=${width}x${height}`;
  const scaleParam = 'scale=2';
  const typeParam = `maptype=${mapType}`;
  const userMarker = `markers=color:blue%7Clabel:U%7C${centerLat},${centerLng}`;

  const workerMarkers = workers
    .map((w, i) => `markers=color:red%7Clabel:${w.label || i + 1}%7C${w.lat},${w.lng}`)
    .join('&');

  const markersParam = workerMarkers ? `&${workerMarkers}` : '';
  const keyParam = `key=${apiKey}`;

  return `${base}?${centerParam}&${zoomParam}&${sizeParam}&${scaleParam}&${typeParam}&${userMarker}${markersParam}&${keyParam}`;
}

// Launch the native Google Maps mobile application with turn-by-turn driving/walking directions.
// Opens live navigation directly from the user's location to the selected tradesperson.
export async function openGoogleMapsDirections(
  userLat: number,
  userLng: number,
  destLat: number,
  destLng: number,
  destinationName?: string
): Promise<void> {
  const label = encodeURIComponent(destinationName || 'LinkWorks Tradesperson');
  
  // Format standard cross-platform Google Maps direction intent URL
  const googleMapsAppUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destLat},${destLng}&destination_place_id=${label}&travelmode=driving`;
  
  try {
    const supported = await Linking.canOpenURL(googleMapsAppUrl);
    if (supported || Platform.OS !== 'web') {
      await Linking.openURL(googleMapsAppUrl);
    } else {
      // Fallback web query
      await Linking.openURL(`https://maps.google.com/?q=${destLat},${destLng}`);
    }
  } catch (err) {
    console.warn('[LinkWorks Maps] Could not open Google Maps navigation:', err);
    await Linking.openURL(`https://maps.google.com/?q=${destLat},${destLng}`);
  }
}
