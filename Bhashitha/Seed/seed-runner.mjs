import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// Resolve firebase-admin through mobile/functions/package.json.
const functionsPackageUrl = new URL('../../mobile/functions/package.json', import.meta.url);
const require = createRequire(fileURLToPath(functionsPackageUrl));
const { initializeApp, getApps } = require('firebase-admin');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const host = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
process.env.FIRESTORE_EMULATOR_HOST = host;
const projectId = process.env.GCLOUD_PROJECT || 'demo-linkworks';

if (getApps().length === 0) {
  initializeApp({ projectId });
}

const db = getFirestore();

// 8 Top trade categories in Sri Lanka with icons and descriptions.
const SEED_CATEGORIES = [
  { id: 'Plumbing', name: 'Plumbing', icon: 'wrench', color: '#027a48', description: 'Pipes, taps, pumps & leaks' },
  { id: 'Carpentry', name: 'Carpentry', icon: 'hammer', color: '#b45309', description: 'Woodwork, doors & furniture' },
  { id: 'Electrical', name: 'Electrical', icon: 'zap', color: '#d97706', description: 'Wiring, breakers & lighting' },
  { id: 'Masonry', name: 'Masonry', icon: 'brick-wall', color: '#4b5563', description: 'Brickwork, plaster & tiling' },
  { id: 'Painting', name: 'Painting', icon: 'paint-roller', color: '#2563eb', description: 'Interior, exterior & gloss' },
  { id: 'AC Repair', name: 'AC Repair', icon: 'wind', color: '#0891b2', description: 'Servicing, inverter & gas fill' },
  { id: 'Roofing', name: 'Roofing', icon: 'home', color: '#9333ea', description: 'Tiles, gutters & waterproofing' },
  { id: 'Cleaning', name: 'Cleaning', icon: 'sparkles', color: '#059669', description: 'Deep clean, sofas & water tanks' },
];

// Fictional Sri Lankan tradespeople across major urban hubs.
const SEED_WORKERS = [
  {
    userId: 'worker-colombo-plumber-1',
    displayName: 'Sunil Shantha',
    city: 'Colombo',
    skills: ['Plumbing'],
    bio: 'Licensed master plumber with 8+ years experience in bathroom leak repairs, water pumps, and piping.',
    experienceYears: 8,
    dayRateLkr: 4500,
    base: { lat: 6.9271, lng: 79.8612, geohash: 'tc0m0m0m0' },
    serviceRadiusKm: 25,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.8,
    ratingCount: 24,
    jobsCompleted: 31,
  },
  {
    userId: 'worker-moratuwa-carpenter-1',
    displayName: 'Pradeep Silva',
    city: 'Moratuwa',
    skills: ['Carpentry', 'Roofing'],
    bio: 'Specialist in custom teak furniture, door fittings, roof woodwork, and timber floor polishing.',
    experienceYears: 12,
    dayRateLkr: 5500,
    base: { lat: 6.773, lng: 79.8816, geohash: 'tc07y2y2y' },
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
    base: { lat: 6.9271, lng: 79.8612, geohash: 'tc0m0m0m0' },
    serviceRadiusKm: 20,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.7,
    ratingCount: 19,
    jobsCompleted: 22,
  },
  {
    userId: 'worker-kandy-mason-1',
    displayName: 'Gamini Kulatunga',
    city: 'Kandy',
    skills: ['Masonry'],
    bio: 'Experienced mason for foundation repairs, brick laying, tile setting, and boundary wall plastering.',
    experienceYears: 15,
    dayRateLkr: 5000,
    base: { lat: 7.2906, lng: 80.6337, geohash: 'tc13u8u8u' },
    serviceRadiusKm: 35,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.85,
    ratingCount: 42,
    jobsCompleted: 58,
  },
  {
    userId: 'worker-galle-painter-1',
    displayName: 'Nimal Fernando',
    city: 'Galle',
    skills: ['Painting'],
    bio: 'Commercial and residential painting contractor with high-pressure washing and waterproofing expertise.',
    experienceYears: 9,
    dayRateLkr: 4200,
    base: { lat: 6.0535, lng: 80.221, geohash: 't8yq1q1q1' },
    serviceRadiusKm: 25,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.6,
    ratingCount: 15,
    jobsCompleted: 18,
  },
];

// Open and active jobs in key Sri Lankan cities.
const SEED_JOBS = [
  {
    id: 'job-demo-plumbing-1',
    clientId: 'demo-client-1',
    title: 'Repair leaking overhead PVC water tank pipe',
    category: 'Plumbing',
    description: 'Main inlet valve is dripping heavily onto the rooftop. Need urgent PPR pipe replacement and joint sealing.',
    budgetLkr: 5000,
    status: 'open',
    city: 'Colombo',
    location: { lat: 6.9271, lng: 79.8612, geohash: 'tc0m0m0m0' },
    photos: [],
  },
  {
    id: 'job-demo-carpentry-1',
    clientId: 'demo-client-1',
    title: 'Custom solid teak dining table repair & polishing',
    category: 'Carpentry',
    description: 'Six-seater dining table has surface scratches and a loose leg bracket that needs realignment and fresh lacquer.',
    budgetLkr: 12000,
    status: 'open',
    city: 'Moratuwa',
    location: { lat: 6.773, lng: 79.8816, geohash: 'tc07y2y2y' },
    photos: [],
  },
  {
    id: 'job-demo-electrical-1',
    clientId: 'demo-client-2',
    title: 'Tripping main residual circuit breaker (RCCB)',
    category: 'Electrical',
    description: 'Downstairs kitchen circuit keeps tripping the main safety switch whenever the refrigerator starts.',
    budgetLkr: 4500,
    status: 'open',
    city: 'Colombo',
    location: { lat: 6.9271, lng: 79.8612, geohash: 'tc0m0m0m0' },
    photos: [],
  },
];

// Verified customer reviews with feedback text.
const SEED_REVIEWS = [
  {
    id: 'review-seed-1',
    jobId: 'job-past-1',
    raterId: 'demo-client-1',
    rateeId: 'worker-colombo-plumber-1',
    stars: 5,
    feedback: 'Excellent plumbing work! Sunil arrived within 45 minutes, replaced the damaged valve, and tested pressure.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'review-seed-2',
    jobId: 'job-past-2',
    raterId: 'demo-client-2',
    rateeId: 'worker-colombo-plumber-1',
    stars: 5,
    feedback: 'Very polite and knowledgeable master plumber. Fixed the bathroom pressure pump without any issues.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'review-seed-3',
    jobId: 'job-past-3',
    raterId: 'demo-client-1',
    rateeId: 'worker-moratuwa-carpenter-1',
    stars: 5,
    feedback: 'Superb carpentry craftsmanship on our doors and window frames. Fair price and very clean finish.',
    createdAt: new Date().toISOString(),
  },
];

// Main seeding function writing to Firestore.
export async function seedFirestore() {
  console.log(`\n🌱 Starting LinkWorks Database Seeder...`);
  console.log(`Target: Firestore Emulator at ${host} (Project: ${projectId})\n`);

  try {
    // 1. Seed Categories
    console.log(`Writing ${SEED_CATEGORIES.length} Trade Categories...`);
    for (const cat of SEED_CATEGORIES) {
      await db.collection('categories').doc(cat.id).set(cat);
    }
    console.log('✓ Categories written.');

    // 2. Seed Workers
    console.log(`Writing ${SEED_WORKERS.length} Worker Profiles...`);
    for (const worker of SEED_WORKERS) {
      await db.collection('workerProfiles').doc(worker.userId).set({
        ...worker,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
    console.log('✓ Worker profiles written.');

    // 3. Seed Jobs
    console.log(`Writing ${SEED_JOBS.length} Sample Marketplace Jobs...`);
    for (const job of SEED_JOBS) {
      const { id, ...jobData } = job;
      await db.collection('jobs').doc(id).set({
        ...jobData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
    console.log('✓ Marketplace jobs written.');

    // 4. Seed Reviews
    console.log(`Writing ${SEED_REVIEWS.length} Verified Customer Reviews...`);
    for (const rev of SEED_REVIEWS) {
      const { id, ...revData } = rev;
      await db.collection('reviews').doc(id).set({
        ...revData,
        createdAt: FieldValue.serverTimestamp(),
      });
    }
    console.log('✓ Customer reviews written.');

    console.log(`\n🎉 LinkWorks database seeded successfully! Ready for demo.\n`);
    return true;
  } catch (err) {
    console.error('❌ Seeder encountered an error:', err.message);
    return false;
  }
}

// Execute immediately when invoked from CLI.
if (process.argv[1] && process.argv[1].endsWith('seed-runner.mjs')) {
  seedFirestore().then((success) => {
    process.exit(success ? 0 : 1);
  });
}
