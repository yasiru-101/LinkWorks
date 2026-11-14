import assert from 'node:assert/strict';
import { canTransitionJob, validateQuote } from './validation.ts';

// 1. Client can cancel open job
assert.equal(canTransitionJob('open', 'cancelled', 'client'), true);

// 2. Client can assign open job
assert.equal(canTransitionJob('open', 'assigned', 'client'), true);

// 3. Worker cannot assign themselves or cancel a job
assert.equal(canTransitionJob('open', 'assigned', 'assignedWorker'), false);
assert.equal(canTransitionJob('open', 'cancelled', 'assignedWorker'), false);

// 4. Only assigned worker can mark job in_progress
assert.equal(canTransitionJob('assigned', 'in_progress', 'assignedWorker'), true);
assert.equal(canTransitionJob('assigned', 'in_progress', 'client'), false);

// 5. Only client can confirm job completion
assert.equal(canTransitionJob('in_progress', 'completed', 'client'), true);
assert.equal(canTransitionJob('in_progress', 'completed', 'assignedWorker'), false);

// 6. Direct transition from open to completed is prohibited
assert.equal(canTransitionJob('open', 'completed', 'client'), false);

// 7. Validate Quote inputs
assert.equal(validateQuote(5000, 'I have 10 years experience and all plumbing tools ready.'), null);
assert.notEqual(validateQuote(0, 'Valid message but zero price'), null);
assert.notEqual(validateQuote(-500, 'Negative quote is invalid'), null);
assert.notEqual(validateQuote(4500.5, 'Decimal cents quote is invalid; must be integer LKR'), null);
assert.notEqual(validateQuote(5000, 'Too short'), null);

process.stdout.write('Job lifecycle state machine and quote validation tests passed.\n');
