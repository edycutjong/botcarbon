import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverage: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/lib/**/*.{js,jsx,ts,tsx}',
    'src/components/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageReporters: ['json-summary', 'text', 'lcov'],
};

export default createJestConfig(config);
