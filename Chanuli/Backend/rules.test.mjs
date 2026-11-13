import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const appPackage = new URL('../../mobile/package.json', import.meta.url);
const appRequire = createRequire(fileURLToPath(appPackage));
const { initializeTestEnvironment, assertFails, assertSucceeds } = appRequire('@firebase/rules-unit-testing');
const { collection, doc, getDoc, getDocs, orderBy, query, setDoc, startAt, endAt, updateDoc, serverTimestamp, where } = appRequire('firebase/firestore');
const rules = readFileSync(new URL('../../mobile/firestore.rules', import.meta.url), 'utf8');

// Run against the isolated demo project started by firebase emulators:exec.
const environment = await initializeTestEnvironment({
  projectId: 'demo-linkworks-rules',
  firestore: { host: '127.0.0.1', port: 8080, rules },
});

const owner = environment.authenticatedContext('owner', { phone_number: '+94770000001' }).firestore();
const worker = environment.authenticatedContext('worker', { phone_number: '+94770000002' }).firestore();
const stranger = environment.authenticatedContext('stranger', { phone_number: '+94770000003' }).firestore();
const guest = environment.unauthenticatedContext().firestore();

// Build account documents exactly as the Android profile form does.
function account(phone, isClient, isWorker) {
  return { name: 'Fictional User', city: 'Colombo', phone, isClient, isWorker,
    activeRole: isClient ? 'client' : 'worker', createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
}

try {
  await environment.clearFirestore();
  await assertSucceeds(setDoc(doc(owner, 'users/owner'), account('+94770000001', true, false)));
  await assertSucceeds(setDoc(doc(worker, 'users/worker'), account('+94770000002', false, true)));
  await assertSucceeds(getDoc(doc(owner, 'users/owner')));
  await assertFails(getDoc(doc(stranger, 'users/owner')));
  await assertFails(getDoc(doc(guest, 'users/owner')));
  await assertFails(setDoc(doc(stranger, 'users/owner'), account('+94770000003', true, false)));
  await assertFails(updateDoc(doc(owner, 'users/owner'), { phone: '+94770000099' }));

  // Public worker data is readable, but only the worker edits safe fields and never counters.
  const workerRef = doc(worker, 'workerProfiles/worker');
  const workerData = { userId: 'worker', displayName: 'Fictional Worker', city: 'Colombo',
    skills: ['Plumbing'], bio: 'Fictional plumbing specialist', experienceYears: 3,
    dayRateLkr: 5000, base: { lat: 6.9271, lng: 79.8612, geohash: 'tc0m0m0m0' },
    serviceRadiusKm: 10, portfolio: [], isAvailable: true,
    ratingAvg: 0, ratingCount: 0, jobsCompleted: 0,
    createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  await assertSucceeds(setDoc(workerRef, workerData));
  await assertSucceeds(getDoc(doc(owner, 'workerProfiles/worker')));
  await assertSucceeds(updateDoc(workerRef, { bio: 'Fictional worker with experience', updatedAt: serverTimestamp() }));
  await assertFails(updateDoc(workerRef, { ratingAvg: 5, updatedAt: serverTimestamp() }));
  await assertFails(updateDoc(doc(stranger, 'workerProfiles/worker'), { bio: 'Changed by stranger', updatedAt: serverTimestamp() }));

  // A signed-in client can query the public projection by geohash without seeing account data.
  const nearby = query(collection(owner, 'workerProfiles'), orderBy('base.geohash'), startAt('tc0'), endAt('tc0\uf8ff'));
  const nearbyResult = await assertSucceeds(getDocs(nearby));
  assert.deepEqual(nearbyResult.docs.map((candidate) => candidate.id), ['worker']);
  assert.equal(nearbyResult.docs[0].data().phone, undefined);

  // A client may post and edit an open job, but assignment and counters require trusted code.
  const jobRef = doc(owner, 'jobs/job-one');
  const jobData = { clientId: 'owner', title: 'Fix a leaking pipe', description: 'Repair the kitchen pipe safely',
    categoryId: 'plumbing', photos: [], budgetMinLkr: 3000, budgetMaxLkr: 5000,
    geo: { lat: 6.9271, lng: 79.8612, geohash: 'tc0m0m0m0' }, addressText: 'Colombo city',
    status: 'open', applicationCount: 0, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  await assertSucceeds(setDoc(jobRef, jobData));
  await assertSucceeds(updateDoc(jobRef, { title: 'Fix the leaking pipe', updatedAt: serverTimestamp() }));
  await assertFails(updateDoc(jobRef, { assignedWorkerId: 'worker', status: 'assigned', updatedAt: serverTimestamp() }));
  await assertFails(updateDoc(doc(worker, 'jobs/job-one'), { status: 'assigned', updatedAt: serverTimestamp() }));
  await assertFails(updateDoc(jobRef, { applicationCount: 99, updatedAt: serverTimestamp() }));
  await assertFails(getDoc(doc(guest, 'jobs/job-one')));

  // Phase 2: A worker can query open jobs for their feed.
  const openJobsQuery = query(collection(worker, 'jobs'), where('status', '==', 'open'));
  const openJobs = await assertSucceeds(getDocs(openJobsQuery));
  assert.equal(openJobs.docs.length, 1);
  assert.equal(openJobs.docs[0].id, 'job-one');

  // Phase 2: A client can query their own jobs for My Jobs.
  const myJobsQuery = query(collection(owner, 'jobs'), where('clientId', '==', 'owner'));
  const myJobs = await assertSucceeds(getDocs(myJobsQuery));
  assert.equal(myJobs.docs.length, 1);

  // Phase 2: A client can cancel their own open job.
  await assertSucceeds(updateDoc(jobRef, { status: 'cancelled', updatedAt: serverTimestamp() }));

  // An eligible worker submits one quote but cannot accept it themselves.
  const jobTwoRef = doc(owner, 'jobs/job-two');
  const jobTwoData = { clientId: 'owner', title: 'Second open job', description: 'Repair secondary pipe',
    categoryId: 'plumbing', photos: [], budgetMinLkr: 3000, budgetMaxLkr: 5000,
    geo: { lat: 6.9271, lng: 79.8612, geohash: 'tc0m0m0m0' }, addressText: 'Colombo city',
    status: 'open', applicationCount: 0, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  await assertSucceeds(setDoc(jobTwoRef, jobTwoData));

  const application = { workerId: 'worker', message: 'I can fix this pipe today', quotedPriceLkr: 4200,
    status: 'submitted', createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  await assertSucceeds(setDoc(doc(worker, 'jobs/job-two/applications/worker'), application));
  await assertFails(updateDoc(doc(worker, 'jobs/job-two/applications/worker'), { status: 'accepted' }));
  await assertFails(getDoc(doc(stranger, 'jobs/job-two/applications/worker')));

  // Phase 3: Real-time chat security
  // Owner and worker are assigned participants in chat-job-two
  const chatRef = doc(owner, 'chats/job-two');
  const chatData = {
    jobId: 'job-two',
    jobTitle: 'Second open job',
    jobStatus: 'assigned',
    participants: ['owner', 'worker'],
    lastMessage: 'Job assigned!',
    lastAt: serverTimestamp(),
  };
  await assertSucceeds(setDoc(chatRef, chatData));
  await assertSucceeds(getDoc(doc(owner, 'chats/job-two')));
  await assertSucceeds(getDoc(doc(worker, 'chats/job-two')));
  // Stranger denied reading chat
  await assertFails(getDoc(doc(stranger, 'chats/job-two')));

  // Messages in chat: participant can send and read
  const msgRef = doc(owner, 'chats/job-two/messages/msg-1');
  await assertSucceeds(setDoc(msgRef, {
    senderId: 'owner',
    text: 'Hello, when can you start the work?',
    createdAt: serverTimestamp(),
  }));
  await assertSucceeds(getDoc(doc(worker, 'chats/job-two/messages/msg-1')));
  // Stranger denied reading message
  await assertFails(getDoc(doc(stranger, 'chats/job-two/messages/msg-1')));
  // Stranger denied sending message
  await assertFails(setDoc(doc(stranger, 'chats/job-two/messages/msg-stranger'), {
    senderId: 'stranger',
    text: 'Intrusion attempt',
    createdAt: serverTimestamp(),
  }));

  // Phase 3: Reviews security
  // Review before job completion must fail (job-two is still open)
  const prematureReview = {
    jobId: 'job-two',
    raterId: 'owner',
    rateeId: 'worker',
    stars: 5,
    text: 'Great work even before completion',
    createdAt: serverTimestamp(),
  };
  await assertFails(setDoc(doc(owner, 'reviews/job-two_owner'), prematureReview));

  // Set up completed job via admin context
  await environment.withSecurityRulesDisabled(async (context) => {
    const adminDb = context.firestore();
    await setDoc(doc(adminDb, 'jobs/job-completed'), {
      clientId: 'owner',
      title: 'Completed bathroom plumbing',
      description: 'Fully finished job',
      categoryId: 'plumbing',
      photos: [],
      budgetMinLkr: 5000,
      budgetMaxLkr: 8000,
      geo: { lat: 6.9271, lng: 79.8612, geohash: 'tc0m0m0m0' },
      addressText: 'Colombo',
      status: 'completed',
      assignedWorkerId: 'worker',
      acceptedPriceLkr: 6500,
      applicationCount: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  // Client creates review for completed job -> succeeds
  const validReview = {
    jobId: 'job-completed',
    raterId: 'owner',
    rateeId: 'worker',
    stars: 5,
    text: 'Prompt, neat, and highly skilled work.',
    createdAt: serverTimestamp(),
  };
  await assertSucceeds(setDoc(doc(owner, 'reviews/job-completed_owner'), validReview));

  // Stranger denied reviewing completed job
  const strangerReview = {
    jobId: 'job-completed',
    raterId: 'stranger',
    rateeId: 'worker',
    stars: 1,
    text: 'Fake negative review from a stranger',
    createdAt: serverTimestamp(),
  };
  await assertFails(setDoc(doc(stranger, 'reviews/job-completed_stranger'), strangerReview));

  // Duplicate review from same rater with spoofed reviewId blocked
  await assertFails(setDoc(doc(owner, 'reviews/job-completed_owner_2'), validReview));

  // Phase 3: Moderation reports
  const reportData = {
    reporterId: 'owner',
    targetId: 'worker',
    targetType: 'user',
    reason: 'Unfair pricing or fraudulent quote',
    createdAt: serverTimestamp(),
  };
  await assertSucceeds(setDoc(doc(owner, 'reports/report-1'), reportData));
  await assertFails(setDoc(doc(guest, 'reports/report-guest'), reportData));

  assert.ok(true);
  process.stdout.write('Firestore owner, query, chat, review, report, and denied-operation rules passed.\n');
} finally {
  await environment.cleanup();
}
