const baseConfig = require('@repo/jest-config');

module.exports = {
  ...baseConfig,
  setupFilesAfterEnv: ['./src/test/setup.ts'],
};
