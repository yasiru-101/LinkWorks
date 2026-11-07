# LinkWorks: four-phase implementation plan

**Owner:** Bhashitha, integration lead  
**Target:** Android demonstration of the client-to-worker job journey  
**Plan status:** Proposed execution plan; check each gate against the running app before moving on  
**Source of truth:** `PROJECT_IMPLEMENTATION_PLAN.md`, the five member briefs, and `mobile/src/types/domain.ts`

## Goal and current position

A client opens LinkWorks and sees nearby available workers. A worker opens the Feed and sees nearby open jobs matching their skills and service area. The client can post a job; a worker can submit a priced quote; the client assigns exactly one worker; the two participants can chat, complete the work, and review it.

The repository currently has an Expo/React Native foundation, a designed welcome screen, an Android phone OTP and profile save/read-back prototype, a draft domain contract, and Firestore rules for private `users/{uid}` documents. The Android development app has displayed the welcome screen. OTP/profile persistence on device, location, the two nearby feeds, marketplace transactions, chat, notifications, reviews, and the remaining security rules are not yet verified or implemented. The current Terms screen is a placeholder.

Use these four phases in order. Owners may work on separate files during a phase, but a phase closes only when its shared gate passes. Record evidence and open defects in Bhashitha's integration notes. Use feature folders under each person's root folder for new member-owned files; keep Expo Router routes and required configuration at their framework paths. Add plain-language comments to meaningful code blocks.

## Phase 1 — secure foundation, accounts, and app shell

**Outcome:** A new Android user can sign in, complete their profile, choose a role, and reach the correct protected tabs. The Firebase contract is safe enough for feature work.

| Owner | Work to complete |
| --- | --- |
| Yasiru | Confirm Firebase Phone Auth test-number setup and demonstrate OTP on the development build. Split the current phone/profile prototype into phone entry, code confirmation, and profile setup with resend, loading, and error states. Provide one auth/role context with `user`, profile, `activeRole`, loading, role switch, and sign-out. Save and reload a private account with at least one role. Define worker setup fields with Pasindu. |
| Pasindu | Agree with Yasiru on the public worker projection, categories, saved service base, service radius, availability, and safe display fields. Define the foreground location state, manual-city fallback, geohash query strategy, radius defaults, and required Firestore indexes. Prove one nearby worker query against test data. |
| Thimanya | Finalize job, application, quote, budget, location, and status fields with Chanuli. Specify which actor may make each transition and the one-worker atomic assignment operation. Prepare job form validation and the open-job write contract. |
| Chanuli | Set up the Firebase Emulator Suite and Functions skeleton. Expand Firestore rules beyond `users/{uid}` for worker profiles, categories, jobs, and applications; protect counters and private phone data. Draft Storage rules for future images. Add both allowed and denied rule tests. Confirm deployment target and configuration without exposing credentials. |
| Bhashitha | Finalize screen map, common design tokens and components, loading/empty/error patterns, and protected Expo Router layouts. Build client tabs `Home / My Jobs / Chats / Profile` and worker tabs `Feed / Applications / Chats / Profile`. Create development-only seed structure and a shared review checklist. |

**Integration order:** settle `domain.ts` and security ownership first; then auth context; then protected tabs and profile setup; then initial Firestore/emulator tests. Keep shared schema, rules, seed data, and Functions in sync.

**Phase 1 gate**

- [ ] On Android, a fictional test number completes OTP, saves a user profile, restarts, and reloads that profile from Firestore.
- [ ] A user with both roles can switch role and sees the correct four tabs; signed-out users cannot enter protected screens.
- [ ] Worker setup records skills, base location, service radius, rate, and availability using the agreed schema.
- [ ] Firestore emulator tests reject strangers reading private accounts and reject unauthorized writes to protected worker/job fields.
- [ ] `npx tsc --noEmit` and `npx expo lint` pass in `mobile/`.

## Phase 2 — automatic nearby discovery and job posting

**Outcome:** Both roles see useful nearby results as soon as their home screen opens, and clients can post and reopen an open job.

| Owner | Work to complete |
| --- | --- |
| Yasiru | Finish worker profile editing for skills, bio, rate, service base/radius, availability, and portfolio fields. Let users edit city and role preferences without exposing private account fields to public queries. |
| Pasindu | Build a shared foreground location/search-center service. On client Home entry, request foreground permission with context, get a current fix, and automatically load nearby available workers sorted by exact distance. Add category/search/rating/rate/radius filters and worker detail. Provide a selected-city fallback when permission is denied, services are off, or the fix times out. Show current search area, radius, distance, loading, empty, error, and retry states. Refresh on pull-to-refresh and foreground return. |
| Thimanya | Build job posting with title, category, description, integer LKR budget, preferred date, address and deliberate job location selection. Store job coordinates plus geohash and initial `open` status. Build My Jobs and job detail. On worker Feed entry, automatically load nearby `open` jobs using Pasindu's search center, with the saved service base/city fallback. Keep only jobs matching worker skills, selected feed radius, and the worker's saved service area; sort by distance. |
| Chanuli | Add and test rules/indexes for public worker discovery and open-job reads without exposing private phone data. Ensure job creation/edit permissions are limited to the client and trusted fields cannot be changed by the app. Prepare any backend-maintained application count. |
| Bhashitha | Seed realistic fictional categories, workers, and open jobs across multiple cities. Integrate client Home, worker Feed, job form, and worker detail with shared components. Check distance labels, empty states, permission prompts, and visual consistency on Android. |

**Location rule:** use geohash bounds to fetch candidates, then exact distance filtering. The foreground location is a search center, not a stored tracking trail. Only save a worker's chosen service base and a client's chosen job location. A city choice must map to a documented search center. A map is optional; the distance-sorted lists and city fallback are required.

**Phase 2 gate**

- [ ] Opening client Home shows nearby available workers without typing a search; changing city or radius changes the results and distances.
- [ ] Opening worker Feed shows nearby open, skill-matched jobs without typing a search; jobs outside the saved service area are excluded.
- [ ] Both feeds remain usable with location permission denied, services off, or a location timeout through manual city selection.
- [ ] A client posts an open job, restarts the app, and sees the same job in My Jobs.
- [ ] Distance/geohash, availability, skill, and service-radius matching tests pass; rules block unauthorized job edits.

## Phase 3 — quotes, assignment, chat, completion, and trust

**Outcome:** Two accounts complete the full marketplace transaction securely.

| Owner | Work to complete |
| --- | --- |
| Yasiru | Complete profile/settings, persistent role choice, avatar/portfolio error states, sign-out, and auth recovery cases. Supply participant-safe display information for assigned jobs. |
| Pasindu | Complete worker public profile, portfolio, and review display. Pass a selected worker into a prefilled job request; do not open chat before assignment. Improve search pagination and denied-location states. |
| Thimanya | Add worker quote submission with integer LKR price and pitch, My Applications, client quote comparison, and one-worker acceptance. Use the trusted atomic assignment operation so other quotes are rejected consistently. Implement `open -> assigned -> in_progress -> completed`, pre-assignment cancellation, worker completion request, and client confirmation. |
| Chanuli | Implement trusted assignment/counter logic, job-linked text chat for the assigned client and worker, real-time listeners with cleanup, unread state, and Firebase notifications for quote, assignment, and messages. Maintain application count, jobs completed, and worker rating aggregates in trusted code. Add participant-only chat and message rules. |
| Bhashitha | Add completed-job reviews with one review per participant direction and report/block UI. Extend rule tests for reviews/reports, integrate the full journey, and record screenshots and defects. |

**Transaction rules:** applications are subdocuments of jobs, not job statuses. Only the client assigns a worker. One accepted application, `assignedWorkerId`, rejected competing applications, and accepted price must become consistent together. Chat opens only after assignment. Reviews belong to completed jobs and cannot be submitted twice by the same rater. Public worker lists never expose phone numbers.

**Phase 3 gate**

- [ ] Two fictional accounts complete **post -> nearby worker Feed -> quote -> assign -> chat -> start -> client-confirmed completion -> review** on Android.
- [ ] The accepted worker, accepted price, application statuses, and job status remain consistent after restart and under simultaneous acceptance attempts.
- [ ] A stranger cannot read the chat or submit a review; a worker cannot assign themselves or alter trusted counters.
- [ ] The worker rating and completed-job count update through trusted code.
- [ ] At least quote and assignment notifications are demonstrated; record any background-delivery limitation honestly.

## Phase 4 — hardening, release evidence, and handover

**Outcome:** The Android demonstration is repeatable from clean data, safe under common failures, and ready for submission.

| Owner | Work to complete |
| --- | --- |
| Yasiru | Recheck OTP, resend, incomplete profile, role switch, restart persistence, settings, and sign-out. Document setup steps and capture auth screenshots. |
| Pasindu | Test distance accuracy, pagination, foreground refresh, manual city, permission denial, services off, and slow/failed location fixes. Improve list performance. Add a map only if both nearby lists and the full job journey are stable. |
| Thimanya | Test duplicate quote, invalid budget/price, closed job, cancellation, simultaneous assignment, offline/retry, and each permitted/denied lifecycle transition. |
| Chanuli | Test rules and Storage paths in the Firebase Emulator; verify chat privacy, listener cleanup, notification delivery, and idempotent Functions. Confirm indexes, rules, and Functions deployment to the intended test project. |
| Bhashitha | Freeze features, run the bug bash, verify accessibility and consistent loading/empty/error states, make seed data repeatable, finish release text including Terms, collect test logs/screenshots, rehearse the live demo, and keep a recorded backup. |

**Phase 4 gate / definition of done**

- [ ] TypeScript, lint, meaningful unit/component tests, Firebase rule tests, and the Android golden-path test pass.
- [ ] A clean seed produces nearby workers and jobs in the same city, and the entire demo can be repeated without manual Firestore repair.
- [ ] The app handles denied location, missing network, empty results, app restart, and sign-out with understandable UI.
- [ ] Firebase rules, indexes, Functions, and required build configuration are deployed and verified in the intended test environment.
- [ ] The final Android build and demo evidence are saved; each owner signs off on their feature and Bhashitha signs off on integration.

## Priority and scope control

The required path is: **authentication -> nearby lists for both roles -> post job -> quote -> one-worker assignment -> text chat -> completion -> review -> security and Android proof**. Do not cut this path to polish optional screens. Map view, chat images, typing indicators, advanced push behavior, and animation polish may follow only after the four phase gates pass. Payments, escrow, identity verification, a web admin portal, and an iOS store release are outside this Android submission.

Keep this planning file local. Before any GitHub push, inspect the exact staged files against the workspace ownership and GitHub boundary instructions; this file and the other personal planning notes must remain ignored.
