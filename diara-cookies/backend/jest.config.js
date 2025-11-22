export default {
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.(js|ts)$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)$',
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/index.js', // exclude main server file
  ],
  coverageDirectory: '../coverage',
  testTimeout: 15000,
};