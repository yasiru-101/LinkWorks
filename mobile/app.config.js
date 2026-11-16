/**
 * LinkWorks Expo Dynamic Application Configuration
 * 
 * Owned by: Yasiru (Phone authentication, Firebase setup & app configuration)
 * 
 * Injects environment-specific credentials and Google Play Services configuration:
 * 1. Checks for local or CI-provided `google-services.json` file path.
 * 2. Bridges native Firebase credentials into Expo Android build configuration.
 */

const { existsSync } = require('node:fs');
const { join } = require('node:path');

// Dynamically configure native build settings including Firebase Google Services on Android
module.exports = ({ config }) => {
  const localFirebaseFile = join(__dirname, 'google-services.json');
  const googleServicesFile =
    process.env.GOOGLE_SERVICES_JSON ||
    (existsSync(localFirebaseFile) ? localFirebaseFile : undefined);

  return {
    ...config,
    android: {
      ...config.android,
      ...(googleServicesFile ? { googleServicesFile } : {}),
    },
  };
};
