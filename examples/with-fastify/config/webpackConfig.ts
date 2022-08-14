import { createWebpackConfig } from "@ssr-tools/core/createWebpackConfig";

export const webpackConfig = createWebpackConfig(({ resolvePath }) => ({
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  clientEntryPath: resolvePath(["client.tsx"]),
  clientOutputPath: resolvePath(["dist", "client"]),
  serverEntryPath: resolvePath(["server.tsx"]),
  serverOutputPath: resolvePath(["dist", "server"]),
  watchIsEnabled: process.env.NODE_ENV === "development",
  extendClientRuleSet: (ruleSet) => [...ruleSet, ...customRules],
  extendServerRuleSet: (ruleSet) => [...ruleSet, ...customRules],
  extendServerResolve: (resolve) => ({
    ...resolve,
    alias: {
      ...resolve.alias,
      // Fixes module resolution problem in fastify:
      // https://github.com/fastify/help/issues/272
      "tiny-lru": "tiny-lru/lib/tiny-lru.js",
    },
  }),
  devServerPort: 8080,
}));

const customRules = [
  {
    test: /\.css$/i,
    type: "asset/resource",
    generator: {
      // https://webpack.js.org/configuration/output/#template-strings
      filename: "[name].[hash].[ext]",
    },
  },
];
