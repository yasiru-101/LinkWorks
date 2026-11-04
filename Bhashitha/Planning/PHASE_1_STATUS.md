# Phase 1 verification status

Phase 1 implementation is in the workspace, but the Android acceptance gate is still open. Do not mark Phase 1 complete until the device checks below pass.

## Completed and verified

- Private account, public worker profile, job, and application Firestore rules pass allowed and denied operation tests in the local Firestore emulator. The test also confirms a signed-in client can read a geohash-filtered public worker projection without a phone number. Run from `mobile/`: `firebase emulators:exec --only firestore --project demo-linkworks-rules "node ../Chanuli/Backend/rules.test.mjs"`.
- Geohash/distance/availability and job validation/transition unit checks pass with `node --experimental-strip-types` in their owner feature folders.
- `npx tsc --noEmit`, `npx expo lint`, and `npx expo export --platform android --output-dir .expo/phase1-export` pass in `mobile/`.
- Android emulator `LinkWorks_Dev` boots and the development client launch intent succeeds.

## Android acceptance checks still required

1. Configure fictional Firebase Authentication test phone number and code in the intended Firebase project, then run phone entry, confirmation, and profile save on the development build.
2. Restart the app and confirm the private account reloads from Firestore, including the persisted active role.
3. For an account with both roles, save worker skills, base city, radius, rate, and availability; then switch roles and visually confirm the four correct tabs in each role.
4. Sign out and try a protected route. Confirm it opens the public entry flow.

The current emulator showed repeated **System UI isn't responding** dialogs during this session, so no in-app Android claim was recorded. Inspect emulator memory/graphics and retry the device gate on a healthy emulator or physical Android phone. There was no verified fictional test phone/code available in this session.

## Project configuration to confirm

- Confirm that the Firebase project, Android package, SHA certificates, and `google-services.json` belong to the intended test environment. Do not place credentials in this note.
- Confirm required Firestore composite indexes before Phase 2 discovery. The Phase 1 query proof uses a single-field geohash order, so it does not prove the later combined availability/category queries.
- The Functions package is an initialization skeleton; trusted assignment/counters/chat are Phase 3 work. Keep these paths closed in rules until the functions and tests are ready.

No GitHub push was performed. This status note is ignored by Git through Bhashitha's folder.
