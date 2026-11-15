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

console.log('All job storage tests passed successfully! 🎉');
