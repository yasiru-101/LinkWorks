/**
 * Location & Coverage Boundary Test Suite
 * 
 * Owner: Pasindu (Categories, location service, nearby worker discovery, search, public worker profiles, optional map)
 * 
 * Tests the geographic coverage algorithms and city mapping:
 * 1. Verifies exact city center points map to themselves with 0km error.
 * 2. Verifies suburban coordinates map accurately to their closest hub (Dehiwala -> Colombo, Ratmalana -> Moratuwa).
 * 3. Validates out-of-coverage boundary conditions for distant cities (e.g. Jaffna, Nuwara Eliya).
 */

import assert from 'node:assert/strict';
import { CITY_CENTERS, distanceKm, findNearestSupportedCity, MAX_SERVICE_DISTANCE_KM } from './geo.ts';

console.log('Testing Pasindu Fused Location & Coverage Algorithms...');

// Test 1: Exact city center matches itself with 0 km.
{
  const colombo = findNearestSupportedCity(CITY_CENTERS.Colombo);
  assert.equal(colombo.city, 'Colombo');
  assert.equal(colombo.distanceKm, 0);
  assert.equal(colombo.inCoverage, true);
  console.log('✓ Test 1: Exact city center returns 0 km in-coverage match');
}

// Test 2: Dehiwala coordinates map closest to Colombo.
{
  // Dehiwala-Mount Lavinia
  const dehiwala = findNearestSupportedCity({ lat: 6.8511, lng: 79.8659 });
  assert.equal(dehiwala.city, 'Colombo');
  assert.ok(dehiwala.distanceKm < 15);
  assert.equal(dehiwala.inCoverage, true);
  console.log(`✓ Test 2: Dehiwala maps to Colombo (${dehiwala.distanceKm} km away, in-coverage)`);
}

// Test 3: Ratmalana coordinates map closest to Moratuwa.
{
  // Ratmalana
  const ratmalana = findNearestSupportedCity({ lat: 6.8208, lng: 79.8828 });
  assert.equal(ratmalana.city, 'Moratuwa');
  assert.ok(ratmalana.distanceKm < 10);
  assert.equal(ratmalana.inCoverage, true);
  console.log(`✓ Test 3: Ratmalana maps to Moratuwa (${ratmalana.distanceKm} km away, in-coverage)`);
}

// Test 4: Peradeniya coordinates map closest to Kandy.
{
  // Peradeniya
  const peradeniya = findNearestSupportedCity({ lat: 7.26, lng: 80.598 });
  assert.equal(peradeniya.city, 'Kandy');
  assert.ok(peradeniya.distanceKm < 10);
  assert.equal(peradeniya.inCoverage, true);
  console.log(`✓ Test 4: Peradeniya maps to Kandy (${peradeniya.distanceKm} km away, in-coverage)`);
}

// Test 5: Out of coverage area (Jaffna) correctly triggers out-of-coverage.
{
  // Jaffna Northern Province
  const jaffna = findNearestSupportedCity({ lat: 9.6615, lng: 80.0255 });
  assert.ok(jaffna.distanceKm > MAX_SERVICE_DISTANCE_KM);
  assert.equal(jaffna.inCoverage, false, 'Jaffna should not be inside active coverage');
  console.log(`✓ Test 5: Jaffna identified as out-of-coverage (${jaffna.distanceKm} km away)`);
}

// Test 6: Out of coverage area (Trincomalee) correctly triggers out-of-coverage.
{
  // Trincomalee Eastern Province
  const trinco = findNearestSupportedCity({ lat: 8.5874, lng: 81.2152 });
  assert.ok(trinco.distanceKm > MAX_SERVICE_DISTANCE_KM);
  assert.equal(trinco.inCoverage, false, 'Trincomalee should not be inside active coverage');
  console.log(`✓ Test 6: Trincomalee identified as out-of-coverage (${trinco.distanceKm} km away)`);
}

// Test 7: Web Mercator projection produces valid pixel offsets for Colombo & nearby trades.
{
  function project(lat, lng, zoom) {
    const scale = 256 * Math.pow(2, zoom);
    const x = ((lng + 180) / 360) * scale;
    const sinLat = Math.sin((lat * Math.PI) / 180);
    const y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale;
    return { x, y };
  }
  const user = project(6.9271, 79.8612, 13);
  const worker = project(6.9350, 79.8700, 13);
  const dx = worker.x - user.x;
  const dy = worker.y - user.y;
  assert.ok(Math.abs(dx) > 0, 'Horizontal offset should be non-zero');
  assert.ok(Math.abs(dy) > 0, 'Vertical offset should be non-zero');
  console.log('✓ Test 7: Web Mercator sub-pixel projection correctly scales worker offsets');
}

// Test 8: Slippy map tile calculations return valid integer coordinates for Sri Lanka.
{
  const n = Math.pow(2, 13);
  const lng = 79.8612;
  const lat = 6.9271;
  const tileX = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const tileY = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);
  assert.equal(tileX, 5913);
  assert.equal(tileY, 3937);
  console.log('✓ Test 8: Map tile calculation aligns with standard global tile indexing');
}

console.log('All Fused Location & coverage tests passed! 🎉');
