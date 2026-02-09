const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Configure resolver to handle .js extensions from ES modules
config.resolver.sourceExts.push('cjs');

// Ensure unstable_enablePackageExports is enabled
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
