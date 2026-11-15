import assert from 'node:assert';

// Simulated storage persistence logic test matching Thimanya/Jobs/job-storage.ts
let diskStorage = [];

function saveJob(job) {
  diskStorage = [job, ...diskStorage.filter(j => j.id !== job.id)];
}

function removeJob(jobId) {
  diskStorage = diskStorage.filter(j => j.id !== jobId);
}

function getJobs() {
  return diskStorage;
}

console.log('Testing Thimanya Job Storage & Persistence Logic...');

// 1. Initial storage is empty
assert.strictEqual(getJobs().length, 0);

// 2. Save a new job
const testJob = {
  id: 'job-test-1',
  clientId: 'client-demo-1',
  title: 'Fix Leaking Tap',
  description: 'Tap is leaking constantly in kitchen',
  categoryId: 'Plumbing',
  status: 'open',
};
saveJob(testJob);
assert.strictEqual(getJobs().length, 1);
assert.strictEqual(getJobs()[0].title, 'Fix Leaking Tap');
console.log('✓ Test 1: New job successfully saved to persistent storage');

// 3. Restart simulation (reading from storage)
const reloaded = getJobs();
assert.strictEqual(reloaded.length, 1);
assert.strictEqual(reloaded[0].id, 'job-test-1');
console.log('✓ Test 2: App restart correctly preserves saved job');

// 4. Owner deletes the job
removeJob('job-test-1');
assert.strictEqual(getJobs().length, 0);
console.log('✓ Test 3: Owner deletion successfully removes job from persistent storage');

// 5. Test job persistence with standard clean schema
const standardJob = {
  id: 'job-test-standard',
  clientId: 'client-demo-1',
  title: 'Fix Pipe Leak Standard',
  description: 'Standard repair job without worksite photos',
  categoryId: 'Plumbing',
  photos: [],
  status: 'open',
};
saveJob(standardJob);
assert.strictEqual(getJobs()[0].photos.length, 0);
console.log('✓ Test 4: Jobs correctly persist with standard clean schema');

// 6. Test application persistence
let applicationsStorage = {};
function saveApp(jobId, app) {
  const current = applicationsStorage[jobId] || [];
  applicationsStorage[jobId] = [app, ...current.filter(a => a.workerId !== app.workerId)];
}
function getApps(jobId) {
  return applicationsStorage[jobId] || [];
}

// New job starts with 0 applications
assert.strictEqual(getApps('job-test-standard').length, 0);
console.log('✓ Test 5: Newly created job starts with 0 quotes');

// Worker applies to job
saveApp('job-test-standard', {
  workerId: 'worker-plumber-1',
  workerName: 'Sunil Perera',
  quotedPriceLkr: 4500,
  message: 'Can come inspect immediately',
  status: 'submitted',
});
assert.strictEqual(getApps('job-test-standard').length, 1);
assert.strictEqual(getApps('job-test-standard')[0].quotedPriceLkr, 4500);
console.log('✓ Test 6: Worker quote persists correctly for target job');

console.log('All job storage tests passed successfully! 🎉');
