/**
 * LinkWorks Seed & Demonstration Dataset
 * 
 * Owner: Bhashitha (Design system, navigation, reviews, moderation, seed data, integration and QA)
 * 
 * Provides canonical seed data for development, QA, and automated test runners:
 * 1. Realistic Sri Lankan skilled workers across major cities (Colombo, Kandy, Galle, Moratuwa, Negombo).
 * 2. Pre-calculated geographic base coordinates and geohashes matching `Pasindu/Discovery/geo.ts`.
 * 3. Seed jobs spanning multiple trades with realistic pricing, client IDs, and descriptions.
 */

import { CITY_CENTERS, geohashForPoint } from '../../Pasindu/Discovery/geo';
import type { Job, WorkerProfile } from '../../mobile/src/types/domain';

// Fictional Sri Lankan workers distributed across major cities for testing and demo.
export const SEED_WORKERS: WorkerProfile[] = [
  {
    userId: 'worker-colombo-plumber-1',
    displayName: 'Sunil Shantha',
    city: 'Colombo',
    skills: ['Plumbing'],
    bio: 'Licensed master plumber with 8+ years experience in bathroom leak repairs, water pumps, and piping.',
    experienceYears: 8,
    dayRateLkr: 4500,
    base: {
      lat: 6.905,
      lng: 79.851,
      geohash: geohashForPoint(6.905, 79.851),
    },
    serviceRadiusKm: 25,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.8,
    ratingCount: 24,
    jobsCompleted: 31,
  },
  {
    userId: 'worker-kelaniya-carpenter-1',
    displayName: 'Pradeep Silva',
    city: 'Kelaniya',
    skills: ['Carpentry', 'Roofing'],
    bio: 'Specialist in custom teak furniture, door fittings, roof woodwork, and timber floor polishing in Kelaniya.',
    experienceYears: 12,
    dayRateLkr: 5500,
    base: {
      ...CITY_CENTERS.Kelaniya,
      geohash: geohashForPoint(CITY_CENTERS.Kelaniya.lat, CITY_CENTERS.Kelaniya.lng),
    },
    serviceRadiusKm: 30,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.9,
    ratingCount: 38,
    jobsCompleted: 45,
  },
  {
    userId: 'worker-colombo-electrician-1',
    displayName: 'Mahesh Bandara',
    city: 'Colombo',
    skills: ['Electrical', 'AC Repair'],
    bio: 'Certified electrical technician for three-phase wiring, circuit breaker troubleshooting, and inverter AC maintenance.',
    experienceYears: 6,
    dayRateLkr: 4000,
    base: {
      lat: 6.883,
      lng: 79.865,
      geohash: geohashForPoint(6.883, 79.865),
    },
    serviceRadiusKm: 20,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.7,
    ratingCount: 19,
    jobsCompleted: 22,
  },
  {
    userId: 'worker-kandy-mason-1',
    displayName: 'Chaminda Rathnayake',
    city: 'Kandy',
    skills: ['Masonry', 'Painting'],
    bio: 'Expert mason specializing in brick masonry, plastering, tile laying, and waterproofing in central province.',
    experienceYears: 15,
    dayRateLkr: 5000,
    base: {
      ...CITY_CENTERS.Kandy,
      geohash: geohashForPoint(CITY_CENTERS.Kandy.lat, CITY_CENTERS.Kandy.lng),
    },
    serviceRadiusKm: 35,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.9,
    ratingCount: 42,
    jobsCompleted: 50,
  },
  {
    userId: 'worker-gampaha-gardener-1',
    displayName: 'Anura Kumara',
    city: 'Gampaha',
    skills: ['Gardening'],
    bio: 'Landscape gardener offering lawn trimming, tree lopping, garden design, and organic pest control.',
    experienceYears: 5,
    dayRateLkr: 3500,
    base: {
      ...CITY_CENTERS.Gampaha,
      geohash: geohashForPoint(CITY_CENTERS.Gampaha.lat, CITY_CENTERS.Gampaha.lng),
    },
    serviceRadiusKm: 20,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.6,
    ratingCount: 14,
    jobsCompleted: 18,
  },
  {
    userId: 'worker-negombo-painter-1',
    displayName: 'Jude Fernando',
    city: 'Negombo',
    skills: ['Painting'],
    bio: 'Interior and exterior house painting, weather shield application, and wood varnishing specialist.',
    experienceYears: 7,
    dayRateLkr: 4200,
    base: {
      ...CITY_CENTERS.Negombo,
      geohash: geohashForPoint(CITY_CENTERS.Negombo.lat, CITY_CENTERS.Negombo.lng),
    },
    serviceRadiusKm: 25,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.7,
    ratingCount: 16,
    jobsCompleted: 20,
  },
  {
    userId: 'worker-galle-carpenter-1',
    displayName: 'Nimal De Silva',
    city: 'Galle',
    skills: ['Carpentry'],
    bio: 'Traditional Southern woodworker for roof trusses, window frames, and colonial furniture restoration.',
    experienceYears: 18,
    dayRateLkr: 5200,
    base: {
      ...CITY_CENTERS.Galle,
      geohash: geohashForPoint(CITY_CENTERS.Galle.lat, CITY_CENTERS.Galle.lng),
    },
    serviceRadiusKm: 30,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 5.0,
    ratingCount: 29,
    jobsCompleted: 34,
  },
  {
    userId: 'worker-colombo-ac-1',
    displayName: 'Dinesh Perera',
    city: 'Colombo',
    skills: ['AC Repair', 'Electrical'],
    bio: 'Fast response air conditioning repair, gas refill, and electrical board maintenance across Greater Colombo.',
    experienceYears: 9,
    dayRateLkr: 4800,
    base: {
      lat: 6.865,
      lng: 79.866,
      geohash: geohashForPoint(6.865, 79.866),
    },
    serviceRadiusKm: 15,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.8,
    ratingCount: 31,
    jobsCompleted: 39,
  },
];

// Fictional realistic jobs matching worker categories across Sri Lankan cities.
export const SEED_JOBS: (Job & { id: string })[] = [
  {
    id: 'job-colombo-kitchen-pipe',
    clientId: 'client-demo-1',
    title: 'Repair leaking kitchen drain pipe',
    description: 'Under-sink kitchen drain pipe is leaking continuously. Need a certified plumber to replace seals and inspect traps.',
    categoryId: 'Plumbing',
    photos: [],
    budgetMinLkr: 3500,
    budgetMaxLkr: 6000,
    geo: {
      ...CITY_CENTERS.Colombo,
      geohash: geohashForPoint(CITY_CENTERS.Colombo.lat, CITY_CENTERS.Colombo.lng),
    },
    addressText: 'Colombo 03 (Kollupitiya)',
    preferredDate: '2026-11-05',
    status: 'open',
    applicationCount: 2,
  },
  {
    id: 'job-kelaniya-door-frame',
    clientId: 'client-demo-2',
    title: 'Install 2 solid teak door frames',
    description: 'Need skilled carpenter to plane and fix two pre-cut teak door frames and hang timber doors with brass hinges.',
    categoryId: 'Carpentry',
    photos: [],
    budgetMinLkr: 7000,
    budgetMaxLkr: 12000,
    geo: {
      ...CITY_CENTERS.Kelaniya,
      geohash: geohashForPoint(CITY_CENTERS.Kelaniya.lat, CITY_CENTERS.Kelaniya.lng),
    },
    addressText: 'Peliyagoda Road, Kelaniya',
    preferredDate: '2026-11-08',
    status: 'open',
    applicationCount: 1,
  },
  {
    id: 'job-colombo-trip-switch',
    clientId: 'client-demo-3',
    title: 'Main breaker tripping intermittently',
    description: 'The main distribution board trip switch goes off when high-draw appliances turn on. Need full earth fault test.',
    categoryId: 'Electrical',
    photos: [],
    budgetMinLkr: 4000,
    budgetMaxLkr: 8000,
    geo: {
      ...CITY_CENTERS.Colombo,
      geohash: geohashForPoint(CITY_CENTERS.Colombo.lat, CITY_CENTERS.Colombo.lng),
    },
    addressText: 'Colombo 05 (Havelock Town)',
    preferredDate: '2026-11-03',
    status: 'open',
    applicationCount: 3,
  },
  {
    id: 'job-kandy-garden-retaining',
    clientId: 'client-demo-4',
    title: 'Build small stone retaining wall',
    description: 'Construct a 15ft low rubble retaining wall on sloping garden terrace to prevent rain erosion during monsoon.',
    categoryId: 'Masonry',
    photos: [],
    budgetMinLkr: 15000,
    budgetMaxLkr: 25000,
    geo: {
      ...CITY_CENTERS.Kandy,
      geohash: geohashForPoint(CITY_CENTERS.Kandy.lat, CITY_CENTERS.Kandy.lng),
    },
    addressText: 'Kandy (Peradeniya Rd)',
    preferredDate: '2026-11-12',
    status: 'open',
    applicationCount: 0,
  },
  {
    id: 'job-negombo-exterior-paint',
    clientId: 'client-demo-5',
    title: 'Paint 2-storey house exterior front',
    description: 'Pressure wash wall surface, apply primer, and two coats of weather-shield exterior paint on the front elevation.',
    categoryId: 'Painting',
    photos: [],
    budgetMinLkr: 20000,
    budgetMaxLkr: 35000,
    geo: {
      ...CITY_CENTERS.Negombo,
      geohash: geohashForPoint(CITY_CENTERS.Negombo.lat, CITY_CENTERS.Negombo.lng),
    },
    addressText: 'Negombo (Kochchikade)',
    preferredDate: '2026-11-15',
    status: 'open',
    applicationCount: 2,
  },
];


export type SeedReview = {
  id: string;
  jobId: string;
  raterId: string;
  raterName: string;
  rateeId: string;
  stars: 1 | 2 | 3 | 4 | 5;
  text: string;
  createdAt: string;
};

// Seed reviews for testing profile display, ratings calculation, and moderation preview.
export const SEED_REVIEWS: SeedReview[] = [
  {
    id: 'rev-1',
    jobId: 'job-colombo-kitchen-pipe',
    raterId: 'client-demo-1',
    raterName: 'Kamal Gunaratne',
    rateeId: 'worker-colombo-plumber-1',
    stars: 5,
    text: 'Arrived promptly within 45 minutes of booking, diagnosed the leak cleanly and replaced the sink waste coupling. Outstanding work.',
    createdAt: '2026-10-28',
  },
  {
    id: 'rev-2',
    jobId: 'job-prev-plumb-2',
    raterId: 'client-demo-2',
    raterName: 'Dilani Perera',
    rateeId: 'worker-colombo-plumber-1',
    stars: 5,
    text: 'Fixed our overhead pressure pump issue with genuine spare parts. Highly recommended professional.',
    createdAt: '2026-10-15',
  },
  {
    id: 'rev-3',
    jobId: 'job-prev-carp-1',
    raterId: 'client-demo-3',
    raterName: 'Rohan Jayasuriya',
    rateeId: 'worker-kelaniya-carpenter-1',
    stars: 5,
    text: 'Master craftsman. Finished our teak dining table repair beautifully with precise joinery.',
    createdAt: '2026-10-20',
  },
  {
    id: 'rev-4',
    jobId: 'job-prev-elec-1',
    raterId: 'client-demo-4',
    raterName: 'Sanjeewa Wickramasinghe',
    rateeId: 'worker-colombo-electrician-1',
    stars: 5,
    text: 'Sorted out our tripping circuit breaker quickly and safely. Explained everything clearly.',
    createdAt: '2026-10-22',
  },
];

export type SeedQuote = {
  jobId: string;
  workerId: string;
  workerName: string;
  ratingAvg: number;
  ratingCount: number;
  quotedPriceLkr: number;
  message: string;
  status: 'submitted' | 'accepted' | 'rejected';
  jobTitle: string;
  categoryId: string;
  addressText: string;
};

// Seed job quotes / applications across active trade categories and locations.
export const SEED_QUOTES: SeedQuote[] = [
  {
    jobId: '6yVS194jap9787NtwDZJ',
    workerId: 'worker-kandy-mason-1',
    workerName: 'Chaminda Rathnayake',
    ratingAvg: 4.9,
    ratingCount: 53,
    quotedPriceLkr: 4500,
    message: 'I have 15 years experience in full house brick masonry and plastering. I can bring an assistant and laser level. Can start immediately.',
    status: 'submitted',
    jobTitle: 'Full house mason work',
    categoryId: 'Masonry',
    addressText: 'Kelani handiya, Colombo',
  },
  {
    jobId: '6yVS194jap9787NtwDZJ',
    workerId: 'worker-kelaniya-mason-1',
    workerName: 'Nihal Senanayake',
    ratingAvg: 4.9,
    ratingCount: 44,
    quotedPriceLkr: 5200,
    message: 'Master mason specializing in smooth wall plastering and neat corner bead finishes. Available this week.',
    status: 'submitted',
    jobTitle: 'Full house mason work',
    categoryId: 'Masonry',
    addressText: 'Kelani handiya, Kelaniya',
  },
  {
    jobId: 'job-colombo-kitchen-pipe',
    workerId: 'worker-colombo-plumber-1',
    workerName: 'Sunil Shantha',
    ratingAvg: 4.9,
    ratingCount: 48,
    quotedPriceLkr: 4200,
    message: 'Can arrive today with replacement rubber couplings and PPR pipes. Work is 100% leak-tested before sign-off.',
    status: 'submitted',
    jobTitle: 'Repair leaking kitchen drain pipe & install sink trap',
    categoryId: 'Plumbing',
    addressText: 'Kollupitiya, Colombo 03',
  },
  {
    jobId: 'job-colombo-kitchen-pipe',
    workerId: 'worker-kandy-plumber-1',
    workerName: 'Kasun Jayawardena',
    ratingAvg: 4.7,
    ratingCount: 19,
    quotedPriceLkr: 4800,
    message: 'Master plumber. High quality solvent welds and brass shut-off valve inspection included.',
    status: 'submitted',
    jobTitle: 'Repair leaking kitchen drain pipe & install sink trap',
    categoryId: 'Plumbing',
    addressText: 'Kollupitiya, Colombo 03',
  },
  {
    jobId: 'job-kelaniya-teak-door',
    workerId: 'worker-kelaniya-carpenter-1',
    workerName: 'Pradeep Silva',
    ratingAvg: 5.0,
    ratingCount: 62,
    quotedPriceLkr: 11000,
    message: 'Specialist in teak wood joinery. Will plane to exact millimeter clearance so doors never stick during rainy season.',
    status: 'submitted',
    jobTitle: 'Install 2 solid teak door frames & brass locksets',
    categoryId: 'Carpentry',
    addressText: 'Peliyagoda Road, Kelaniya',
  },
  {
    jobId: 'job-colombo-trip-breaker',
    workerId: 'worker-colombo-electrician-1',
    workerName: 'Mahesh Bandara',
    ratingAvg: 4.8,
    ratingCount: 37,
    quotedPriceLkr: 5500,
    message: 'Certified wireman with insulation resistance tester. I will check every single circuit breaker to pinpoint the leak.',
    status: 'submitted',
    jobTitle: 'Main distribution board trip switch troubleshooting',
    categoryId: 'Electrical',
    addressText: 'Havelock Town, Colombo 05',
  },
  {
    jobId: 'job-negombo-inverter-ac',
    workerId: 'worker-negombo-ac-1',
    workerName: 'Dinesh Perera',
    ratingAvg: 4.9,
    ratingCount: 41,
    quotedPriceLkr: 7500,
    message: 'Certified inverter AC technician. Chemical foam wash, drainage unclog, and precise R32 manifold pressure refill.',
    status: 'submitted',
    jobTitle: 'Split inverter AC outdoor unit chemical wash & gas refill',
    categoryId: 'AC Repair',
    addressText: 'Lewis Place, Negombo',
  },
  {
    jobId: 'job-kandy-retaining-wall',
    workerId: 'worker-kandy-mason-1',
    workerName: 'Chaminda Rathnayake',
    ratingAvg: 4.9,
    ratingCount: 53,
    quotedPriceLkr: 22000,
    message: 'Experienced in central province sloping soil retaining walls with gravel backfill and weep holes for proper drainage.',
    status: 'submitted',
    jobTitle: 'Construct 20ft low stone retaining wall for garden terrace',
    categoryId: 'Masonry',
    addressText: 'Peradeniya Road, Kandy',
  },
  {
    jobId: 'job-galle-exterior-paint',
    workerId: 'worker-galle-painter-1',
    workerName: 'Jude Fernando',
    ratingAvg: 4.7,
    ratingCount: 28,
    quotedPriceLkr: 42000,
    message: 'Two coats of premium weather-shield paint, wall crack filling, and high-pressure washing included.',
    status: 'submitted',
    jobTitle: 'Two-storey villa exterior weather-shield painting',
    categoryId: 'Painting',
    addressText: 'Fort Rampart Road, Galle',
  },
  {
    jobId: 'job-gampaha-lawn-turf',
    workerId: 'worker-gampaha-gardener-1',
    workerName: 'Anura Kumara',
    ratingAvg: 4.8,
    ratingCount: 22,
    quotedPriceLkr: 19000,
    message: 'Will provide topsoil preparation, weed matting, and fresh Australian blue grass sods with initial watering care.',
    status: 'submitted',
    jobTitle: 'Lawn clearing, leveling & Australian blue grass turf laying',
    categoryId: 'Gardening',
    addressText: 'Miriswatta, Gampaha',
  },
  {
    jobId: 'job-colombo-roof-gutters',
    workerId: 'worker-colombo-roofing-1',
    workerName: 'Ruwan Wickramasinghe',
    ratingAvg: 4.9,
    ratingCount: 35,
    quotedPriceLkr: 16000,
    message: 'Zinc-aluminum color-matched seamless gutters with aluminum brackets and downpipes. Leak-proof guarantee.',
    status: 'submitted',
    jobTitle: 'Zinc-aluminum roof gutter replacement & tile realignment',
    categoryId: 'Roofing',
    addressText: 'Nawala Road, Rajagiriya',
  },
];

// In-memory jobs created during the current app session.
// Used as immediate feedback and fallback when Firestore network sync is in offline or demo presentation mode.
export const LOCAL_DYNAMIC_JOBS: Array<Job & { id: string }> = [];

// Add a newly posted job to the dynamic session array.
export function addLocalDynamicJob(job: Job & { id: string }) {
  // Prevent duplicate insertion
  if (!LOCAL_DYNAMIC_JOBS.some((existing) => existing.id === job.id)) {
    LOCAL_DYNAMIC_JOBS.unshift(job);
  }
}

// Retrieve dynamic jobs posted during this app session.
export function getLocalDynamicJobs(): Array<Job & { id: string }> {
  return LOCAL_DYNAMIC_JOBS;
}
