/**
 * LinkWorks Static Code Analysis Configuration (ESLint Flat Config)
 * 
 * Owned by: Bhashitha (Integration & QA tooling)
 * 
 * Configures ESLint using Expo's flat config preset for code cleanliness and consistency.
 */

const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  }
]);
