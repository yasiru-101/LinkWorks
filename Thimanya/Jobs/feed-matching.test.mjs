import assert from 'node:assert/strict';
import { CITY_CENTERS, distanceKm, geohashForPoint } from '../../Pasindu/Discovery/geo.ts';

// Test harness simulating worker feed matching algorithm.
function matchWorkerJobs(workerSkills, centerCoords, radiusKm, candidateJobs) {
  const normalizedSkills = workerSkills.map((s) => s.toLowerCase());
  return candidateJobs
    .filter((job) => {
      if (job.status !== 'open') return false;
      if (!normalizedSkills.length) return true;
      return normalizedSkills.includes(job.categoryId.toLowerCase());
    })
    .map((job) => ({
      ...job,
      distanceKm: distanceKm(centerCoords, job.geo),
    }))
    .filter((job) => job.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

const sampleJobs = [
  {
    id: 'job-1',
    title: 'Fix Colombo sink',
    categoryId: 'Plumbing',
    status: 'open',
    geo: { ...CITY_CENTERS.Colombo, geohash: geohashForPoint(CITY_CENTERS.Colombo.lat, CITY_CENTERS.Colombo.lng) },
  },
  {
    id: 'job-2',
    title: 'Moratuwa table repair',
    categoryId: 'Carpentry',
    status: 'open',
    geo: { ...CITY_CENTERS.Moratuwa, geohash: geohashForPoint(CITY_CENTERS.Moratuwa.lat, CITY_CENTERS.Moratuwa.lng) },
  },
  {
    id: 'job-3',
    title: 'Kandy bathroom plumbing',
    categoryId: 'Plumbing',
    status: 'open',
    geo: { ...CITY_CENTERS.Kandy, geohash: geohashForPoint(CITY_CENTERS.Kandy.lat, CITY_CENTERS.Kandy.lng) },
  },
  {
    id: 'job-4',
    title: 'Colombo completed plumbing',
    categoryId: 'Plumbing',
    status: 'completed',
    geo: { ...CITY_CENTERS.Colombo, geohash: geohashForPoint(CITY_CENTERS.Colombo.lat, CITY_CENTERS.Colombo.lng) },
  },
];

// Test 1: Worker in Colombo with Plumbing skill within 20km
const colomboCenter = CITY_CENTERS.Colombo;
const resultsColombo = matchWorkerJobs(['Plumbing'], colomboCenter, 20, sampleJobs);

// Should find job-1 (Colombo open plumbing).
// Should exclude job-2 (Carpentry), job-3 (Kandy > 90km), and job-4 (already completed).
assert.equal(resultsColombo.length, 1);
assert.equal(resultsColombo[0].id, 'job-1');
assert.ok(resultsColombo[0].distanceKm < 1.0);

// Test 2: Multi-skilled worker in Colombo with Plumbing & Carpentry within 25km
const resultsMulti = matchWorkerJobs(['Plumbing', 'Carpentry'], colomboCenter, 25, sampleJobs);
// Should match job-1 (Colombo, ~0km) and job-2 (Moratuwa, ~17km) in distance order.
assert.equal(resultsMulti.length, 2);
assert.equal(resultsMulti[0].id, 'job-1');
assert.equal(resultsMulti[1].id, 'job-2');
assert.ok(resultsMulti[0].distanceKm < resultsMulti[1].distanceKm);

// Test 3: Radius too tight (e.g. 5km) from Colombo should exclude Moratuwa (~17km)
const resultsTight = matchWorkerJobs(['Carpentry'], colomboCenter, 5, sampleJobs);
assert.equal(resultsTight.length, 0);

process.stdout.write('Worker feed matching unit checks passed.\n');
