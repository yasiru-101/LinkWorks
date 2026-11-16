/**
 * Metro Bundler Configuration for LinkWorks
 * 
 * Configures React Native / Expo asset and module resolution:
 * 1. Watches parent root workspace folders (`Yasiru/`, `Pasindu/`, `Thimanya/`, `Chanuli/`, `Bhashitha/`).
 * 2. Resolves shared packages strictly from `mobile/node_modules`.
 * 3. Enforces single-instance React resolution to prevent multiple React copy runtime conflicts.
 */

const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');

// Owner feature folders sit beside mobile, while their dependencies live in mobile/node_modules.
const config = getDefaultConfig(__dirname);
config.watchFolders = [path.resolve(__dirname, '..')];
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')];

// TypeScript maps React imports to declarations; Metro must still load runtime React.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react' || moduleName.startsWith('react/')) {
    return { type: 'sourceFile', filePath: require.resolve(moduleName, { paths: [__dirname] }) };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
