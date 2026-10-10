/** Shared Firestore contract. Keep security rules and Functions in sync with changes here. */
export type UserRole = 'client' | 'worker';
export type JobStatus = 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
export type ApplicationStatus = 'submitted' | 'accepted' | 'rejected' | 'withdrawn';

export type Coordinates = {
  lat: number;
  lng: number;
  geohash: string;
};

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
};

export type JobApplication = {
  workerId: string;
  message: string;
  quotedPriceLkr: number;
  status: ApplicationStatus;
};

export type ChatMessage = {
  senderId: string;
  text: string;
  imageUrl?: string;
  readBy: string[];
};

export type Review = {
  jobId: string;
  raterId: string;
  rateeId: string;
  stars: 1 | 2 | 3 | 4 | 5;
  text: string;
};

export type Report = {
  reporterId: string;
  targetId: string;
  targetType: 'user' | 'job' | 'message';
  reason: string;
};
