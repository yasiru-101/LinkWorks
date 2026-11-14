import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// Resolve CJS functions module from mobile/functions/src/index.js.
const functionsPath = new URL('../../mobile/functions/src/index.js', import.meta.url);
const require = createRequire(fileURLToPath(import.meta.url));
const {
  calculateRatingStats,
  buildJobAssignedPayload,
  buildApplicationCreatedPayload,
  buildChatMessagePayload,
} = require(fileURLToPath(functionsPath));

console.log('Testing Chanuli Cloud Functions & Calculation Utilities...');

// Test 1: Worker rating calculation with empty reviews.
{
  const stats = calculateRatingStats([]);
  assert.equal(stats.ratingAvg, 0, 'Empty reviews should yield 0 average rating');
  assert.equal(stats.ratingCount, 0, 'Empty reviews should yield 0 count');
  console.log('✓ Test 1: Empty reviews handled correctly');
}

// Test 2: Worker rating calculation with single review.
{
  const stats = calculateRatingStats([{ stars: 5 }]);
  assert.equal(stats.ratingAvg, 5);
  assert.equal(stats.ratingCount, 1);
  console.log('✓ Test 2: Single review calculated correctly');
}

// Test 3: Worker rating calculation with multiple reviews and rounding.
{
  // 5 + 4 + 4 = 13 / 3 = 4.3333333... -> 4.33
  const stats = calculateRatingStats([{ stars: 5 }, { stars: 4 }, { stars: 4 }]);
  assert.equal(stats.ratingAvg, 4.33, 'Average should be rounded to 2 decimal places');
  assert.equal(stats.ratingCount, 3);
  console.log('✓ Test 3: Average rating rounded to 2 decimal places');
}

// Test 4: Job Assigned push payload construction.
{
  const payload = buildJobAssignedPayload('fcm-token-worker-1', 'job-123', 'Repair Kitchen Sink');
  assert.equal(payload.token, 'fcm-token-worker-1');
  assert.equal(payload.notification.title, 'Quote Accepted! 🎉');
  assert.match(payload.notification.body, /Repair Kitchen Sink/);
  assert.equal(payload.data.jobId, 'job-123');
  assert.equal(payload.data.type, 'JOB_ASSIGNED');
  console.log('✓ Test 4: Job assigned FCM payload matches schema');
}

// Test 5: New Application / Quote push payload construction.
{
  const payload = buildApplicationCreatedPayload(
    'fcm-token-client-1',
    'job-456',
    'Roof Timber Polishing',
    'Sunil Shantha',
    4500
  );
  assert.equal(payload.token, 'fcm-token-client-1');
  assert.equal(payload.notification.title, 'New Quote Received 💬');
  assert.match(payload.notification.body, /Sunil Shantha/);
  assert.match(payload.notification.body, /4,500/);
  assert.equal(payload.data.jobId, 'job-456');
  assert.equal(payload.data.type, 'NEW_APPLICATION');
  console.log('✓ Test 5: Application created FCM payload matches schema');
}

// Test 6: Chat Message push payload with text truncation.
{
  const longMessage = 'A'.repeat(120);
  const payload = buildChatMessagePayload('fcm-token-user-2', 'job-789', 'Pradeep', longMessage);
  assert.equal(payload.token, 'fcm-token-user-2');
  assert.equal(payload.notification.title, 'New message from Pradeep');
  assert.ok(payload.notification.body.endsWith('...'), 'Long message body should be truncated');
  assert.ok(payload.notification.body.length <= 80, 'Body should not exceed 80 characters');
  assert.equal(payload.data.jobId, 'job-789');
  assert.equal(payload.data.type, 'NEW_MESSAGE');
  console.log('✓ Test 6: Chat message FCM payload matches schema and truncates');
}

console.log('All Chanuli Cloud Functions tests passed successfully! 🎉');
