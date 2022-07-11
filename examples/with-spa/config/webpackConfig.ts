import { createWebpackConfig } from "@ssr-tools/core/createWebpackConfig";

export const webpackConfig = createWebpackConfig(({ resolveEntryPath }) => ({
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  clientEntryPath: resolveEntryPath("client.tsx"),
  clientOutputPath: resolveEntryPath("dist", "client"),
  serverEntryPath: resolveEntryPath("server.tsx"),
  serverOutputPath: resolveEntryPath("dist", "server"),
  watchIsEnabled: process.env.NODE_ENV === "development",
}));
