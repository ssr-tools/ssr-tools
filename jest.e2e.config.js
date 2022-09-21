// @ts-check

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "jest-puppeteer",
  testMatch: ["<rootDir>/examples/**/*.e2e.ts?(x)"],
  modulePathIgnorePatterns: ["/dist/"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  maxWorkers: 1,
  maxConcurrency: 1,
};
