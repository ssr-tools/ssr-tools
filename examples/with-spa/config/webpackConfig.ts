import { createWebpackConfig } from "@ssr-tools/core/createWebpackConfig";

export const webpackConfig = createWebpackConfig(({ resolvePath }) => ({
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  clientEntryPath: resolvePath(["client.tsx"]),
  clientOutputPath: resolvePath(["dist", "client"]),
  serverEntryPath: resolvePath(["server.tsx"]),
  serverOutputPath: resolvePath(["dist", "server"]),
  devServerPort: 8081,
  assetsPublicUrl: "http://localhost:3001/public/",
}));
