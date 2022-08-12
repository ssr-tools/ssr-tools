import { LaunchOptions, BrowserLaunchArgumentOptions } from "puppeteer";

export type Config = {
  launch: LaunchOptions & BrowserLaunchArgumentOptions;
  browserContext: "default" | "incognito";
  /**
   * When `false` the browser won't close if there is an error at the page, and
   * thus the test won't fail.
   */
  exitOnPageError: boolean;
};
