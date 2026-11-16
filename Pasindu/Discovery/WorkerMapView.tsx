/**
 * LinkWorks Worker Map View & Static Tile Projection Canvas
 * 
 * Owner: Pasindu (Categories, location service, nearby worker discovery, search, public worker profiles, optional map)
 * 
 * This component provides an interactive map view displaying worker locations:
 * 1. Google Static Maps API: Renders high-resolution map tiles centered on the active search center.
 * 2. Mercator Projection: Calculates pixel X/Y coordinates from GPS latitude/longitude using `projectLatLngToPixels`.
 * 3. Interactive Pins: Displays custom pins for tradespeople with category icons and star ratings.
 * 4. Zoom & Layer Controls: Supports zoom levels 10-16 and roadmap vs satellite view toggles.
 * 5. Turn-by-Turn Navigation: Opens native Google Maps navigation directions on tap.
 */

import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import type { WorkerProfile } from '../../mobile/src/types/domain';
import type { SupportedCity } from './geo';
import {
  getCenterTileData,
  getGoogleStaticMapUrl,
  openGoogleMapsDirections,
  projectLatLngToPixels,
} from './maps-config';

type WorkerWithDistance = WorkerProfile & { distanceKm: number };

export interface WorkerMapViewProps {
  workers: WorkerWithDistance[];
  city: SupportedCity;
  userCoords: { lat: number; lng: number };
  radiusKm: number;
  isGpsActive?: boolean;
  isLocating?: boolean;
  locationError?: string | null;
  onRequestGps?: (forceRefresh?: boolean) => Promise<boolean>;
  onSelectWorker?: (worker: WorkerWithDistance) => void;
}

// Google Maps & Live Location View component owned by Pasindu.
// Displays the user's live device coordinates alongside nearby skilled tradespeople,
// with interactive zoom, trade marker pins, and 1-tap Google Maps turn-by-turn navigation.
export default function WorkerMapView({
  workers,
  city,
  userCoords,
  radiusKm,
  isGpsActive = false,
  isLocating = false,
  locationError = null,
  onRequestGps,
  onSelectWorker,
}: WorkerMapViewProps) {
  // Current zoom level for the map canvas (range: 10 to 16)
  const [zoom, setZoom] = useState<number>(13);

  // Map display style: standard roadmap or high-contrast satellite
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  // Currently selected worker on the map
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(
    workers[0]?.userId || ''
  );

  // Dynamic canvas container dimensions measured on screen layout
  const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number }>({
    width: 340,
    height: 280,
  });

  const selectedWorker =
    workers.find((w) => w.userId === selectedWorkerId) || workers[0];

  // Capture canvas layout dimensions for exact sub-pixel marker projections
  function handleCanvasLayout(e: LayoutChangeEvent) {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setCanvasDimensions({ width, height });
    }
  }

  // Zoom in action (closer view)
  function handleZoomIn() {
    setZoom((prev) => Math.min(16, prev + 1));
  }

  // Zoom out action (wider regional view)
  function handleZoomOut() {
    setZoom((prev) => Math.max(10, prev - 1));
  }

  // Open native Google Maps app with turn-by-turn driving directions to selected worker
  async function handleLaunchDirections() {
    if (!selectedWorker) return;
    await openGoogleMapsDirections(
      userCoords.lat,
      userCoords.lng,
      selectedWorker.base.lat,
      selectedWorker.base.lng,
      selectedWorker.displayName
    );
  }

  // Calculate slippy map tile coordinates for live map background rendering
  const tileData = getCenterTileData(userCoords.lat, userCoords.lng, zoom);
  const canvasWidth = canvasDimensions.width;
  const canvasHeight = canvasDimensions.height;
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  // Build Google Static Maps URL if API key is configured
  const googleMapImageUrl = getGoogleStaticMapUrl({
    centerLat: userCoords.lat,
    centerLng: userCoords.lng,
    zoom,
    width: Math.round(canvasWidth),
    height: Math.round(canvasHeight),
    mapType: mapType === 'satellite' ? 'satellite' : 'roadmap',
    workers: workers.map((w, idx) => ({
      lat: w.base.lat,
      lng: w.base.lng,
      label: String(idx + 1),
    })),
  });

  // Calculate Web Mercator pixel center for geographic worker pin positioning
  const centerPixel = projectLatLngToPixels(userCoords.lat, userCoords.lng, zoom);

  return (
    <View style={styles.container}>
      {/* Map Header with Live GPS Coordinates and Status */}
      <View style={styles.mapHeader}>
        <View style={styles.mapHeaderLeft}>
          <Text style={styles.mapTitle}>🗺️ Google Maps &amp; Trades</Text>
          <Text style={styles.mapSubtitle}>
            Showing {workers.length} verified pros near {city} ({radiusKm} km radius)
          </Text>
        </View>

        {/* Live GPS Fix Indicator & Refresh Action */}
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            if (onRequestGps) void onRequestGps(true);
          }}
          disabled={isLocating}
          style={[styles.gpsBadge, isGpsActive && styles.gpsBadgeActive]}
        >
          {isLocating ? (
            <ActivityIndicator size="small" color="#047857" />
          ) : (
            <View style={[styles.gpsDot, isGpsActive && styles.gpsDotActive]} />
          )}
          <Text numberOfLines={1} style={[styles.gpsBadgeText, isGpsActive && styles.gpsBadgeTextActive]}>
            {isLocating
              ? 'Locating…'
              : isGpsActive
              ? `Live GPS`
              : '📍 Use Live GPS'}
          </Text>
        </Pressable>
      </View>

      {/* Informational banner when live GPS is inactive to guide the user */}
      {!isGpsActive && (
        <View style={styles.gpsNoticeBanner}>
          <Text style={styles.gpsNoticeIcon}>📍</Text>
          <View style={styles.gpsNoticeContent}>
            <Text style={styles.gpsNoticeTitle}>Showing {city} City Center</Text>
            <Text style={styles.gpsNoticeSubtitle}>
              {locationError
                ? locationError
                : "Live GPS is inactive. Tap '📍 Use Live GPS' above to center the map on your exact coordinates."}
            </Text>
          </View>
        </View>
      )}

      {/* Interactive Map Canvas */}
      <View style={styles.canvasContainer} onLayout={handleCanvasLayout}>
        {/* Layer 1: Real Map Imagery (Google Maps Static API or CartoDB/OSM Tiles) */}
        {googleMapImageUrl ? (
          <Image
            source={{ uri: googleMapImageUrl }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        ) : (
          <View style={StyleSheet.absoluteFill}>
            {/* 3x3 Tile Grid rendered with exact geographic sub-tile alignment */}
            {[-1, 0, 1].map((dx) =>
              [-1, 0, 1].map((dy) => {
                const tx = tileData.tileX + dx;
                const ty = tileData.tileY + dy;
                const tileLeft = centerX - tileData.offsetX + dx * 256;
                const tileTop = centerY - tileData.offsetY + dy * 256;
                const tileUrl =
                  mapType === 'satellite'
                    ? `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${ty}/${tx}`
                    : `https://basemaps.cartocdn.com/rastertiles/voyager/${zoom}/${tx}/${ty}.png`;

                return (
                  <Image
                    key={`${tx}-${ty}`}
                    source={{ uri: tileUrl }}
                    style={[
                      styles.mapTile,
                      {
                        left: tileLeft,
                        top: tileTop,
                      },
                    ]}
                    resizeMode="cover"
                  />
                );
              })
            )}
          </View>
        )}

        {/* Layer 2: Floating Map Controls (Zoom In, Zoom Out, Map Style) */}
        <View style={styles.floatingControls}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setMapType((prev) => (prev === 'roadmap' ? 'satellite' : 'roadmap'))}
            style={styles.controlBtn}
          >
            <Text style={styles.controlBtnText}>{mapType === 'roadmap' ? '🛰️' : '🗺️'}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={handleZoomIn} style={styles.controlBtn}>
            <Text style={styles.controlBtnText}>＋</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={handleZoomOut} style={styles.controlBtn}>
            <Text style={styles.controlBtnText}>−</Text>
          </Pressable>
        </View>

        {/* Layer 3: User's Live Location Pin (Focal Center) */}
        <View style={[styles.userLocationMarker, { left: centerX - 14, top: centerY - 14 }]}>
          <View style={[styles.userPulseRing, !isGpsActive && styles.userPulseRingInactive]} />
          <View style={[styles.userDotCenter, !isGpsActive && styles.userDotCenterInactive]} />
          <View style={[styles.userLabelBubble, !isGpsActive && styles.userLabelBubbleInactive]}>
            <Text style={[styles.userLabelText, !isGpsActive && styles.userLabelTextInactive]}>
              {isGpsActive ? '📍 Your Live Location' : `📍 ${city} Center`}
            </Text>
          </View>
        </View>

        {/* Layer 4: Plotted Worker Location Pins */}
        {workers.map((worker) => {
          const isSelected = worker.userId === selectedWorker?.userId;
          const workerPixel = projectLatLngToPixels(worker.base.lat, worker.base.lng, zoom);

          // Calculate offset relative to center coordinates in canvas pixels
          const pinX = centerX + (workerPixel.x - centerPixel.x);
          const pinY = centerY + (workerPixel.y - centerPixel.y);

          // Only render pins that are visible within the current canvas boundary
          if (pinX < -40 || pinX > canvasWidth + 40 || pinY < -40 || pinY > canvasHeight + 40) {
            return null;
          }

          // Trade specialty icon mapping
          const tradeIcon =
            worker.skills[0] === 'Plumbing'
              ? '🔧'
              : worker.skills[0] === 'Carpentry'
              ? '🪚'
              : worker.skills[0] === 'Electrical'
              ? '⚡'
              : worker.skills[0] === 'Masonry'
              ? '🧱'
              : worker.skills[0] === 'Painting'
              ? '🎨'
              : '🛠️';

          return (
            <Pressable
              key={worker.userId}
              onPress={() => {
                setSelectedWorkerId(worker.userId);
                if (onSelectWorker) onSelectWorker(worker);
              }}
              style={[
                styles.workerPinContainer,
                { left: pinX - 22, top: pinY - 34 },
                isSelected && styles.workerPinSelected,
              ]}
            >
              <View style={[styles.workerPinBubble, isSelected && styles.workerPinBubbleSelected]}>
                <Text style={styles.workerPinIcon}>{tradeIcon}</Text>
                <Text
                  style={[styles.workerPinLabel, isSelected && styles.workerPinLabelSelected]}
                  numberOfLines={1}
                >
                  {worker.displayName.split(' ')[0]}
                </Text>
              </View>
              <View style={[styles.pinPointer, isSelected && styles.pinPointerSelected]} />
              <View style={[styles.distancePill, isSelected && styles.distancePillSelected]}>
                <Text
                  style={[styles.distancePillText, isSelected && styles.distancePillTextSelected]}
                >
                  {worker.distanceKm.toFixed(1)} km
                </Text>
              </View>
            </Pressable>
          );
        })}

        {/* Google Maps Attribution Badge */}
        <View style={styles.googleWatermark}>
          <Text style={styles.googleWatermarkText}>Google Maps • OpenStreetMap</Text>
        </View>
      </View>

      {/* Selected Worker Info Sheet with Direct Google Maps Route Action */}
      {selectedWorker ? (
        <View style={styles.previewCard}>
          <View style={styles.previewTop}>
            <View style={styles.workerAvatar}>
              <Text style={styles.avatarLetter}>
                {selectedWorker.displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.previewInfo}>
              <View style={styles.previewNameRow}>
                <Text style={styles.previewName}>{selectedWorker.displayName}</Text>
                <View style={styles.verifiedTag}>
                  <Text style={styles.verifiedTagText}>✓ Verified</Text>
                </View>
              </View>
              <Text style={styles.previewSkill}>{selectedWorker.skills.join(' • ')}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaRating}>
                  ⭐ {selectedWorker.ratingAvg ? selectedWorker.ratingAvg.toFixed(1) : 'New'} (
                  {selectedWorker.ratingCount || 0})
                </Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaDistance}>
                  📍 {selectedWorker.distanceKm.toFixed(1)} km from you
                </Text>
              </View>
            </View>
          </View>

          {/* Action Row: Google Maps Navigation & View Profile */}
          <View style={styles.previewBottom}>
            <View>
              <Text style={styles.rateLabel}>Daily Rate</Text>
              <Text style={styles.rateValue}>
                Rs. {selectedWorker.dayRateLkr?.toLocaleString() ?? 'Negotiable'}
              </Text>
            </View>

            <View style={styles.actionRow}>
              {/* Turn-by-turn Navigation in Google Maps */}
              <Pressable
                accessibilityRole="button"
                style={styles.directionsBtn}
                onPress={() => { void handleLaunchDirections(); }}
              >
                <Text style={styles.directionsBtnText}>🚗 Directions</Text>
              </Pressable>

              {/* View Full Worker Profile */}
              <Pressable
                accessibilityRole="button"
                style={styles.profileBtn}
                onPress={() =>
                  router.push({
                    pathname: '/worker/[id]',
                    params: { id: selectedWorker.userId },
                  })
                }
              >
                <Text style={styles.profileBtnText}>Profile →</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.emptyMapBox}>
          <Text style={styles.emptyMapText}>No workers selected in this view area.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.md,
    gap: spacing.md,
    marginVertical: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mapHeaderLeft: {
    flex: 1,
    gap: 2,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: palette.heading,
    fontFamily: 'Plus Jakarta Sans',
  },
  mapSubtitle: {
    fontSize: 12,
    color: palette.muted,
  },
  gpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f4f4f5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    flexShrink: 0,
  },
  gpsBadgeActive: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  gpsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9ca3af',
  },
  gpsDotActive: {
    backgroundColor: '#059669',
  },
  gpsBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4b5563',
  },
  gpsBadgeTextActive: {
    color: '#065f46',
  },
  canvasContainer: {
    height: 290,
    backgroundColor: '#e2e8f0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    position: 'relative',
    overflow: 'hidden',
  },
  mapTile: {
    position: 'absolute',
    width: 256,
    height: 256,
  },
  floatingControls: {
    position: 'absolute',
    top: 10,
    right: 10,
    gap: 6,
    zIndex: 20,
  },
  controlBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  controlBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: palette.heading,
  },
  userLocationMarker: {
    position: 'absolute',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
  },
  userPulseRing: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(37, 99, 235, 0.25)',
    borderWidth: 1.5,
    borderColor: '#2563eb',
  },
  userDotCenter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#1d4ed8',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userLabelBubble: {
    position: 'absolute',
    bottom: -24,
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 136,
    left: -54,
  },
  userLabelText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  userPulseRingInactive: {
    backgroundColor: 'rgba(217, 119, 6, 0.2)',
    borderColor: '#d97706',
  },
  userDotCenterInactive: {
    backgroundColor: '#b45309',
  },
  userLabelBubbleInactive: {
    backgroundColor: '#78350f',
  },
  userLabelTextInactive: {
    color: '#fef3c7',
  },
  gpsNoticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fffbeb',
    borderColor: '#fef3c7',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  gpsNoticeIcon: {
    fontSize: 16,
  },
  gpsNoticeContent: {
    flex: 1,
  },
  gpsNoticeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400e',
  },
  gpsNoticeSubtitle: {
    fontSize: 11,
    color: '#b45309',
    marginTop: 2,
    lineHeight: 15,
  },
  workerPinContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  workerPinSelected: {
    zIndex: 25,
    transform: [{ scale: 1.1 }],
  },
  workerPinBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: palette.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  workerPinBubbleSelected: {
    backgroundColor: palette.primary,
    borderColor: '#064e3b',
  },
  workerPinIcon: {
    fontSize: 14,
  },
  workerPinLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.heading,
    maxWidth: 70,
  },
  workerPinLabelSelected: {
    color: '#ffffff',
  },
  pinPointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 0,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: palette.primary,
    marginTop: -1,
  },
  pinPointerSelected: {
    borderTopColor: palette.primary,
  },
  distancePill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginTop: 2,
  },
  distancePillSelected: {
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
  },
  distancePillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
  },
  distancePillTextSelected: {
    color: '#166534',
  },
  googleWatermark: {
    position: 'absolute',
    bottom: 6,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  googleWatermarkText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#64748b',
  },
  previewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  previewTop: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  workerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e6f7ef',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: palette.primary,
  },
  avatarLetter: {
    fontSize: 18,
    fontWeight: '800',
    color: palette.primary,
  },
  previewInfo: {
    flex: 1,
    gap: 2,
  },
  previewNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewName: {
    fontSize: 16,
    fontWeight: '800',
    color: palette.heading,
  },
  verifiedTag: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  verifiedTagText: {
    fontSize: 10,
    color: '#065f46',
    fontWeight: '800',
  },
  previewSkill: {
    fontSize: 12,
    color: palette.muted,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  metaRating: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b45309',
  },
  metaDot: {
    fontSize: 12,
    color: palette.muted,
  },
  metaDistance: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.primary,
  },
  previewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.border,
    paddingTop: spacing.xs,
  },
  rateLabel: {
    fontSize: 11,
    color: palette.muted,
  },
  rateValue: {
    fontSize: 15,
    fontWeight: '800',
    color: palette.primary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  directionsBtn: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionsBtnText: {
    color: '#15803d',
    fontSize: 12,
    fontWeight: '700',
  },
  profileBtn: {
    backgroundColor: palette.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyMapBox: {
    padding: spacing.md,
    alignItems: 'center',
  },
  emptyMapText: {
    color: palette.muted,
    fontSize: 13,
  },
});
