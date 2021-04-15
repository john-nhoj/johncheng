import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '**/src/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/src/pages/**/*.{ts,tsx}',
    '!**/src/api/*.ts',
  ],
  roots: ['src'],
  moduleNameMapper: {
    '^(components/.+)$': '<rootDir>/src/$1/',
    '^(styles/.+)$': '<rootDir>/src/$1/',
  },
};
export default config;
