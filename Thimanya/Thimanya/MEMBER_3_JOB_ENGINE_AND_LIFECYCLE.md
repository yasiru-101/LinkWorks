# LinkWorks — Module 3: Job Engine, Quotes & Lifecycle State Machine

> **Owner**: Thimanya (Member 3 / Developer C)  
> **Module**: Job Post Flow, Worker Push Feed, Quote Submissions, and Job Lifecycle State Machine  
> **Target Environment**: React Native (Expo Router + TypeScript) + Firestore & Firebase Storage

The shared schedule and cross-module decisions are in [PROJECT_IMPLEMENTATION_PLAN.md](../PROJECT_IMPLEMENTATION_PLAN.md). This file details Thimanya's module.

---

## 1. Executive Summary & Responsibilities
You build the **core business spine** of LinkWorks. The persisted job status follows this path:

$$\text{open} \longrightarrow \text{assigned} \longrightarrow \text{in progress} \longrightarrow \text{completed}$$

An open job may also be cancelled before assignment. Applications received and reviews are derived from their own records; they are not persisted job statuses. See the shared implementation plan for the canonical contract.

You enable clients to post jobs with budgets, photos, and location, allow matching workers to discover those jobs in their live Push Feed, allow workers to submit side-by-side price quotes with short pitches, and provide the client with a quote comparison sheet to accept and assign the job.

### Core Deliverables
1. **Client Job Creation Flow (`PostJobScreen.tsx`)**:
   - Multi-step or clean single-page form: Title, Category selector, Description, Budget range (Min - Max LKR), Preferred Date, Address/Location + GPS Geohash, Job Photos upload (Firebase Storage).
2. **Worker Matching Push Feed (`WorkerFeedScreen.tsx`)**:
   - Automatically load nearby open jobs when the worker enters the Feed, using the shared foreground location service. Fall back to the saved service base or manual city when current location is unavailable.
   - Query geohash bounds, then keep jobs whose category matches worker skills, whose exact distance from the search center is within the selected feed radius, and whose distance from the saved service base is within the worker's service radius. Sort the default list by distance from the search center.
   - Show active location, distance, radius, loading, empty, error, and retry states; refresh on pull-to-refresh and foreground return.
   - Filter chips (Newest, Highest Budget, Closest Distance).
3. **Application & Quote System (`ApplyJobModal.tsx` & `QuoteCard.tsx`)**:
   - Worker submits a **Quoted Price (LKR)** + **Short Pitch / Message**.
   - Written to subcollection `jobs/{jobId}/applications/{workerId}`.
4. **Client Quote Comparison & Assignment Screen**:
   - Side-by-side or stacked quote comparison list.
   - Action: "Accept Quote" -> updates job status to `assigned`, sets `assignedWorkerId`, unlocks direct phone contact, and initiates job-linked chat.
5. **Job Lifecycle Controller (`useJobLifecycle.ts`)**:
   - State transition machine enforcing business rules (e.g. assigned Worker marks "In Progress", Client confirms "Completed").

---

## 2. Directory Structure Ownership

```
src/
├── features/
│   └── jobs/
│       ├── components/
│       │   ├── JobCard.tsx
│       │   ├── JobStatusBadge.tsx
│       │   ├── QuoteCard.tsx
│       │   ├── QuoteComparisonSheet.tsx
│       │   ├── ApplyWithQuoteModal.tsx
│       │   ├── JobPhotoUploader.tsx
│       │   └── LifecycleActionButtons.tsx
│       ├── context/
│       │   └── JobContext.tsx
│       ├── hooks/
│       │   ├── useJobFeed.ts
│       │   ├── useJobDetails.ts
│       │   ├── useMyPostedJobs.ts
│       │   ├── useWorkerApplications.ts
│       │   └── useJobLifecycle.ts
│       ├── services/
│       │   ├── jobService.ts
│       │   └── applicationService.ts
│       └── screens/
│           ├── PostJobScreen.tsx
│           ├── ClientJobDetailScreen.tsx
│           ├── WorkerFeedScreen.tsx
│           ├── WorkerJobDetailScreen.tsx
│           ├── MyPostedJobsScreen.tsx
│           └── MyApplicationsScreen.tsx
├── app/
│   ├── (client)/
│   │   ├── post-job.tsx            # Post Job Screen
│   │   ├── my-jobs.tsx             # My Posted Jobs Tab
│   │   └── job/[id].tsx            # Client Job Details + Quotes List
│   └── (worker)/
│       ├── feed.tsx                # Worker Matched Job Feed Tab
│       ├── applications.tsx        # My Applications Tab
│       └── job/[id].tsx            # Worker Job View & Apply
```

---

## 3. Data Models & TypeScript Interfaces

```typescript
export type JobStatus =
  | 'open'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Job {
  id: string;
  clientId: string;
  clientName?: string;
  title: string;
  description: string;
  categoryId: string;
  photos: string[];
  budgetMin: number;
  budgetMax: number;
  geo: {
    lat: number;
    lng: number;
    geohash: string;
  };
  addressText: string;
  preferredDate: string; // ISO date string
  status: JobStatus;
  assignedWorkerId: string | null;
  assignedWorkerName?: string;
  assignedPrice?: number;
  applicationCount: number;
  createdAt: number; // timestamp
  updatedAt: number;
}

export type ApplicationStatus = 'submitted' | 'accepted' | 'rejected' | 'withdrawn';

export interface JobApplication {
  workerId: string;
  jobId: string;
  workerName: string;
  workerPhotoUrl: string | null;
  workerRatingAvg: number;
  workerJobsCompleted: number;
  quotedPrice: number; // LKR
  message: string;
  status: ApplicationStatus;
  createdAt: number;
}
```

---

## 4. Lifecycle State Machine Logic

Implement strict state transitions in `jobService.ts`. The following client-side example is illustrative; Firestore rules or trusted backend operations must enforce the same permissions and atomic assignment:

```typescript
export const VALID_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  open: ['assigned', 'cancelled'],
  assigned: ['in_progress'],
  in_progress: ['completed'],
  completed: [],
  cancelled: [],
};

export async function transitionJobStatus(
  jobId: string,
  newStatus: JobStatus,
  userId: string,
  userRole: 'client' | 'worker'
) {
  const jobRef = firestore().collection('jobs').doc(jobId);
  const snap = await jobRef.get();
  if (!snap.exists) throw new Error('Job not found');

  const job = snap.data() as Job;

  // Validate state order
  if (!VALID_TRANSITIONS[job.status]?.includes(newStatus)) {
    throw new Error(`Invalid transition from ${job.status} to ${newStatus}`);
  }

  // Permission Checks
  if (newStatus === 'assigned' && job.clientId !== userId) {
    throw new Error('Only the client who posted the job can assign a worker');
  }
  if (newStatus === 'in_progress' && job.assignedWorkerId !== userId) {
    throw new Error('Only the assigned worker can start the job');
  }
  if (newStatus === 'completed' && job.clientId !== userId) {
    throw new Error('Only the client can confirm job completion');
  }

  await jobRef.update({
    status: newStatus,
    updatedAt: Date.now(),
  });
}
```

---

## 5. Implementation Checklist & Step-by-Step

### Phase 1: Client Post Job Screen (`PostJobScreen.tsx`)
- [ ] Category dropdown/selector with Sinhala/Tamil/English labels.
- [ ] Photo uploader supporting up to 5 job photos (compressed & uploaded to `jobs/{jobId}/photos/`).
- [ ] Budget Min/Max slider with validation (`budgetMin <= budgetMax`).
- [ ] Address text input + Auto-detect current GPS coordinates with geohash generation.
- [ ] On submit: save doc to `jobs` collection with initial status `open` and `applicationCount: 0`.

### Phase 2: Worker Matched Job Feed (`WorkerFeedScreen.tsx`)
- [ ] Fetch worker's skills and base coordinates from `workerProfiles/{uid}`.
- [ ] On Feed entry, use the current foreground location or saved service base/manual city without requiring a search action.
- [ ] Query Firestore geohash bounds for `open` jobs, then filter by matching skill, exact distance from the search center, selected feed radius, and distance from the saved service base within the worker service radius.
- [ ] Refresh when location/radius changes, on pull-to-refresh, and on foreground return; show permission-denied/city fallback and loading/empty/error states.
- [ ] Render Job Cards showing title, budget tag (e.g. `Rs. 5,000 - 8,000`), distance badge, and number of applicants.

### Phase 3: Quote Submission Flow (`ApplyWithQuoteModal.tsx`)
- [ ] Worker enters **Quoted Price** (e.g. Rs. 6,500) and **Pitch Message** (e.g. "I have 6 years carpentry experience and can bring all heavy tools").
- [ ] Save to `jobs/{jobId}/applications/{workerId}`.
- [ ] Keep the parent job status `open`; update `applicationCount` through trusted backend logic.

### Phase 4: Client Quote Comparison & Acceptance (`QuoteComparisonSheet.tsx`)
- [ ] Client opens `job/[id]`.
- [ ] Displays tabbed view: "Job Details" & "Quotes Received (N)".
- [ ] Renders each quote side-by-side with Worker profile snippet (Stars, Jobs Completed, Quoted Price, Pitch).
- [ ] Tap **"Accept Quote"**:
  - Sets application status to `'accepted'`.
  - Sets other applications to `'rejected'`.
  - Sets `job.status = 'assigned'` and `job.assignedWorkerId = workerId` and `job.assignedPrice = quotedPrice`.
  - Unmasks phone numbers.
  - Automatically triggers Member 4's `createOrGetChat(jobId, clientId, workerId)`.

### Phase 5: Client & Worker Tracking Screens
- [ ] `MyPostedJobsScreen.tsx`: Tabbed by "Active", "In Progress", "Completed".
- [ ] `MyApplicationsScreen.tsx`: Worker's applied jobs with badge showing "Pending", "Accepted", "Rejected".

---

## 6. Integration Contract (What Other Members Expect From You)
- **Member 1 (Auth)**: Provides `user.uid`, `user.name`, `user.phone`, `workerProfile`.
- **Member 4 (Chat & Push)**: Listens for quote acceptance to spawn chat and send FCM push notifications (`"You were hired for [Job Title]!"`).
- **Member 5 (Reviews)**: When job reaches `completed`, Member 5 renders the "Write Review" button.

---

## 7. Acceptance Criteria & Demo Script
1. Client posts job: "Fix leaking kitchen pipe", Budget Rs. 3,000 - 5,000, Colombo 03.
2. Worker (Plumber in Colombo) opens Feed -> Automatically sees nearby open plumbing jobs ordered by distance -> Taps "Apply with Quote". With location permission denied, the worker can choose Colombo and still see nearby jobs.
3. Worker inputs Rs. 4,000 and pitch: "Can fix today with PPR replacement" -> Submits.
4. Client receives notification -> Opens Job Details -> Compares quotes -> Taps "Accept Quote".
5. Job changes status to `assigned` -> Worker phone becomes visible -> "Open Chat" button appears.
6. Worker taps "Start Job" (`in_progress`) -> Requests completion -> Client confirms `completed` -> Review flow unlocks.
