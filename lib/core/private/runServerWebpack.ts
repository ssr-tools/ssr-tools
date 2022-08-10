import Webpack, { Configuration, IgnorePlugin } from "webpack";
import webpackNodeExternals from "webpack-node-externals";
import { extensions, createBabelLoaderRule } from "./commonWebpackParts";
import { clientModuleRegExp } from "./clientModuleRegExp";
import type { ServerInternalWebpackConfig } from "../types";

export const runServerWebpack = ({
  entryPath,
  outputPath,
  mode,
  devtool,
  extendPlugins,
  extendRuleset,
  override,
  extendResolve,
}: ServerInternalWebpackConfig) => {
  const baseRuleset = [
    createBabelLoaderRule({
      reactRefreshIsEnabled: false,
    }),
  ];

  const base: Configuration = {
    mode,
    devtool,
    // by default, webpack is targeting a browser,
    // so server-side modules won't work
    target: "node",
    entry: entryPath,
    module: {
      rules: extendRuleset ? [...extendRuleset(baseRuleset)] : [...baseRuleset],
    },
    resolve: extendResolve
      ? extendResolve({ extensions })
      : {
          extensions,
        },
    output: {
      filename: "index.js",
      path: outputPath,
    },
    plugins: extendPlugins
      ? [...extendPlugins(serverPlugins)]
      : [...serverPlugins],
    externals: [webpackNodeExternals()],
    externalsPresets: { node: true },
  };

  return Webpack(override ? override(base) : base);
};

const serverPlugins = [
  // ignore client-side modules
  new IgnorePlugin({
    resourceRegExp: clientModuleRegExp,
  }),
];
