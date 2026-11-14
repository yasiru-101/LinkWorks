// In-memory set of blocked user IDs for the active session, with optional localStorage fallback.
const inMemoryBlocklist: Set<string> = new Set();

const STORAGE_KEY = '@linkworks_blocked_users';

// Helper to safely read from localStorage if present (e.g. web preview).
function readPersistedBlocklist(): string[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    }
  } catch {
    // Ignore storage read failure
  }
  return Array.from(inMemoryBlocklist);
}

// Helper to safely write to localStorage if present.
function writePersistedBlocklist(ids: string[]): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    }
  } catch {
    // Ignore storage write failure
  }
}

// Retrieve all user IDs blocked by the current user.
export async function getBlockedUserIds(): Promise<string[]> {
  const persisted = readPersistedBlocklist();
  for (const id of persisted) {
    inMemoryBlocklist.add(id);
  }
  return Array.from(inMemoryBlocklist);
}

// Add a target user ID to the local blocklist.
export async function blockUser(targetUid: string): Promise<void> {
  if (!targetUid) return;
  inMemoryBlocklist.add(targetUid);
  writePersistedBlocklist(Array.from(inMemoryBlocklist));
}

// Remove a user ID from the local blocklist.
export async function unblockUser(targetUid: string): Promise<void> {
  if (!targetUid) return;
  inMemoryBlocklist.delete(targetUid);
  writePersistedBlocklist(Array.from(inMemoryBlocklist));
}

// Fast check to see if a specific user is blocked.
export async function isUserBlocked(targetUid: string): Promise<boolean> {
  if (!targetUid) return false;
  return inMemoryBlocklist.has(targetUid);
}

// Clear all blocked users (used for testing or resetting session).
export async function clearBlocklist(): Promise<void> {
  inMemoryBlocklist.clear();
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore storage cleanup failure
  }
}
