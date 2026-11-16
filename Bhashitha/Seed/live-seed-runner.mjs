/**
 * Live Cloud Firestore Database Seeder for Presentation & Demo (Worker & Client Modes)
 * 
 * Owner: Bhashitha (Design system, navigation, reviews, moderation, seed data, integration and QA)
 * 
 * This script seeds the live Google Cloud Firestore project ('linkworks-c6a21') with:
 * 1. Skilled Workers: 12 pros in realistic Colombo neighborhoods + Donald ('8oFWXaBXLWMqxSpRJ7nXqSWJ1DM2')
 * 2. Realistic Marketplace Jobs: 16+ open jobs in Greater Colombo across all 10 categories + regional hubs
 * 3. Worker Mode Assigned & In-Progress Jobs: Active jobs with Donald assigned to demo full job lifecycle
 * 4. Job Quotes (Applications): Both submitted & accepted quotes for Donald and competing workers
 * 5. Real-Time Chat Channels & Messages: Pre-seeded client-worker chat conversations
 * 6. Verified Reviews & Ratings: 5-star customer reviews for Donald
 * 7. Demo Client User Accounts: Populated in `users` collection for contact telephone & name display
 */

import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';

// Resolve global firebase-tools module to leverage authenticated developer session
const require = createRequire(import.meta.url);
const npmRoot = execSync('npm root -g').toString().trim();
const fbToolsPath = require.resolve('firebase-tools', { paths: [npmRoot] });
const auth = require(fbToolsPath.replace('index.js', 'auth.js'));
const api = require(fbToolsPath.replace('index.js', 'api.js'));

const PROJECT_ID = 'linkworks-c6a21';
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
const DONALD_UID = '8oFWXaBXLWMqxSpRJ7nXqSWJ1DM2';

// Helper: Calculate base-32 geohashes for high-precision Firestore spatial matching
function geohashForPoint(lat, lng, precision = 9) {
  let latitude = [-90, 90];
  let longitude = [-180, 180];
  let bits = 0;
  let value = 0;
  let hash = '';
  let useLongitude = true;
  const GEOHASH_ALPHABET = '0123456789bcdefghjkmnpqrstuvwxyz';
  while (hash.length < precision) {
    const range = useLongitude ? longitude : latitude;
    const coordinate = useLongitude ? lng : lat;
    const midpoint = (range[0] + range[1]) / 2;
    value = (value << 1) | (coordinate >= midpoint ? 1 : 0);
    if (coordinate >= midpoint) range[0] = midpoint;
    else range[1] = midpoint;
    useLongitude = !useLongitude;
    bits++;
    if (bits === 5) {
      hash += GEOHASH_ALPHABET[value];
      bits = 0;
      value = 0;
    }
  }
  return hash;
}

// Canonical GPS coordinates for primary Sri Lankan trade hubs
const CITY_CENTERS = {
  Colombo: { lat: 6.9271, lng: 79.8612, geohash: 'tc0z3m11k' },
  Kelaniya: { lat: 6.9536, lng: 79.9167, geohash: 'tc0zd62y4' },
  Kandy: { lat: 7.2906, lng: 80.6337, geohash: 'tc336z5wv' },
  Galle: { lat: 6.0535, lng: 80.221, geohash: 'tc143qp0h' },
  Negombo: { lat: 7.2083, lng: 79.8358, geohash: 'tc2c08nxk' },
  Gampaha: { lat: 7.0917, lng: 79.9997, geohash: 'tc2bk7n00' },
};

// Convert standard JavaScript values into Google Cloud Firestore REST API typed format
function toFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'string') return { stringValue: val };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    if (Number.isInteger(val)) return { integerValue: val.toString() };
    return { doubleValue: val };
  }
  if (val instanceof Date) return { timestampValue: val.toISOString() };
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } };
  }
  if (typeof val === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

// Convert an entire JavaScript object dictionary into Firestore document fields
function toFirestoreFields(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) fields[k] = toFirestoreValue(v);
  }
  return fields;
}

// 1. Comprehensive Worker Profiles Dataset (Distributed across Colombo neighborhoods)
const SEED_WORKERS = [
  {
    userId: 'worker-colombo-plumber-1',
    displayName: 'Sunil Shantha',
    city: 'Colombo',
    phone: '+94771234567',
    skills: ['Plumbing'],
    bio: 'Master plumber with 10+ years experience in bathroom leak repairs, water pumps, and piping in Kollupitiya & Colombo 03.',
    experienceYears: 10,
    dayRateLkr: 4500,
    base: { lat: 6.9050, lng: 79.8510, geohash: 'tc0z3118x' },
    serviceRadiusKm: 25,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.9,
    ratingCount: 48,
    jobsCompleted: 54,
  },
  {
    userId: 'worker-colombo-carpenter-1',
    displayName: 'Pradeep Silva',
    city: 'Colombo',
    phone: '+94779876543',
    skills: ['Carpentry', 'Roofing'],
    bio: 'Specialist in custom solid teak furniture, door fittings, roof woodwork, and timber floor polishing in Nugegoda.',
    experienceYears: 14,
    dayRateLkr: 5500,
    base: { lat: 6.8650, lng: 79.8980, geohash: 'tc0z41ezw' },
    serviceRadiusKm: 25,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 5.0,
    ratingCount: 62,
    jobsCompleted: 78,
  },
  {
    userId: 'worker-colombo-electrician-1',
    displayName: 'Mahesh Bandara',
    city: 'Colombo',
    phone: '+94714567890',
    skills: ['Electrical', 'AC Repair'],
    bio: 'Licensed electrician for three-phase wiring, circuit breaker trip diagnosis, and distribution boards in Havelock Town.',
    experienceYears: 8,
    dayRateLkr: 4200,
    base: { lat: 6.8830, lng: 79.8650, geohash: 'tc0z1m5bm' },
    serviceRadiusKm: 20,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.8,
    ratingCount: 37,
    jobsCompleted: 42,
  },
  {
    userId: 'worker-colombo-mason-1',
    displayName: 'Gamini Kulatunga',
    city: 'Colombo',
    phone: '+94762345678',
    skills: ['Masonry', 'Painting'],
    bio: 'Master mason for brickwork, foundation reinforcement, boundary walls, floor tiling, and plastering in Borella.',
    experienceYears: 15,
    dayRateLkr: 5000,
    base: { lat: 6.9150, lng: 79.8780, geohash: 'tc0z3dv6u' },
    serviceRadiusKm: 25,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.9,
    ratingCount: 53,
    jobsCompleted: 65,
  },
  {
    userId: 'worker-colombo-ac-1',
    displayName: 'Dinesh Perera',
    city: 'Colombo',
    phone: '+94773456789',
    skills: ['AC Repair', 'Electrical'],
    bio: 'Certified HVAC specialist for split inverter AC installation, chemical coil washing, and gas refill in Dehiwala.',
    experienceYears: 9,
    dayRateLkr: 4800,
    base: { lat: 6.8650, lng: 79.8660, geohash: 'tc0z13sxs' },
    serviceRadiusKm: 25,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.9,
    ratingCount: 41,
    jobsCompleted: 49,
  },
  {
    userId: 'worker-colombo-painter-1',
    displayName: 'Jude Fernando',
    city: 'Colombo',
    phone: '+94705678901',
    skills: ['Painting', 'Roofing'],
    bio: 'Professional exterior & interior painting contractor. Weather-shield application and waterproofing in Mount Lavinia.',
    experienceYears: 7,
    dayRateLkr: 4000,
    base: { lat: 6.8350, lng: 79.8630, geohash: 'tc0yck62y' },
    serviceRadiusKm: 25,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.7,
    ratingCount: 28,
    jobsCompleted: 33,
  },
  {
    userId: 'worker-colombo-gardener-1',
    displayName: 'Kamal Perera',
    city: 'Colombo',
    phone: '+94786789012',
    skills: ['Gardening'],
    bio: 'Landscape gardener offering grass turf installation, tree lopping, garden irrigation, and pest control in Bambalapitiya.',
    experienceYears: 6,
    dayRateLkr: 3500,
    base: { lat: 6.8920, lng: 79.8550, geohash: 'tc0z1nssu' },
    serviceRadiusKm: 20,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.8,
    ratingCount: 22,
    jobsCompleted: 27,
  },
  {
    userId: 'worker-colombo-roofing-1',
    displayName: 'Ruwan Wickramasinghe',
    city: 'Colombo',
    phone: '+94777890123',
    skills: ['Roofing', 'Carpentry'],
    bio: 'Tile roofing specialist, zinc-aluminum guttering, leak patching, and timber rafters inspection in Rajagiriya.',
    experienceYears: 11,
    dayRateLkr: 5200,
    base: { lat: 6.9080, lng: 79.8930, geohash: 'tc0z61861' },
    serviceRadiusKm: 25,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.9,
    ratingCount: 35,
    jobsCompleted: 40,
  },
  {
    userId: 'worker-colombo-plumber-2',
    displayName: 'Kasun Jayawardena',
    city: 'Colombo',
    phone: '+94728901234',
    skills: ['Plumbing', 'Roofing'],
    bio: 'Domestic plumbing technician. Overhead tank installations, pressure pumps, and drain clearing in Grandpass.',
    experienceYears: 7,
    dayRateLkr: 4200,
    base: { lat: 6.9450, lng: 79.8720, geohash: 'tc0z98318' },
    serviceRadiusKm: 20,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.7,
    ratingCount: 19,
    jobsCompleted: 25,
  },
  {
    userId: 'worker-colombo-mason-2',
    displayName: 'Nihal Senanayake',
    city: 'Colombo',
    phone: '+94759012345',
    skills: ['Masonry', 'Roofing'],
    bio: 'Expert tile layer for bathrooms, pantry slabs, and granite counter fitting with laser levelling in Kirulapone.',
    experienceYears: 13,
    dayRateLkr: 5000,
    base: { lat: 6.8880, lng: 79.8820, geohash: 'tc0z1vbm9' },
    serviceRadiusKm: 25,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.9,
    ratingCount: 44,
    jobsCompleted: 52,
  },
  {
    userId: 'worker-colombo-cleaner-1',
    displayName: 'Sahan Jayasuriya',
    city: 'Colombo',
    phone: '+94711122334',
    skills: ['Cleaning', 'Plumbing'],
    bio: 'Deep residential cleaning, sofa shampooing, overhead water tank sanitization, and drain clearing in Colombo Fort.',
    experienceYears: 5,
    dayRateLkr: 3800,
    base: { lat: 6.9350, lng: 79.8500, geohash: 'tc0z3n2zr' },
    serviceRadiusKm: 20,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.8,
    ratingCount: 26,
    jobsCompleted: 31,
  },
  {
    userId: 'worker-kandy-mason-1',
    displayName: 'Chaminda Rathnayake',
    city: 'Kandy',
    phone: '+94762345679',
    skills: ['Masonry', 'Painting'],
    bio: 'Expert stone and brick mason for central province terrain, rubble walls, and plastering in Kandy.',
    experienceYears: 15,
    dayRateLkr: 5000,
    base: CITY_CENTERS.Kandy,
    serviceRadiusKm: 35,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.9,
    ratingCount: 53,
    jobsCompleted: 65,
  },
  {
    userId: 'worker-gampaha-gardener-1',
    displayName: 'Anura Kumara',
    city: 'Gampaha',
    phone: '+94786789013',
    skills: ['Gardening'],
    bio: 'Landscape gardener offering grass turf installation, tree lopping, garden irrigation, and pest control in Gampaha.',
    experienceYears: 6,
    dayRateLkr: 3500,
    base: CITY_CENTERS.Gampaha,
    serviceRadiusKm: 20,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.8,
    ratingCount: 22,
    jobsCompleted: 27,
  },
  {
    userId: 'worker-kelaniya-carpenter-1',
    displayName: 'Roshan Gunasekara',
    city: 'Kelaniya',
    phone: '+94779876543',
    skills: ['Carpentry', 'Roofing'],
    bio: 'Specialist in custom solid teak furniture, door fittings, roof woodwork, and timber ceiling installation in Kelaniya & Peliyagoda.',
    experienceYears: 12,
    dayRateLkr: 5200,
    base: { lat: 6.9536, lng: 79.9167, geohash: 'tc0zd62y4' },
    serviceRadiusKm: 25,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.9,
    ratingCount: 42,
    jobsCompleted: 55,
  },
  {
    userId: 'worker-kelaniya-mason-1',
    displayName: 'Buddhika Wickramasinghe',
    city: 'Kelaniya',
    phone: '+94763456781',
    skills: ['Masonry', 'Painting'],
    bio: 'Master mason for brickwork, foundation reinforcement, boundary walls, floor tiling, and plastering in Kelaniya & Kiribathgoda.',
    experienceYears: 14,
    dayRateLkr: 4800,
    base: { lat: 6.9580, lng: 79.9210, geohash: 'tc0zd7n8k' },
    serviceRadiusKm: 25,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.8,
    ratingCount: 36,
    jobsCompleted: 48,
  },
  {
    userId: 'worker-kelaniya-plumber-1',
    displayName: 'Sanath Jayasinghe',
    city: 'Kelaniya',
    phone: '+94715678902',
    skills: ['Plumbing', 'AC Repair'],
    bio: 'Certified plumbing and water motor technician for residential water pressure systems, bathroom renovations, and PVC drainage in Kelaniya.',
    experienceYears: 9,
    dayRateLkr: 4500,
    base: { lat: 6.9510, lng: 79.9140, geohash: 'tc0zd4z7p' },
    serviceRadiusKm: 25,
    portfolio: [],
    isAvailable: true,
    ratingAvg: 4.9,
    ratingCount: 31,
    jobsCompleted: 40,
  },
];

// 2. Demo Client Accounts (Registered in `users` collection)
const SEED_CLIENTS = [
  {
    userId: 'client-demo-1',
    name: 'Nimal Senanayake',
    phone: '+94771234567',
    city: 'Colombo',
    isClient: true,
    isWorker: false,
    activeRole: 'client',
  },
  {
    userId: 'client-demo-2',
    name: 'Anushka Perera',
    phone: '+94778901234',
    city: 'Colombo',
    isClient: true,
    isWorker: false,
    activeRole: 'client',
  },
  {
    userId: 'client-demo-3',
    name: 'Dilshan Silva',
    phone: '+94714567890',
    city: 'Colombo',
    isClient: true,
    isWorker: false,
    activeRole: 'client',
  },
  {
    userId: 'client-demo-4',
    name: 'Kavinda Jayasuriya',
    phone: '+94723456789',
    city: 'Colombo',
    isClient: true,
    isWorker: false,
    activeRole: 'client',
  },
  {
    userId: 'client-demo-5',
    name: 'Priyantha Bandara',
    phone: '+94756789012',
    city: 'Colombo',
    isClient: true,
    isWorker: false,
    activeRole: 'client',
  },
];

// 3. Rich Dataset of Marketplace Jobs for Worker Mode & Client Mode
const SEED_JOBS = [
  // --- OPEN JOBS IN GREATER COLOMBO (Worker Feed Discovery) ---
  {
    id: 'job-colombo-kitchen-pipe',
    clientId: 'client-demo-1',
    title: 'Repair leaking kitchen drain pipe & install sink trap',
    description: 'Under-sink kitchen drain pipe is leaking continuously into the cabinet. Need a qualified plumber to replace coupling seals, fit a new P-trap, and check main flow.',
    categoryId: 'Plumbing',
    photos: [],
    budgetMinLkr: 3500,
    budgetMaxLkr: 6000,
    geo: { lat: 6.9050, lng: 79.8510 },
    addressText: 'Kollupitiya, Colombo 03',
    city: 'Colombo',
    preferredDate: 'Within 2 days',
    status: 'open',
    applicationCount: 2,
  },
  {
    id: 'job-colombo-bathroom-booster',
    clientId: 'client-demo-2',
    title: 'Install 0.5HP water booster pump & pressure tank for upstairs bathroom',
    description: 'Low water pressure on second-floor showers and fixtures. Need a qualified plumber to connect a 0.5HP automatic pressure pump with check valves, anti-vibration mount, and bypass piping.',
    categoryId: 'Plumbing',
    photos: [],
    budgetMinLkr: 7000,
    budgetMaxLkr: 12000,
    geo: { lat: 6.8920, lng: 79.8550 },
    addressText: 'Bambalapitiya, Colombo 04',
    city: 'Colombo',
    preferredDate: 'This weekend',
    status: 'open',
    applicationCount: 2,
  },
  {
    id: 'job-colombo-overhead-tank',
    clientId: 'client-demo-3',
    title: 'Overhead water storage tank cleaning and float valve replacement',
    description: '1,000L overhead water tank requires draining, interior pressure scrub, sediment removal, and a new brass mechanical ball valve installation.',
    categoryId: 'Plumbing',
    photos: [],
    budgetMinLkr: 4500,
    budgetMaxLkr: 8000,
    geo: { lat: 6.8650, lng: 79.8660 },
    addressText: 'Dehiwala',
    city: 'Colombo',
    preferredDate: 'Flexible',
    status: 'open',
    applicationCount: 1,
  },
  {
    id: 'job-colombo-trip-breaker',
    clientId: 'client-demo-3',
    title: 'Main distribution board trip switch troubleshooting',
    description: 'The main RCCB trip switch frequently cuts power when high-draw appliances (kettle, water heater) turn on. Need full earth fault test and neutral balance check.',
    categoryId: 'Electrical',
    photos: [],
    budgetMinLkr: 4000,
    budgetMaxLkr: 8000,
    geo: { lat: 6.8830, lng: 79.8650 },
    addressText: 'Havelock Town, Colombo 05',
    city: 'Colombo',
    preferredDate: 'Urgent (Today)',
    status: 'open',
    applicationCount: 2,
  },
  {
    id: 'job-colombo-wiring-upgrade',
    clientId: 'client-demo-4',
    title: 'Three-phase sub-meter installation & kitchen socket circuit wiring',
    description: 'Upgrading electrical wiring for a commercial kitchen area. Need separate 20A breaker circuits and sub-meter wiring with armored cable casing.',
    categoryId: 'Electrical',
    photos: [],
    budgetMinLkr: 9000,
    budgetMaxLkr: 16000,
    geo: { lat: 6.8740, lng: 79.8610 },
    addressText: 'Wellawatte, Colombo 06',
    city: 'Colombo',
    preferredDate: 'Next week',
    status: 'open',
    applicationCount: 1,
  },
  {
    id: 'job-colombo-ceiling-fans',
    clientId: 'client-demo-5',
    title: 'Assemble and mount 4 KDK ceiling fans with regulator switches',
    description: 'Need a licensed electrician to assemble, balance, and safely hang 4 ceiling fans in bedrooms and living area, complete with new speed controllers.',
    categoryId: 'Electrical',
    photos: [],
    budgetMinLkr: 5500,
    budgetMaxLkr: 9500,
    geo: { lat: 6.9150, lng: 79.8780 },
    addressText: 'Borella, Colombo 08',
    city: 'Colombo',
    preferredDate: 'Within 3 days',
    status: 'open',
    applicationCount: 1,
  },
  {
    id: 'job-colombo-boundary-wall',
    clientId: 'client-demo-1',
    title: 'Re-plaster 35ft boundary wall & apply waterproof cement skim',
    description: 'Exterior boundary wall has moss buildup and peeling plaster. Need masonry work to chip away loose surface, re-plaster with waterproof additive, and finish smooth.',
    categoryId: 'Masonry',
    photos: [],
    budgetMinLkr: 18000,
    budgetMaxLkr: 28000,
    geo: { lat: 6.9080, lng: 79.8930 },
    addressText: 'Rajagiriya',
    city: 'Colombo',
    preferredDate: 'Starting Monday',
    status: 'open',
    applicationCount: 2,
  },
  {
    id: 'job-colombo-floor-tiling',
    clientId: 'client-demo-2',
    title: 'Lay vitrified floor tiles (150 sqft) for balcony terrace',
    description: 'First-floor open balcony requires slope correction, waterproof screed application, and installation of 2ft x 2ft non-slip porcelain tiles with neat grouting.',
    categoryId: 'Masonry',
    photos: [],
    budgetMinLkr: 22000,
    budgetMaxLkr: 34000,
    geo: { lat: 6.8650, lng: 79.8980 },
    addressText: 'Nugegoda',
    city: 'Colombo',
    preferredDate: 'Within 10 days',
    status: 'open',
    applicationCount: 1,
  },
  {
    id: 'job-colombo-roof-gutters',
    clientId: 'client-demo-3',
    title: 'Zinc-aluminum roof gutter replacement & tile realignment',
    description: 'Old PVC gutters are cracked and leaking rainwater into the porch ceiling. Need 45ft zinc-aluminum guttering installed with downpipes and roof valley tile seal.',
    categoryId: 'Roofing',
    photos: [],
    budgetMinLkr: 14000,
    budgetMaxLkr: 22000,
    geo: { lat: 6.9020, lng: 79.8900 },
    addressText: 'Nawala Road, Rajagiriya',
    city: 'Colombo',
    preferredDate: 'Before rain season',
    status: 'open',
    applicationCount: 2,
  },
  {
    id: 'job-colombo-roof-leak-repair',
    clientId: 'client-demo-4',
    title: 'Inspect roof valley flashing and replace 15 cracked Calicut clay tiles',
    description: 'Persistent roof leak over bedroom during heavy downpours. Requires inspection of lead/zinc flashing, replacing broken terracotta tiles, and applying silicone sealant.',
    categoryId: 'Roofing',
    photos: [],
    budgetMinLkr: 9500,
    budgetMaxLkr: 16000,
    geo: { lat: 6.8880, lng: 79.8820 },
    addressText: 'Kirulapone, Colombo 06',
    city: 'Colombo',
    preferredDate: 'Urgent',
    status: 'open',
    applicationCount: 1,
  },
  {
    id: 'job-colombo-sliding-partition',
    clientId: 'client-demo-5',
    title: 'Install frosted tempered glass & powder-coated aluminum office partition',
    description: 'Fabricate and install a 10ft x 8ft sliding aluminum glass partition for home office space. Includes top hung roller mechanism and privacy frosted film.',
    categoryId: 'Aluminum',
    photos: [],
    budgetMinLkr: 32000,
    budgetMaxLkr: 48000,
    geo: { lat: 6.9350, lng: 79.8500 },
    addressText: 'Colombo Fort, Colombo 01',
    city: 'Colombo',
    preferredDate: 'This month',
    status: 'open',
    applicationCount: 1,
  },
  {
    id: 'job-colombo-pantry-repair',
    clientId: 'client-demo-1',
    title: 'Solid mahogany pantry cupboard hinge realignments & drawer slides',
    description: 'Multiple wooden pantry doors are sagging and several soft-close drawer runners need replacement. Looking for a meticulous finish carpenter.',
    categoryId: 'Carpentry',
    photos: [],
    budgetMinLkr: 8000,
    budgetMaxLkr: 14000,
    geo: { lat: 6.9080, lng: 79.8680 },
    addressText: 'Cinnamon Gardens, Colombo 07',
    city: 'Colombo',
    preferredDate: 'Flexible',
    status: 'open',
    applicationCount: 1,
  },
  {
    id: 'job-colombo-ac-master-servicing',
    clientId: 'client-demo-2',
    title: 'Comprehensive indoor & outdoor chemical cleaning for 2 Daikin Inverter ACs',
    description: 'Annual servicing required for two 18,000 BTU split inverter air conditioners. Full dismantle of indoor blower wheel, antibacterial chemical wash, and refrigerant pressure test.',
    categoryId: 'AC Repair',
    photos: [],
    budgetMinLkr: 8000,
    budgetMaxLkr: 14000,
    geo: { lat: 6.9100, lng: 79.8520 },
    addressText: 'Kollupitiya, Colombo 03',
    city: 'Colombo',
    preferredDate: 'Tomorrow',
    status: 'open',
    applicationCount: 1,
  },
  {
    id: 'job-colombo-interior-paint',
    clientId: 'client-demo-3',
    title: 'Living room and dining hall emulsion paint refresh with wall putty touching',
    description: 'Approx 900 sqft interior wall surface. Small hairline cracks need wall putty smoothing, sanding, primer coat, and two coats of Dulux vinyl silk emulsion.',
    categoryId: 'Painting',
    photos: [],
    budgetMinLkr: 28000,
    budgetMaxLkr: 42000,
    geo: { lat: 6.8350, lng: 79.8630 },
    addressText: 'Mount Lavinia',
    city: 'Colombo',
    preferredDate: 'Next weekend',
    status: 'open',
    applicationCount: 1,
  },
  {
    id: 'job-colombo-deep-clean',
    clientId: 'client-demo-4',
    title: 'Post-renovation deep clean for 3-bedroom apartment including window glass',
    description: 'Complete apartment dust and paint spot removal following interior painting. Scrubbing of vitrified tile floors, bathroom sanitization, and sliding glass window cleaning.',
    categoryId: 'Cleaning',
    photos: [],
    budgetMinLkr: 15000,
    budgetMaxLkr: 24000,
    geo: { lat: 6.9060, lng: 79.8515 },
    addressText: 'Kollupitiya, Colombo 03',
    city: 'Colombo',
    preferredDate: 'Within 4 days',
    status: 'open',
    applicationCount: 1,
  },
  {
    id: 'job-colombo-garden-cleanup',
    clientId: 'client-demo-5',
    title: 'Overgrown hedge trimming, palm tree pruning, and garden waste bagging',
    description: 'Front and back garden maintenance: trimming 60ft length of boundary hedge, shaping ornamental shrubs, clearing dead fronds from 3 King Coconut palms, and bagging clippings.',
    categoryId: 'Gardening',
    photos: [],
    budgetMinLkr: 6500,
    budgetMaxLkr: 11000,
    geo: { lat: 6.8980, lng: 79.9190 },
    addressText: 'Battaramulla',
    city: 'Colombo',
    preferredDate: 'This Saturday',
    status: 'open',
    applicationCount: 1,
  },

  // --- REGIONAL OPEN JOBS (Other Hubs & Kelaniya) ---
  {
    id: 'job-kelaniya-teak-door',
    clientId: 'client-demo-2',
    title: 'Install 2 solid teak door frames & brass locksets',
    description: 'Need a skilled carpenter to plane and fix two pre-cut solid teak door frames, hang timber doors with heavy-duty brass hinges, and install mortise locks.',
    categoryId: 'Carpentry',
    photos: [],
    budgetMinLkr: 8000,
    budgetMaxLkr: 14000,
    geo: { lat: 6.9536, lng: 79.9167 },
    addressText: 'Peliyagoda Road, Kelaniya',
    city: 'Kelaniya',
    preferredDate: 'This weekend',
    status: 'open',
    applicationCount: 2,
  },
  {
    id: 'job-kelaniya-brick-wall',
    clientId: 'client-demo-3',
    title: 'Construct 25ft brick boundary wall with cement plastering',
    description: 'Build a 25ft long, 6ft high red brick boundary wall on concrete strip footing, complete with cement plaster coat and water drainage weep holes.',
    categoryId: 'Masonry',
    photos: [],
    budgetMinLkr: 19000,
    budgetMaxLkr: 30000,
    geo: { lat: 6.9580, lng: 79.9210 },
    addressText: 'Thorana Handiya, Kelaniya',
    city: 'Kelaniya',
    preferredDate: 'Next week',
    status: 'open',
    applicationCount: 2,
  },
  {
    id: 'job-kelaniya-water-line',
    clientId: 'client-demo-1',
    title: 'Overhead tank piping overhaul & booster pump connection',
    description: 'PPR pipe connections from overhead tank are leaking. Need replacement valves, pressure gauge testing, and automatic water level sensor wiring.',
    categoryId: 'Plumbing',
    photos: [],
    budgetMinLkr: 6000,
    budgetMaxLkr: 11000,
    geo: { lat: 6.9510, lng: 79.9140 },
    addressText: 'Wedamulla, Kelaniya',
    city: 'Kelaniya',
    preferredDate: 'Flexible',
    status: 'open',
    applicationCount: 2,
  },
  {
    id: 'job-negombo-inverter-ac',
    clientId: 'client-demo-4',
    title: 'Split inverter AC outdoor unit chemical wash & gas refill',
    description: '12,000 BTU Panasonic Inverter AC is not cooling properly and blowing lukewarm air. Requires chemical coil cleaning, filter service, and R32 gas pressure top-up.',
    categoryId: 'AC Repair',
    photos: [],
    budgetMinLkr: 6000,
    budgetMaxLkr: 10000,
    geo: CITY_CENTERS.Negombo,
    addressText: 'Lewis Place, Negombo',
    city: 'Negombo',
    preferredDate: 'Within 3 days',
    status: 'open',
    applicationCount: 1,
  },
  {
    id: 'job-kandy-retaining-wall',
    clientId: 'client-demo-5',
    title: 'Construct 20ft low stone retaining wall for garden terrace',
    description: 'Build a 20ft long, 3ft high rubble retaining wall with drainage weep holes on a sloping garden terrace to prevent soil erosion during the monsoon.',
    categoryId: 'Masonry',
    photos: [],
    budgetMinLkr: 18000,
    budgetMaxLkr: 28000,
    geo: CITY_CENTERS.Kandy,
    addressText: 'Peradeniya Road, Kandy',
    city: 'Kandy',
    preferredDate: 'Next week',
    status: 'open',
    applicationCount: 1,
  },
  {
    id: 'job-galle-exterior-paint',
    clientId: 'client-demo-1',
    title: 'Two-storey villa exterior weather-shield painting',
    description: 'High-pressure wash wall surfaces, scrape peeling plaster, apply acrylic exterior primer, and paint two coats of premium weather-shield paint on front and side walls.',
    categoryId: 'Painting',
    photos: [],
    budgetMinLkr: 35000,
    budgetMaxLkr: 55000,
    geo: CITY_CENTERS.Galle,
    addressText: 'Fort Rampart Road, Galle',
    city: 'Galle',
    preferredDate: 'Flexible',
    status: 'open',
    applicationCount: 1,
  },
  {
    id: 'job-gampaha-lawn-turf',
    clientId: 'client-demo-2',
    title: 'Lawn clearing, leveling & Australian blue grass turf laying',
    description: 'Clear 1,200 sqft front yard of wild weeds, level the red soil ground, install root weed mat, and lay Australian blue grass turf with edging stones.',
    categoryId: 'Gardening',
    photos: [],
    budgetMinLkr: 15000,
    budgetMaxLkr: 25000,
    geo: CITY_CENTERS.Gampaha,
    addressText: 'Miriswatta, Gampaha',
    city: 'Gampaha',
    preferredDate: 'Within 5 days',
    status: 'open',
    applicationCount: 1,
  },

  // --- WORKER MODE ASSIGNED & IN-PROGRESS JOBS FOR DONALD ---
  {
    id: 'job-colombo-donald-assigned-plumbing',
    clientId: 'client-demo-1',
    title: 'Emergency bathroom pipe burst & pressure pump overhaul',
    description: 'Underground PVC supply line to second-floor bathroom burst and flooding the lower ceiling. Need urgent pipe section replacement, union joint fittings, and pump recalibration.',
    categoryId: 'Plumbing',
    photos: [],
    budgetMinLkr: 15000,
    budgetMaxLkr: 20000,
    acceptedPriceLkr: 16500,
    assignedWorkerId: DONALD_UID,
    geo: { lat: 6.9080, lng: 79.8680 },
    addressText: 'Cinnamon Gardens, Colombo 07',
    city: 'Colombo',
    preferredDate: 'Urgent',
    status: 'assigned',
    applicationCount: 1,
  },
  {
    id: 'job-colombo-donald-inprogress-electrical',
    clientId: 'client-demo-2',
    title: 'Main distribution board rewiring & surge protector installation',
    description: 'Full safety overhaul of aged distribution board. Installing 63A double pole isolator, 30mA RCCB trip switch, Type 2 surge protection device, and labeling all sub-circuits.',
    categoryId: 'Electrical',
    photos: [],
    budgetMinLkr: 10000,
    budgetMaxLkr: 15000,
    acceptedPriceLkr: 12500,
    assignedWorkerId: DONALD_UID,
    geo: { lat: 6.9050, lng: 79.8510 },
    addressText: 'Kollupitiya, Colombo 03',
    city: 'Colombo',
    preferredDate: 'In Progress',
    status: 'in_progress',
    applicationCount: 1,
  },
  {
    id: 'job-colombo-donald-completed-roofing',
    clientId: 'client-demo-4',
    title: 'Zinc-aluminum valley gutter leak repair & tile waterproofing',
    description: 'Repaired 35ft valley gutter over rear veranda with zinc-aluminum flashing, replaced 14 broken tiles, and applied bitumen waterproofing membrane.',
    categoryId: 'Roofing',
    photos: [],
    budgetMinLkr: 18000,
    budgetMaxLkr: 25000,
    acceptedPriceLkr: 21000,
    assignedWorkerId: DONALD_UID,
    geo: { lat: 6.9080, lng: 79.8930 },
    addressText: 'Rajagiriya',
    city: 'Colombo',
    preferredDate: 'Completed',
    status: 'completed',
    applicationCount: 1,
  },
];

// 4. Job Quotes / Applications (Including Donald's Quotes in 'submitted' & 'accepted' states)
const SEED_QUOTES = [
  // --- DONALD'S QUOTES (Surfaced in 'My Quotes' Tab in Worker Mode) ---
  {
    jobId: 'job-colombo-bathroom-booster',
    workerId: DONALD_UID,
    workerName: 'Donald',
    ratingAvg: 4.9,
    ratingCount: 28,
    quotedPriceLkr: 8500,
    message: 'Licensed master plumber with 8+ years experience. Can install 0.5HP booster pump with anti-vibration rubber base, copper bypass, and pressure testing. Available tomorrow.',
    status: 'submitted',
    jobTitle: 'Install 0.5HP water booster pump & pressure tank for upstairs bathroom',
    categoryId: 'Plumbing',
    addressText: 'Bambalapitiya, Colombo 04',
  },
  {
    jobId: 'job-colombo-roof-gutters',
    workerId: DONALD_UID,
    workerName: 'Donald',
    ratingAvg: 4.9,
    ratingCount: 28,
    quotedPriceLkr: 15500,
    message: 'Will supply color-matched 0.47mm zinc-aluminum gutters with heavy-duty brackets and downpipe seal. 1-year leakage warranty included.',
    status: 'submitted',
    jobTitle: 'Zinc-aluminum roof gutter replacement & tile realignment',
    categoryId: 'Roofing',
    addressText: 'Nawala Road, Rajagiriya',
  },
  {
    jobId: 'job-colombo-trip-breaker',
    workerId: DONALD_UID,
    workerName: 'Donald',
    ratingAvg: 4.9,
    ratingCount: 28,
    quotedPriceLkr: 6000,
    message: 'Certified wireman with insulation resistance tester. I will check every single circuit breaker to pinpoint and isolate the earth fault.',
    status: 'submitted',
    jobTitle: 'Main distribution board trip switch troubleshooting',
    categoryId: 'Electrical',
    addressText: 'Havelock Town, Colombo 05',
  },
  {
    jobId: '6yVS194jap9787NtwDZJ',
    workerId: DONALD_UID,
    workerName: 'Donald',
    ratingAvg: 4.9,
    ratingCount: 28,
    quotedPriceLkr: 4800,
    message: 'Can handle the full house plastering and repair work. Experienced with cement skim and leveling.',
    status: 'submitted',
    jobTitle: 'Full house mason work',
    categoryId: 'Masonry',
    addressText: 'Kelani handiya, Kelaniya',
  },
  {
    jobId: 'job-colombo-sliding-partition',
    workerId: DONALD_UID,
    workerName: 'Donald',
    ratingAvg: 4.9,
    ratingCount: 28,
    quotedPriceLkr: 38000,
    message: 'Expert aluminum fabricator. Heavy gauge powder-coated sections with 8mm tempered frosted glass and smooth heavy-duty roller track.',
    status: 'submitted',
    jobTitle: 'Install frosted tempered glass & powder-coated aluminum office partition',
    categoryId: 'Aluminum',
    addressText: 'Colombo Fort, Colombo 01',
  },
  {
    jobId: 'job-colombo-donald-assigned-plumbing',
    workerId: DONALD_UID,
    workerName: 'Donald',
    ratingAvg: 4.9,
    ratingCount: 28,
    quotedPriceLkr: 16500,
    message: 'Emergency response ready. I have the replacement PPR pipes, compression fittings, and pressure gauge in my vehicle.',
    status: 'accepted',
    jobTitle: 'Emergency bathroom pipe burst & pressure pump overhaul',
    categoryId: 'Plumbing',
    addressText: 'Cinnamon Gardens, Colombo 07',
  },
  {
    jobId: 'job-colombo-donald-inprogress-electrical',
    workerId: DONALD_UID,
    workerName: 'Donald',
    ratingAvg: 4.9,
    ratingCount: 28,
    quotedPriceLkr: 12500,
    message: 'Certified wireman. Will re-route high current circuits and install Schneider electric circuit breakers.',
    status: 'accepted',
    jobTitle: 'Main distribution board rewiring & surge protector installation',
    categoryId: 'Electrical',
    addressText: 'Kollupitiya, Colombo 03',
  },
  {
    jobId: 'job-colombo-donald-completed-roofing',
    workerId: DONALD_UID,
    workerName: 'Donald',
    ratingAvg: 4.9,
    ratingCount: 28,
    quotedPriceLkr: 21000,
    message: 'Inspected the valley flashing. High quality zinc-aluminum guttering with bitumen seal.',
    status: 'accepted',
    jobTitle: 'Zinc-aluminum valley gutter leak repair & tile waterproofing',
    categoryId: 'Roofing',
    addressText: 'Rajagiriya',
  },

  // --- COMPETING QUOTES FROM OTHER VERIFIED TRADESPEOPLE ---
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
    workerId: 'worker-colombo-plumber-2',
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
    jobId: 'job-colombo-bathroom-booster',
    workerId: 'worker-colombo-plumber-1',
    workerName: 'Sunil Shantha',
    ratingAvg: 4.9,
    ratingCount: 48,
    quotedPriceLkr: 9200,
    message: 'Can install with automatic flow switch, heavy-duty check valves, and provide 6 months workmanship warranty.',
    status: 'submitted',
    jobTitle: 'Install 0.5HP water booster pump & pressure tank for upstairs bathroom',
    categoryId: 'Plumbing',
    addressText: 'Bambalapitiya, Colombo 04',
  },
  {
    jobId: 'job-colombo-trip-breaker',
    workerId: 'worker-colombo-electrician-1',
    workerName: 'Mahesh Bandara',
    ratingAvg: 4.8,
    ratingCount: 37,
    quotedPriceLkr: 5500,
    message: 'Experienced wireman with digital Megger tester. Pinpoint neutral leakages without tearing up conduit walls.',
    status: 'submitted',
    jobTitle: 'Main distribution board trip switch troubleshooting',
    categoryId: 'Electrical',
    addressText: 'Havelock Town, Colombo 05',
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
  {
    jobId: '6yVS194jap9787NtwDZJ',
    workerId: 'worker-kandy-mason-1',
    workerName: 'Chaminda Rathnayake',
    ratingAvg: 4.9,
    ratingCount: 53,
    quotedPriceLkr: 4500,
    message: 'Available to inspect and provide accurate work schedule. Quality cement finish guaranteed.',
    status: 'submitted',
    jobTitle: 'Full house mason work',
    categoryId: 'Masonry',
    addressText: 'Kelani handiya, Kelaniya',
  },
  {
    jobId: '6yVS194jap9787NtwDZJ',
    workerId: 'worker-colombo-mason-2',
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
    jobId: 'job-colombo-boundary-wall',
    workerId: 'worker-colombo-mason-1',
    workerName: 'Gamini Kulatunga',
    ratingAvg: 4.9,
    ratingCount: 53,
    quotedPriceLkr: 21000,
    message: 'Chipping of loose plaster, waterproof additive bond coat, and 1:3 cement sand rendering with float finish.',
    status: 'submitted',
    jobTitle: 'Re-plaster 35ft boundary wall & apply waterproof cement skim',
    categoryId: 'Masonry',
    addressText: 'Rajagiriya',
  },
  {
    jobId: 'job-colombo-boundary-wall',
    workerId: 'worker-colombo-mason-2',
    workerName: 'Nihal Senanayake',
    ratingAvg: 4.9,
    ratingCount: 44,
    quotedPriceLkr: 23500,
    message: 'Includes moss treatment, fiber mesh reinforcement over joints, and double coat waterproof plaster.',
    status: 'submitted',
    jobTitle: 'Re-plaster 35ft boundary wall & apply waterproof cement skim',
    categoryId: 'Masonry',
    addressText: 'Rajagiriya',
  },
  {
    jobId: 'job-colombo-floor-tiling',
    workerId: 'worker-colombo-mason-1',
    workerName: 'Gamini Kulatunga',
    ratingAvg: 4.9,
    ratingCount: 53,
    quotedPriceLkr: 26000,
    message: 'Laser leveling, waterproof polymer membrane, and porcelain tile adhesive with epoxy grouting.',
    status: 'submitted',
    jobTitle: 'Lay vitrified floor tiles (150 sqft) for balcony terrace',
    categoryId: 'Masonry',
    addressText: 'Nugegoda',
  },
  {
    jobId: 'job-colombo-ceiling-fans',
    workerId: 'worker-colombo-electrician-1',
    workerName: 'Mahesh Bandara',
    ratingAvg: 4.8,
    ratingCount: 37,
    quotedPriceLkr: 6500,
    message: 'Safe suspension hooks, vibration dampening rubber washers, and wall controller box wiring included.',
    status: 'submitted',
    jobTitle: 'Assemble and mount 4 KDK ceiling fans with regulator switches',
    categoryId: 'Electrical',
    addressText: 'Borella, Colombo 08',
  },
  {
    jobId: 'job-kelaniya-teak-door',
    workerId: 'worker-kelaniya-carpenter-1',
    workerName: 'Roshan Gunasekara',
    ratingAvg: 4.9,
    ratingCount: 42,
    quotedPriceLkr: 10500,
    message: 'Specialist in solid teak joinery. Will plane to exact millimeter clearance, fit heavy brass hinges and locksets smoothly.',
    status: 'submitted',
    jobTitle: 'Install 2 solid teak door frames & brass locksets',
    categoryId: 'Carpentry',
    addressText: 'Peliyagoda Road, Kelaniya',
  },
  {
    jobId: 'job-kelaniya-teak-door',
    workerId: 'worker-colombo-roofing-1',
    workerName: 'Ruwan Wickramasinghe',
    ratingAvg: 4.9,
    ratingCount: 35,
    quotedPriceLkr: 12000,
    message: 'Carpentry & timber frame fitting with heavy-duty brass hinges and mortise lock fitting included.',
    status: 'submitted',
    jobTitle: 'Install 2 solid teak door frames & brass locksets',
    categoryId: 'Carpentry',
    addressText: 'Peliyagoda Road, Kelaniya',
  },
  {
    jobId: 'job-kelaniya-brick-wall',
    workerId: 'worker-kelaniya-mason-1',
    workerName: 'Buddhika Wickramasinghe',
    ratingAvg: 4.8,
    ratingCount: 36,
    quotedPriceLkr: 22000,
    message: 'Expert brick mason in Kelaniya. Clean concrete strip footing, double brick courses, smooth sand-cement plaster finish.',
    status: 'submitted',
    jobTitle: 'Construct 25ft brick boundary wall with cement plastering',
    categoryId: 'Masonry',
    addressText: 'Thorana Handiya, Kelaniya',
  },
  {
    jobId: 'job-kelaniya-brick-wall',
    workerId: DONALD_UID,
    workerName: 'Donald',
    ratingAvg: 4.9,
    ratingCount: 28,
    quotedPriceLkr: 21500,
    message: 'Available to build the boundary wall with precision alignment, moisture barrier, and clean cement plastering.',
    status: 'submitted',
    jobTitle: 'Construct 25ft brick boundary wall with cement plastering',
    categoryId: 'Masonry',
    addressText: 'Thorana Handiya, Kelaniya',
  },
  {
    jobId: 'job-kelaniya-water-line',
    workerId: 'worker-kelaniya-plumber-1',
    workerName: 'Sanath Jayasinghe',
    ratingAvg: 4.9,
    ratingCount: 31,
    quotedPriceLkr: 7500,
    message: 'PPR and PVC piping specialist. Fast response in Kelaniya, leak-free thermal weld joints, and booster pump connection testing.',
    status: 'submitted',
    jobTitle: 'Overhead tank piping overhaul & booster pump connection',
    categoryId: 'Plumbing',
    addressText: 'Wedamulla, Kelaniya',
  },
  {
    jobId: 'job-kelaniya-water-line',
    workerId: DONALD_UID,
    workerName: 'Donald',
    ratingAvg: 4.9,
    ratingCount: 28,
    quotedPriceLkr: 7000,
    message: 'Can overhaul the overhead tank line, install bypass check valves, and wire the water level sensor.',
    status: 'submitted',
    jobTitle: 'Overhead tank piping overhaul & booster pump connection',
    categoryId: 'Plumbing',
    addressText: 'Wedamulla, Kelaniya',
  },
  {
    jobId: 'job-negombo-inverter-ac',
    workerId: 'worker-colombo-ac-1',
    workerName: 'Dinesh Perera',
    ratingAvg: 4.9,
    ratingCount: 41,
    quotedPriceLkr: 7500,
    message: 'Full chemical coil wash with high pressure spray, vacuum drainage line, and R32 pressure top-up.',
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
    message: 'Traditional stone retaining wall with 3-inch PVC weep holes every 5 feet and gravel backfill.',
    status: 'submitted',
    jobTitle: 'Construct 20ft low stone retaining wall for garden terrace',
    categoryId: 'Masonry',
    addressText: 'Peradeniya Road, Kandy',
  },
  {
    jobId: 'job-galle-exterior-paint',
    workerId: 'worker-colombo-painter-1',
    workerName: 'Jude Fernando',
    ratingAvg: 4.7,
    ratingCount: 28,
    quotedPriceLkr: 42000,
    message: 'Coastal weather-shield coating with fungicide treatment for humid sea spray environment.',
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
];

// 5. Active Chat Channels and Historical Message Threads for Donald
const SEED_CHATS = [
  {
    jobId: 'job-colombo-donald-assigned-plumbing',
    jobTitle: 'Emergency bathroom pipe burst & pressure pump overhaul',
    jobStatus: 'assigned',
    clientId: 'client-demo-1',
    workerId: DONALD_UID,
    participants: ['client-demo-1', DONALD_UID],
    clientInfo: {
      name: 'Nimal Senanayake',
      phone: '+94771234567',
    },
    workerInfo: {
      name: 'Donald',
      phone: '+94777123456',
      trade: 'Master Plumber',
    },
    lastMessage: 'Great Donald, please call me as soon as you reach the entrance gate.',
    lastAt: new Date(Date.now() - 1800000).toISOString(),
    unreadCount: 0,
    messages: [
      {
        id: 'msg_1',
        senderId: 'client-demo-1',
        text: 'Hi Donald, thank you for accepting the emergency repair job so quickly!',
        createdAt: new Date(Date.now() - 7200000),
      },
      {
        id: 'msg_2',
        senderId: DONALD_UID,
        text: 'Hello Mr. Senanayake! I have packed the PPR pipes, pressure testing gauge, and union joints. I can reach your residence by 8:45 AM tomorrow.',
        createdAt: new Date(Date.now() - 3600000),
      },
      {
        id: 'msg_3',
        senderId: 'client-demo-1',
        text: 'Great Donald, please call me as soon as you reach the entrance gate.',
        createdAt: new Date(Date.now() - 1800000),
      },
    ],
  },
  {
    jobId: 'job-colombo-donald-inprogress-electrical',
    jobTitle: 'Main distribution board rewiring & surge protector installation',
    jobStatus: 'in_progress',
    clientId: 'client-demo-2',
    workerId: DONALD_UID,
    participants: ['client-demo-2', DONALD_UID],
    clientInfo: {
      name: 'Anushka Perera',
      phone: '+94778901234',
    },
    workerInfo: {
      name: 'Donald',
      phone: '+94777123456',
      trade: 'Master Electrician',
    },
    lastMessage: 'Power is switched off at the main breaker. Proceeding with the wiring.',
    lastAt: new Date(Date.now() - 1200000).toISOString(),
    unreadCount: 0,
    messages: [
      {
        id: 'msg_1',
        senderId: 'client-demo-2',
        text: 'Hi Donald, the electrical box is in the utility room right next to the garage.',
        createdAt: new Date(Date.now() - 10800000),
      },
      {
        id: 'msg_2',
        senderId: DONALD_UID,
        text: 'Understood. I have tested the load distribution and isolated the damaged neutral line.',
        createdAt: new Date(Date.now() - 7200000),
      },
      {
        id: 'msg_3',
        senderId: DONALD_UID,
        text: 'Power is switched off at the main breaker. Proceeding with the wiring.',
        createdAt: new Date(Date.now() - 3600000),
      },
      {
        id: 'msg_4',
        senderId: 'client-demo-2',
        text: 'Sounds great, take your time and stay safe!',
        createdAt: new Date(Date.now() - 1200000),
      },
    ],
  },
];

// 6. Verified Reviews & Ratings for Donald
const SEED_REVIEWS = [
  {
    id: 'review_donald_1',
    jobId: 'job-colombo-donald-completed-roofing',
    rateeId: DONALD_UID,
    rateeName: 'Donald',
    raterId: 'client-demo-4',
    raterName: 'Kavinda Jayasuriya',
    stars: 5,
    text: 'Donald did an outstanding job repairing our roof valley leak. Punctual, honest with material costs, and left the work area spotlessly clean.',
  },
  {
    id: 'review_donald_2',
    jobId: 'job-colombo-donald-assigned-plumbing',
    rateeId: DONALD_UID,
    rateeName: 'Donald',
    raterId: 'client-demo-3',
    raterName: 'Dilshan Silva',
    stars: 5,
    text: 'Very knowledgeable and friendly tradesperson. Solved our water pump electrical trip issue in under an hour. Highly recommended!',
  },
];

// Helper: Save a document to Cloud Firestore using REST API
async function saveDoc(collectionPath, docId, data, accessToken) {
  const url = `${FIRESTORE_BASE_URL}/${collectionPath}/${docId}`;
  const now = new Date();
  const payload = {
    fields: toFirestoreFields({
      ...data,
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now,
    }),
  };

  const resp = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Failed to save ${collectionPath}/${docId}: ${resp.status} - ${errText}`);
  }
}

// Update the applicationCount field on an existing job document
async function updateJobApplicationCount(jobId, count, accessToken) {
  const url = `${FIRESTORE_BASE_URL}/jobs/${jobId}?updateMask.fieldPaths=applicationCount`;
  const payload = {
    fields: {
      applicationCount: { integerValue: count.toString() },
    },
  };

  const resp = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    console.warn(`Could not update applicationCount on ${jobId}: ${resp.status}`);
  }
}

// Update city and address on an existing job document
async function updateJobCityAndAddress(jobId, city, addressText, geo, accessToken) {
  const url = `${FIRESTORE_BASE_URL}/jobs/${jobId}?updateMask.fieldPaths=city&updateMask.fieldPaths=addressText&updateMask.fieldPaths=geo`;
  const payload = {
    fields: {
      city: { stringValue: city },
      addressText: { stringValue: addressText },
      geo: {
        mapValue: {
          fields: {
            lat: { doubleValue: geo.lat },
            lng: { doubleValue: geo.lng },
          },
        },
      },
    },
  };

  const resp = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    console.warn(`Could not update city/address on ${jobId}: ${resp.status} - ${errText}`);
  }
}

// Main execution function
async function run() {
  console.log(`\n======================================================`);
  console.log(`🚀 Seeding LinkWorks Live Cloud Firestore ('${PROJECT_ID}')`);
  console.log(`======================================================\n`);

  // 1. Authenticate with developer session
  const account = auth.getGlobalDefaultAccount();
  if (!account) {
    throw new Error('No active Firebase account found. Please run "firebase login" first.');
  }
  console.log(`Authenticated as: ${account.user?.email}`);
  const tokenObj = await auth.getAccessToken(account.tokens?.refresh_token, api.getScopes());
  const accessToken = tokenObj?.access_token || tokenObj?.accessToken;
  if (!accessToken) {
    throw new Error('Failed to retrieve Google OAuth2 access token.');
  }

  // 2. Seed / Update Donald's Worker Profile & Account for rich presentation mode
  console.log(`\n👑 Updating Donald's Worker Profile & Account (${DONALD_UID})...`);
  await saveDoc(
    'workerProfiles',
    DONALD_UID,
    {
      userId: DONALD_UID,
      displayName: 'Donald',
      city: 'Colombo',
      skills: ['Masonry', 'Plumbing', 'Electrical', 'Aluminum', 'Roofing'],
      bio: 'Master tradesperson with 8+ years experience in domestic plumbing, electrical diagnostics, brick masonry, and roof waterproofing across Greater Colombo.',
      experienceYears: 8,
      dayRateLkr: 5000,
      base: { lat: 6.9271, lng: 79.8612, geohash: 'tc0z3m11k' },
      serviceRadiusKm: 25,
      portfolio: [],
      isAvailable: true,
      ratingAvg: 4.9,
      ratingCount: 28,
      jobsCompleted: 34,
    },
    accessToken
  );
  await saveDoc(
    'users',
    DONALD_UID,
    {
      name: 'Donald',
      phone: '+94777123456',
      city: 'Colombo',
      isWorker: true,
      isClient: true,
      activeRole: 'worker',
    },
    accessToken
  );
  console.log(`   ✓ Donald updated with 4.9 ★ rating, 5 trade skills, and active worker role`);

  // 3. Seed Other Skilled Workers
  console.log(`\n👷 Writing ${SEED_WORKERS.length} Other Worker Profiles & Accounts...`);
  for (const worker of SEED_WORKERS) {
    const { phone, ...profileData } = worker;
    await saveDoc('workerProfiles', worker.userId, profileData, accessToken);
    await saveDoc(
      'users',
      worker.userId,
      {
        name: worker.displayName,
        phone: worker.phone,
        city: worker.city,
        isWorker: true,
        isClient: false,
        activeRole: 'worker',
      },
      accessToken
    );
    console.log(`   ✓ [${worker.city}] ${worker.displayName} (${worker.skills.join(', ')})`);
  }

  // 4. Seed Demo Client Accounts
  console.log(`\n👤 Writing ${SEED_CLIENTS.length} Demo Client Accounts...`);
  for (const client of SEED_CLIENTS) {
    const { userId, ...clientData } = client;
    await saveDoc('users', userId, clientData, accessToken);
    console.log(`   ✓ [Client] ${client.name} (${client.phone})`);
  }

  // 5. Seed Marketplace Jobs (Open & Assigned)
  console.log(`\n📋 Writing ${SEED_JOBS.length} Marketplace Jobs (Worker Feed & Details)...`);
  for (const job of SEED_JOBS) {
    const { id, ...jobData } = job;
    await saveDoc('jobs', id, jobData, accessToken);
    console.log(`   ✓ [${job.status.toUpperCase()} | ${job.categoryId}] ${job.title.substring(0, 45)}...`);
  }

  // 6. Seed Quotes / Applications (Including Donald's Submitted and Accepted Quotes)
  console.log(`\n💬 Writing ${SEED_QUOTES.length} Job Quotes (Applications)...`);
  for (const quote of SEED_QUOTES) {
    const { jobId, workerId, ...quoteData } = quote;
    await saveDoc(`jobs/${jobId}/applications`, workerId, { workerId, ...quoteData }, accessToken);
    console.log(`   ✓ [${quote.status.toUpperCase()}] Rs. ${quote.quotedPriceLkr.toLocaleString()} on '${quote.jobTitle.substring(0, 28)}...' by ${quote.workerName}`);
  }

  // Update city on 6yVS194jap9787NtwDZJ to Kelaniya
  await updateJobCityAndAddress('6yVS194jap9787NtwDZJ', 'Kelaniya', 'Kelani handiya, Kelaniya', CITY_CENTERS.Kelaniya, accessToken);

  // Update application counts on jobs
  await updateJobApplicationCount('6yVS194jap9787NtwDZJ', 3, accessToken);
  await updateJobApplicationCount('job-colombo-kitchen-pipe', 2, accessToken);
  await updateJobApplicationCount('job-colombo-bathroom-booster', 2, accessToken);
  await updateJobApplicationCount('job-colombo-trip-breaker', 2, accessToken);
  await updateJobApplicationCount('job-colombo-roof-gutters', 2, accessToken);
  await updateJobApplicationCount('job-colombo-boundary-wall', 2, accessToken);
  await updateJobApplicationCount('job-kelaniya-teak-door', 2, accessToken);
  await updateJobApplicationCount('job-kelaniya-brick-wall', 2, accessToken);
  await updateJobApplicationCount('job-kelaniya-water-line', 2, accessToken);

  // 7. Seed Real-Time Chat Channels & Message Threads
  console.log(`\n💬 Writing ${SEED_CHATS.length} Chat Channels and Message Threads...`);
  for (const chat of SEED_CHATS) {
    const { jobId, messages, ...chatHeader } = chat;
    await saveDoc('chats', jobId, { jobId, ...chatHeader }, accessToken);
    for (const msg of messages) {
      const { id, ...msgData } = msg;
      await saveDoc(`chats/${jobId}/messages`, id, msgData, accessToken);
    }
    console.log(`   ✓ Chat on '${chat.jobTitle.substring(0, 32)}...' with ${messages.length} messages`);
  }

  // 8. Seed Verified Customer Reviews
  console.log(`\n⭐ Writing ${SEED_REVIEWS.length} Verified Customer Reviews...`);
  for (const rev of SEED_REVIEWS) {
    const { id, ...revData } = rev;
    await saveDoc('reviews', id, revData, accessToken);
    console.log(`   ✓ ${rev.stars}★ review for ${rev.rateeName} by ${rev.raterName}`);
  }

  console.log(`\n======================================================`);
  console.log(`🎉 LIVE SEEDING COMPLETE FOR WORKER & CLIENT MODES!`);
  console.log(`   - 13 Skilled Workers registered (including Donald with 4.9★ rating)`);
  console.log(`   - 5 Demo Clients registered with contact telephone lines`);
  console.log(`   - ${SEED_JOBS.length} Jobs active (Open feeds, Assigned, In-Progress, Completed)`);
  console.log(`   - ${SEED_QUOTES.length} Quotes / Applications (Submitted & Hired states)`);
  console.log(`   - ${SEED_CHATS.length} Real-Time Chat Channels with message histories`);
  console.log(`   - ${SEED_REVIEWS.length} Verified 5-Star Reviews`);
  console.log(`======================================================\n`);
}

run().catch((err) => {
  console.error('\n❌ Seeding failed:', err);
  process.exit(1);
});
