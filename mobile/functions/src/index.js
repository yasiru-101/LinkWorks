const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');
const { onDocumentCreated, onDocumentUpdated } = require('firebase-functions/v2/firestore');

// Initialize Firebase Admin app with default credentials for Cloud Functions.
initializeApp();

// Pure computation helper: calculates average rating and total count from review list.
function calculateRatingStats(reviews) {
  if (!reviews || reviews.length === 0) {
    return { ratingAvg: 0, ratingCount: 0 };
  }
  const sum = reviews.reduce((acc, r) => acc + (Number(r.stars) || 0), 0);
  const avg = parseFloat((sum / reviews.length).toFixed(2));
  return {
    ratingAvg: avg,
    ratingCount: reviews.length,
  };
}

// Pure notification payload builder for accepted quotes / assigned jobs.
function buildJobAssignedPayload(fcmToken, jobId, jobTitle) {
  return {
    token: fcmToken,
    notification: {
      title: 'Quote Accepted! 🎉',
      body: `You were hired for "${jobTitle}". Tap to chat and start work.`,
    },
    data: {
      jobId: String(jobId),
      type: 'JOB_ASSIGNED',
    },
  };
}

// Pure notification payload builder for new bids / applications.
function buildApplicationCreatedPayload(fcmToken, jobId, jobTitle, workerName, quotedPriceLkr) {
  const priceText = quotedPriceLkr ? `Rs. ${quotedPriceLkr.toLocaleString()}` : 'a quote';
  return {
    token: fcmToken,
    notification: {
      title: 'New Quote Received 💬',
      body: `${workerName || 'A skilled worker'} submitted ${priceText} for "${jobTitle}".`,
    },
    data: {
      jobId: String(jobId),
      type: 'NEW_APPLICATION',
    },
  };
}

// Pure notification payload builder for real-time chat messages.
function buildChatMessagePayload(fcmToken, jobId, senderName, text) {
  return {
    token: fcmToken,
    notification: {
      title: `New message from ${senderName || 'LinkWorks'}`,
      body: text ? (text.length > 80 ? text.slice(0, 77) + '...' : text) : 'Sent a photo attachment.',
    },
    data: {
      jobId: String(jobId),
      type: 'NEW_MESSAGE',
    },
  };
}

// 1. Worker Rating Recalculation: Triggered when a new verified review is written.
const recalculateWorkerRating = onDocumentCreated('reviews/{reviewId}', async (event) => {
  const snap = event.data;
  if (!snap) return;
  const review = snap.data();
  const targetWorkerId = review?.rateeId;
  if (!targetWorkerId) return;

  const db = getFirestore();
  const reviewsSnap = await db.collection('reviews').where('rateeId', '==', targetWorkerId).get();
  const reviewsList = reviewsSnap.docs.map((d) => d.data());
  const stats = calculateRatingStats(reviewsList);

  await db.collection('workerProfiles').doc(targetWorkerId).update({
    ratingAvg: stats.ratingAvg,
    ratingCount: stats.ratingCount,
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log(`Updated worker rating for ${targetWorkerId}: ${stats.ratingAvg} (${stats.ratingCount} reviews)`);
});

// 2. Job Status Updates: Handles completed job counter increment and assignment push.
const onJobUpdated = onDocumentUpdated('jobs/{jobId}', async (event) => {
  const before = event.data?.before?.data();
  const after = event.data?.after?.data();
  if (!before || !after) return;

  const db = getFirestore();
  const jobId = event.params.jobId;

  // Case A: Job transitions to assigned -> dispatch FCM push to the selected worker.
  if (before.status !== 'assigned' && after.status === 'assigned') {
    const workerId = after.assignedWorkerId;
    if (workerId) {
      try {
        const workerDoc = await db.collection('users').doc(workerId).get();
        const fcmToken = workerDoc.data()?.fcmToken;
        if (fcmToken) {
          const payload = buildJobAssignedPayload(fcmToken, jobId, after.title);
          await getMessaging().send(payload);
          console.log(`Sent assignment notification to worker ${workerId}`);
        }
      } catch (err) {
        console.warn('Assignment notification failed (token absent or test environment):', err?.message);
      }
    }
  }

  // Case B: Job transitions to completed -> atomically increment worker's jobsCompleted counter.
  if (before.status !== 'completed' && after.status === 'completed') {
    const workerId = after.assignedWorkerId;
    if (workerId) {
      try {
        await db.collection('workerProfiles').doc(workerId).update({
          jobsCompleted: FieldValue.increment(1),
          updatedAt: FieldValue.serverTimestamp(),
        });
        console.log(`Incremented jobsCompleted counter for worker ${workerId}`);
      } catch (err) {
        console.warn(`Failed to increment jobsCompleted for ${workerId}:`, err?.message);
      }
    }
  }
});

// 3. New Application / Quote: Notify client that a worker placed a bid.
const onApplicationCreated = onDocumentCreated('jobs/{jobId}/applications/{workerId}', async (event) => {
  const appSnap = event.data;
  if (!appSnap) return;
  const application = appSnap.data();
  const jobId = event.params.jobId;

  const db = getFirestore();
  try {
    const jobDoc = await db.collection('jobs').doc(jobId).get();
    const job = jobDoc.data();
    if (!job || !job.clientId) return;

    const clientDoc = await db.collection('users').doc(job.clientId).get();
    const fcmToken = clientDoc.data()?.fcmToken;
    if (fcmToken) {
      const payload = buildApplicationCreatedPayload(
        fcmToken,
        jobId,
        job.title || 'Job',
        application.workerName,
        application.quotedPriceLkr
      );
      await getMessaging().send(payload);
      console.log(`Dispatched application notification to client ${job.clientId}`);
    }
  } catch (err) {
    console.warn('Application notification failed (non-fatal):', err?.message);
  }
});

// 4. Real-time Chat Message: Notify recipient of incoming messages.
const onChatMessageCreated = onDocumentCreated('chats/{jobId}/messages/{messageId}', async (event) => {
  const msgSnap = event.data;
  if (!msgSnap) return;
  const message = msgSnap.data();
  const jobId = event.params.jobId;
  const senderId = message.senderId;

  const db = getFirestore();
  try {
    const chatDoc = await db.collection('chats').doc(jobId).get();
    const chat = chatDoc.data();
    if (!chat || !chat.participants) return;

    const recipientId = chat.participants.find((p) => p !== senderId);
    if (!recipientId) return;

    const recipientDoc = await db.collection('users').doc(recipientId).get();
    const fcmToken = recipientDoc.data()?.fcmToken;
    if (fcmToken) {
      const payload = buildChatMessagePayload(fcmToken, jobId, message.senderName, message.text);
      await getMessaging().send(payload);
      console.log(`Dispatched message notification to recipient ${recipientId}`);
    }
  } catch (err) {
    console.warn('Chat message notification failed (non-fatal):', err?.message);
  }
});

module.exports = {
  calculateRatingStats,
  buildJobAssignedPayload,
  buildApplicationCreatedPayload,
  buildChatMessagePayload,
  recalculateWorkerRating,
  onJobUpdated,
  onApplicationCreated,
  onChatMessageCreated,
};
