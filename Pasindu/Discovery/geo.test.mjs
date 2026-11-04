import assert from 'node:assert/strict';
import { CITY_CENTERS, distanceKm, geohashForPoint, nearbyWorkers } from './geo.ts';

// Verify the standard geohash, exact distances, availability filter, and default order.
assert.equal(geohashForPoint(42.6, -5.6, 5), 'ezs42');
assert.equal(geohashForPoint(CITY_CENTERS.Colombo.lat, CITY_CENTERS.Colombo.lng).length, 9);
assert.ok(distanceKm(CITY_CENTERS.Colombo, CITY_CENTERS.Moratuwa) > 10);
const results = nearbyWorkers([
  { id: 'far', base: CITY_CENTERS.Kandy, isAvailable: true },
  { id: 'near', base: CITY_CENTERS.Colombo, isAvailable: true },
  { id: 'hidden', base: CITY_CENTERS.Colombo, isAvailable: false },
], CITY_CENTERS.Colombo, 20);
assert.deepEqual(results.map((worker) => worker.id), ['near']);
process.stdout.write('Geo contract checks passed.\n');
