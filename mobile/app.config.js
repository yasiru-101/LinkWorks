const { existsSync } = require('node:fs');
const { join } = require('node:path');

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
