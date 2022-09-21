// @ts-check

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/lib/**/*.test.ts?(x)"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  modulePathIgnorePatterns: ["/dist/"],
  setupFilesAfterEnv: ["./jest.setup.ts"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  maxWorkers: 2,
  maxConcurrency: 1,
};
