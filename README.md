# LinkWorks 🛠️🇱🇰

> **Hyperlocal On-Demand Tradesperson Marketplace & Job Matching Platform for Sri Lanka**

[![React Native](https://img.shields.io/badge/React_Native-0.86-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo_SDK-52-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore_%7C_Auth-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📖 Overview

**LinkWorks** is a production-ready, full-stack mobile application engineered to bridge the gap between household clients and verified, skilled local tradespeople across Sri Lanka. Whether a homeowner needs an emergency plumber in Colombo or a skilled carpenter in Kandy, LinkWorks enables fast discovery, transparent quote comparison, real-time consultation, and reliable job completion tracking.

The platform provides a unified dual-role ecosystem: any user can post jobs as a **Client** or register their trade skills and receive nearby job leads as a **Worker**.

---

## ✨ Key Features

### 📱 1. Phone Authentication & Role Context
* **Instant Mobile Sign-In:** Seamless SMS OTP authentication tailored for Sri Lankan phone numbers (`+94`), backed by Firebase Auth.
* **Dual-Role Switching:** One account supports both hiring and working; switch between **Client** and **Worker** modes with a single tap in settings.
* **Persistent Profiles:** Comprehensive profile setup capturing personal details, trade specialties, experience years, base service cities, and coverage radius.

### 📍 2. Hyperlocal Worker Discovery & Radar View
* **Proximity Sorting:** Distance calculation using geospatial coordinate formulas and geohashing algorithms to surface nearby verified pros.
* **Radar & Map Visualization:** Interactive radar view visualizing tradespeople around the user's current GPS location or selected hub city.
* **Trade Filtering:** Quick filtering across popular trades including Carpentry, Plumbing, Electrical, Masonry, Painting, Gardening, Appliance Repair, and Roofing.
* **Island-Wide Hub Coverage:** Full fallback coverage for major Sri Lankan cities: Colombo, Kandy, Galle, Gampaha, Negombo, and Moratuwa.

### 💼 3. Job Engine & Quote Marketplace
* **Client Job Posting:** Post jobs with trade category chips, task descriptions, budget ranges (in LKR), preferred timing, and landmark addresses.
* **Worker Job Feed:** Real-time feed of matching open jobs filtered strictly within the worker's trade category and configured service radius (5 km – 50 km).
* **Side-by-Side Quotes:** Workers submit itemized price quotes and pitches; clients compare quotes side by side before awarding the job.
* **Job Lifecycle Management:** Complete state machine tracking:  
  `Open` ➔ `Assigned` ➔ `In Progress` ➔ `Completed` (or `Cancelled`).

### 💬 4. Real-Time Chat & Direct Consultation
* **Direct Worker Messaging:** Inquire directly with any tradesperson from their public profile (`💬 Message Worker`) to discuss scope and availability before posting a job.
* **Job Conversation Rooms:** Dedicated, encrypted chat rooms automatically unlocked upon job assignment.
* **Real-Time Synchronization:** Cloud Firestore `onSnapshot` listeners deliver instant messaging, photo attachments, and direct telephone dialing.

### ⭐ 5. Trust, Reviews & Moderation
* **Verified Reviews:** Rating and review creation strictly gated until after a job is marked `Completed` by the hiring client.
* **Moderation & Reporting:** In-app reporting tools allow users to flag suspicious accounts or policy violations for administrative review.
* **System-Aware UI:** Custom LinkWorks design system with Plus Jakarta Sans typography, elevated bottom navigation, and full edge-to-edge support for Android hardware navigation bars.

---

## 🏗️ Architecture & Module Ownership

The project follows a clean, modular ownership architecture adhering to strict group member domains:

```
LinkWorks/
├── Yasiru/            # 👤 Member 1: Phone Auth, Onboarding, Role Context, Account Settings
│   ├── Auth/          # Firebase Auth, OTP verification, AuthContext session state
│   ├── Settings/      # Mode switching, profile management, legal disclosures
│   └── WorkerSetup/   # Trade category selection, rates, experience, coverage radius
│
├── Pasindu/           # 🔍 Member 2: Discovery, Location Service, Geohashing & Profiles
│   └── Discovery/     # Distance algorithms, search center, worker profiles, radar map
│
├── Thimanya/          # 📋 Member 3: Job Engine, Matching Feed, Quotes & Applications
│   ├── Applications/  # Quote submission modals and worker quote tracking
│   ├── Jobs/          # Job posting, nearby feed, client job detail, status transitions
│   └── JobContracts/  # Job state validation contracts and unit tests
│
├── Chanuli/           # 💬 Member 4: Real-Time Chat, Messaging & Cloud Security
│   ├── Chat/          # Conversations list, real-time message thread, photo attachments
│   └── Backend/       # Firestore security rules and backend validation tests
│
├── Bhashitha/         # 🎨 Member 5: Design System, Navigation, Reviews & Moderation
│   ├── Design/        # Theme palette, category chips, cards, modals, primitives
│   ├── Navigation/    # Role-aware bottom tab bar with dynamic hardware insets
│   ├── Reviews/       # Verified star ratings and review submission modals
│   ├── Moderation/    # Policy reporting dialogs and blocklist verification
│   └── Seed/          # Live Firestore database seed runners
│
└── mobile/            # 📱 Application Shell (Expo Router, App Config, Assets)
    ├── assets/        # Plus Jakarta Sans static fonts, splash screens, brand icons
    ├── firestore.rules# Cloud Firestore security rules
    └── src/app/       # File-based routes (Expo Router v4)
```

---

## 🛠️ Tech Stack

| Domain | Technology |
|---|---|
| **Framework** | [React Native](https://reactnative.dev/) 0.86 with [Expo SDK](https://expo.dev/) 52 |
| **Routing** | [Expo Router](https://docs.expo.dev/router/introduction/) v4 (file-based navigation) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) 5.x |
| **Authentication** | [Firebase Authentication](https://firebase.google.com/docs/auth) (Native Phone OTP) |
| **Database** | [Cloud Firestore](https://firebase.google.com/docs/firestore) (Real-Time NoSQL) |
| **Storage** | [Cloud Storage for Firebase](https://firebase.google.com/docs/storage) |
| **UI & Styling** | Custom LinkWorks design tokens, Plus Jakarta Sans, Safe Area Insets |
| **Code Quality** | ESLint (`expo lint`), TypeScript strict type checking |

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* [Expo Go](https://expo.dev/client) app installed on your physical device, or an Android Emulator / iOS Simulator
* A configured [Firebase](https://firebase.google.com/) project with Phone Auth and Firestore enabled

### 1. Clone the Repository
```bash
git clone https://github.com/yasiru-101/LinkWorks.git
cd LinkWorks
```

### 2. Install Dependencies
```bash
cd mobile
npm install
```

### 3. Start the Development Server
```bash
npm start
```

* **To run on Android:** Press `a` in the terminal or run `npm run android`
* **To run on iOS:** Press `i` in the terminal or run `npm run ios`
* **To scan with physical device:** Open the Expo Go app and scan the terminal QR code

---

## 🧪 Testing & Verification

Run the validation test suites from the project root:

```bash
# 1. Typecheck the mobile TypeScript codebase
cd mobile
npx tsc --noEmit

# 2. Run Expo linter
npm run lint

# 3. Run domain contract unit tests
node ../Pasindu/Discovery/geo.test.mjs
node ../Thimanya/JobContracts/validation.test.mjs
node ../Bhashitha/Moderation/blocklist.test.mjs
```

---

## 🔒 Security & Firestore Rules

LinkWorks enforces strict security rules ([mobile/firestore.rules](mobile/firestore.rules)):
* **Users:** Accounts are strictly read-only to strangers and editable only by their authenticated owner.
* **Jobs:** Clients own their jobs; workers can only browse open jobs and submit quotes matching their registered trade.
* **Chats:** Room access is strictly restricted to the 2 registered participants (`participants.size() == 2`).
* **Reviews:** Review creation requires an authenticated client with an existing job in `completed` status matching the rated worker.

To deploy rules to Firebase:
```bash
cd mobile
npx firebase-tools deploy --only firestore:rules --project linkworks-c6a21
```

---

## 👥 Contributors

Developed as part of the **Year 02 Semester 02 Mobile Application Development** curriculum:

* **Yasiru** — *Authentication, Onboarding, Worker Setup, Role Context & Account Settings*
* **Pasindu** — *Categories, Location Services, Geohashing, Nearby Discovery & Worker Profiles*
* **Thimanya** — *Job Engine, Matching Feed, Quotes, Applications & Job Lifecycle*
* **Chanuli** — *Real-Time Job Chat, Messaging UI, Backend Security Rules & Cloud Functions*
* **Bhashitha** — *Design System, Brand Theme, Navigation Shell, Reviews & Moderation*

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
