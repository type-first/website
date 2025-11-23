/**
 * Jest Configuration for Typescape Tests
 * 
 * Specific configuration for testing typescape navigation and
 * TypeScript error state management issues.
 */

module.exports = {
  displayName: 'Typescape Integration Tests',
  testMatch: [
    '**/__tests__/typescape-*.test.{js,jsx,ts,tsx}'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.typescape.js'
  ],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['@swc/jest', {
      jsc: {
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    }],
  },
  collectCoverageFrom: [
    'app/typescape/**/*.{js,jsx,ts,tsx}',
    'modules/playground/**/*.{js,jsx,ts,tsx}',
    'content/typescape/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 10000,
  maxWorkers: 1, // Run sequentially to avoid state conflicts
}