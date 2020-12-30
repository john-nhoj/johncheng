import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '**/src/**/*.{ts,tsx}',
    '!**/src/pages/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/aws/**',
    '!**/.next/**',
  ],
  roots: ['src'],
  moduleNameMapper: {
    '^(components/.+)$': '<rootDir>/src/$1/',
  },
};
export default config;
