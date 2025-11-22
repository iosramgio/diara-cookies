export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.jsx', // exclude main entry file
    '!src/App.jsx',  // exclude main app component for now
  ],
  coverageDirectory: '../coverage',
  testTimeout: 15000,
};