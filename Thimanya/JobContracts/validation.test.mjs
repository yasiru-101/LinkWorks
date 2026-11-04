import assert from 'node:assert/strict';
import { canTransitionJob, validateOpenJob, validateQuote } from './validation.ts';

// Exercise price validation and the actor-dependent state transition contract.
assert.equal(validateOpenJob({ title: 'Fix pipe', description: 'Repair kitchen pipe', categoryId: 'plumbing', budgetMinLkr: 4000, budgetMaxLkr: 3000 }), 'Minimum budget cannot exceed maximum budget.');
assert.equal(validateQuote(3500, 'I can fix this today'), null);
assert.equal(validateQuote(3500.5, 'I can fix this today'), 'Quote must be a positive whole LKR amount.');
assert.equal(canTransitionJob('open', 'assigned', 'client'), true);
assert.equal(canTransitionJob('open', 'assigned', 'assignedWorker'), false);
assert.equal(canTransitionJob('in_progress', 'completed', 'client'), true);
process.stdout.write('Job contract checks passed.\n');
