import Webpack, { Configuration, IgnorePlugin } from "webpack";
import webpackNodeExternals from "webpack-node-externals";
import { clientModuleRegExp } from "./clientModuleRegExp";
import type { ServerInternalWebpackConfig } from "../types";
import { createSwcLoaderRule } from "./createSwcLoaderRule";
import { createAssetsLoaderRule } from "./createAssetsLoaderRule";
import { extensions } from "./extensions";

export const runServerWebpack = ({
  entryPath,
  outputPath,
  mode,
  devtool,
  extendPlugins,
  extendRuleSet,
  override,
  extendResolve,
  imageInlineSizeLimitBytes,
  assetsPublicUrl,
}: ServerInternalWebpackConfig) => {
  const baseRuleSet = [
    createSwcLoaderRule({
      reactRefreshIsEnabled: false,
      minifyIsEnabled: false,
    }),
    createAssetsLoaderRule({
      imageInlineSizeLimitBytes,
      assetsAreEmitted: false,
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
      rules: extendRuleSet ? [...extendRuleSet(baseRuleSet)] : [...baseRuleSet],
    },
    resolve: extendResolve
      ? extendResolve({ extensions })
      : {
          extensions,
        },
    output: {
      publicPath: assetsPublicUrl,
      filename: "index.js",
      path: outputPath,
      clean: true,
      pathinfo: false,
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
