import { LaunchOptions, BrowserLaunchArgumentOptions } from "puppeteer";

export type Config = {
  launch: LaunchOptions & BrowserLaunchArgumentOptions;
  browserContext: "default" | "incognito";
};
