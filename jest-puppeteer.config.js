// @ts-check
// https://github.com/smooth-code/jest-puppeteer#configure-puppeteer

/** @type {import("./types/jest-puppeter").Config} */
module.exports = {
  launch: {
    dumpio: false,
    product: "chrome",
  },
  browserContext: "incognito",
};
