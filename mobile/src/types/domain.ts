/**
 * LinkWorks Core Domain Data Contracts
 * 
 * Owner: Shared Data Contracts (Yasiru, Pasindu, Thimanya, Chanuli, Bhashitha)
 * 
 * Defines TypeScript data types representing core entities across the marketplace:
 * 1. User Roles: `client` (job poster) and `worker` (skilled tradesperson).
 * 2. Job Lifecycles: `open` -> `assigned` -> `in_progress` -> `completed` / `cancelled`.
 * 3. Quote Applications: `submitted`, `accepted`, `rejected`, `withdrawn`.
 * 4. Spatial Contracts: `Coordinates` with latitude, longitude, and base-32 geohash.
 * 5. Entities: `UserProfile`, `WorkerProfile`, `Job`, `JobApplication`, `Chat`.
 */

// Active persona mode for dual-role users (Client seeking services vs Worker fulfilling tasks).
export type UserRole = 'client' | 'worker';

// Finite state machine statuses representing a job's complete commercial lifecycle.
export type JobStatus = 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

// Workflow statuses for bids submitted by skilled tradespeople.
export type ApplicationStatus = 'submitted' | 'accepted' | 'rejected' | 'withdrawn';

// Geographic location structure pairing WGS-84 coordinates with an indexed geohash for radius querying.
export type Coordinates = {
  lat: number;
  lng: number;
  geohash: string;
};

// Root user account profile stored in Firestore `users/{userId}`.
export type UserProfile = {
  name: string;
  phone: string;
  city: string;
  isClient: boolean;
  isWorker: boolean;
  activeRole: UserRole;
  photoUrl?: string;
  isBlocked?: boolean;
};

// Public discovery profile for skilled tradespeople stored in Firestore `workers/{workerId}`.
export type WorkerProfile = {
  userId: string;
  displayName: string;
  city: string;
  skills: string[];
  bio: string;
  experienceYears: number;
  dayRateLkr?: number;
  base: Coordinates;
  serviceRadiusKm: number;
  portfolio: string[];
  isAvailable: boolean;
  ratingAvg: number;
  ratingCount: number;
  jobsCompleted: number;
};

// Open or contracted trade job published by a client stored in Firestore `jobs/{jobId}`.
export type Job = {
  clientId: string;
  title: string;
  description: string;
  categoryId: string;
  photos: string[];
  budgetMinLkr?: number;
  budgetMaxLkr?: number;
  geo: Coordinates;
  addressText: string;
  preferredDate?: string;
  status: JobStatus;
  assignedWorkerId?: string;
  acceptedPriceLkr?: number;
  applicationCount: number;
  city?: string;
};

// Quote application / bid record created by a tradesperson in `jobs/{jobId}/applications/{workerId}`.
export type JobApplication = {
  workerId: string;
  message: string;
  quotedPriceLkr: number;
  status: ApplicationStatus;
};

// Real-time message exchange between client and contracted worker in `chats/{chatId}/messages/{msgId}`.
export type ChatMessage = {
  senderId: string;
  text: string;
  imageUrl?: string;
  readBy: string[];
};

// Rating and feedback record submitted following job completion in `reviews/{reviewId}`.
export type Review = {
  jobId: string;
  raterId: string;
  rateeId: string;
  stars: 1 | 2 | 3 | 4 | 5;
  text: string;
};

// Trust & Safety dispute report submitted for moderation review in `reports/{reportId}`.
export type Report = {
  reporterId: string;
  targetId: string;
  targetType: 'user' | 'job' | 'message';
  reason: string;
};
