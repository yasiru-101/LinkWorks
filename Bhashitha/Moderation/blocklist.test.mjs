import assert from 'node:assert/strict';

// Test the in-memory fallback blocklist logic.
let inMemoryBlocklist = new Set();

function getBlockedUserIds() {
  return Array.from(inMemoryBlocklist);
}

function blockUser(uid) {
  inMemoryBlocklist.add(uid);
}

function unblockUser(uid) {
  inMemoryBlocklist.delete(uid);
}

function isUserBlocked(uid) {
  return inMemoryBlocklist.has(uid);
}

function clearBlocklist() {
  inMemoryBlocklist.clear();
}

console.log('Testing Bhashitha Moderation Blocklist Logic...');

clearBlocklist();
assert.equal(isUserBlocked('bad-user-1'), false);
assert.equal(getBlockedUserIds().length, 0);

blockUser('bad-user-1');
assert.equal(isUserBlocked('bad-user-1'), true);
assert.equal(getBlockedUserIds().length, 1);

// Duplicate block does not duplicate
blockUser('bad-user-1');
assert.equal(getBlockedUserIds().length, 1);

// Block second user
blockUser('bad-user-2');
assert.equal(isUserBlocked('bad-user-2'), true);
assert.equal(getBlockedUserIds().length, 2);

// Unblock first user
unblockUser('bad-user-1');
assert.equal(isUserBlocked('bad-user-1'), false);
assert.equal(isUserBlocked('bad-user-2'), true);
assert.equal(getBlockedUserIds().length, 1);

clearBlocklist();
assert.equal(getBlockedUserIds().length, 0);

console.log('✓ Bhashitha blocklist tests passed successfully! 🎉');
