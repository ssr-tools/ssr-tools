// @ts-check
// https://github.com/smooth-code/jest-puppeteer#configure-puppeteer

/** @type {{ launch: import("puppeteer").LaunchOptions, browserContext: "default" | "incognito" }} */
module.exports = {
  launch: {
    dumpio: false,
    product: "chrome",
  },
  browserContext: "incognito",
};
