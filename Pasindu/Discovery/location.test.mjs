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

console.log('All Fused Location & coverage tests passed! 🎉');
