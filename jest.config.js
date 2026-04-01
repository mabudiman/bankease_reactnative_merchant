module.exports = {
  preset: "jest-expo",
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.github/skills/",
  ],
  moduleNameMapper: {
    "^msw/node$": "<rootDir>/node_modules/msw/lib/node/index.js",
    "\\.svg$": "<rootDir>/__mocks__/svgMock.js",
    "^@react-native-async-storage/async-storage$": "<rootDir>/node_modules/@react-native-async-storage/async-storage/jest/async-storage-mock",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(.pnpm/[^/]+/node_modules/)?(((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-ng/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|msw|until-async))",
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  coverageReporters: ["lcov", "text", "text-summary"],
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "features/**/*.{ts,tsx}",
    "core/**/*.{ts,tsx}",
    "utils/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/__tests__/**",
  ],
};
