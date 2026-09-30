# LinkWorks mobile app

React Native and Expo project for the LinkWorks Android app. The Android application ID is `com.linkworks.linkworks`.

## Firebase setup

1. Create a Firebase project in the Firebase Console.
2. Select the existing Android app with package name `com.linkworks.linkworks`.
3. Download its `google-services.json` file into this `mobile` directory. The path must be `mobile/google-services.json`, matching `app.json`.
4. Add an Apple app to the same Firebase project with bundle ID `com.linkworks.linkworks`, then download `GoogleService-Info.plist` into this `mobile` directory.
5. Enable Authentication, then enable the Phone sign-in provider. Add Firebase test phone numbers for development.
6. Create a Cloud Firestore database. Define and test security rules before storing real user data.
7. Add the Android build's SHA-1 and SHA-256 signing fingerprints in Firebase project settings before testing real Phone Auth. The fingerprints depend on how the development build is signed.

The project uses React Native Firebase, so it requires an [Expo development build](https://docs.expo.dev/develop/development-builds/introduction/). Expo Go cannot load these native modules.

The current screen requests a phone code, signs in, and saves `users/{uid}` with name, city, phone number, and client/worker roles. It reads the document back from the Firestore server to confirm the write. Add a test phone number and six-digit code in Firebase Authentication for initial testing. The Firestore rules for this profile are in `firestore.rules`; review and deploy them to the `linkworks-c6a21` project before testing the write. Firebase rules already deployed in the console are not changed by this repository alone.

`google-services.json` stays on each developer's computer and is ignored by Git. `app.config.js` uses that local file when present. For future EAS cloud builds, add it as a secret file variable named `GOOGLE_SERVICES_JSON` in the Expo project's **development** environment; the build runner will then supply the file path to `app.config.js`. That EAS variable has not been configured yet.

## Local checks

```bash
npm install
npx tsc --noEmit
npx expo lint
```

An Android Expo cloud development build is configured in `eas.json`. Install the development APK on an Android device, then start Metro with `npx expo start --dev-client` from this directory. Use `--tunnel` if the device cannot reach the computer on the local network. Open the URL or scan the QR code in the installed development app.

The product scope and four-week plan are in `../LinkWorks_React_Native_Project_Plan.docx`.
