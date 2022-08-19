import { createWebpackConfig } from "@ssr-tools/core/createWebpackConfig";

export const webpackConfig = createWebpackConfig(({ resolvePath }) => ({
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  clientEntryPath: resolvePath(["client.tsx"]),
  clientOutputPath: resolvePath(["dist", "client"]),
  serverEntryPath: resolvePath(["server.tsx"]),
  serverOutputPath: resolvePath(["dist", "server"]),
  extendServerResolve: (resolve) => ({
    ...resolve,
    alias: {
      ...resolve.alias,
      // Fixes module resolution problem in fastify:
      // https://github.com/fastify/help/issues/272
      "tiny-lru": "tiny-lru/lib/tiny-lru.js",
    },
  }),
  assetsPrefix: "/public",
  appHost: "0.0.0.0",
  appPort: 3000,
  devServerPort: 8080,
}));
