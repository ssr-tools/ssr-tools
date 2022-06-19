import { createWebpackConfig } from "@ssr-tools/core/createWebpackConfig";

export const webpackConfig = createWebpackConfig(({ resolveEntryPath }) => ({
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  clientEntryPath: resolveEntryPath("client.tsx"),
  clientOutputPath: resolveEntryPath("dist", "client"),
  serverEntryPath: resolveEntryPath("server.tsx"),
  serverOutputPath: resolveEntryPath("dist", "server"),
  watchIsEnabled: true,
  extendClientRuleset: (ruleset) => [
    ...ruleset,
    {
      test: /\.css$/i,
      type: "asset/resource",
      generator: {
        // https://webpack.js.org/configuration/output/#template-strings
        filename: "[name].[hash][ext]",
      },
    },
  ],
  extendServerRuleset: (ruleset) => [
    ...ruleset,
    {
      test: /\.css$/i,
      type: "asset/resource",
      generator: {
        // https://webpack.js.org/configuration/output/#template-strings
        filename: "[name].[hash][ext]",
      },
    },
  ],
}));
