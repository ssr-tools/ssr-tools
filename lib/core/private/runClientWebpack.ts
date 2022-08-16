import Webpack, { IgnorePlugin, Configuration } from "webpack";
import { serverModuleRegExp } from "./serverModuleRegExp";
import type { ClientInternalWebpackConfig } from "../types";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import WebpackDevServer from "webpack-dev-server";
import { WebpackManifestPlugin } from "webpack-manifest-plugin";
import { createSwcLoaderRule } from "./createSwcLoaderRule";
import { createAssetsLoaderRule } from "./createAssetsLoaderRule";
import { extensions } from "./extensions";

export const runClientWebpack = ({
  entryPath,
  outputPath,
  mode,
  extendPlugins,
  devtool,
  extendRuleSet,
  override,
  extendResolve,
  devServerPort,
  imageInlineSizeLimitBytes,
  assetsPublicUrl,
  publicPath,
}: ClientInternalWebpackConfig) => {
  const baseRuleSet: Webpack.RuleSetRule[] = [
    createSwcLoaderRule({
      reactRefreshIsEnabled: mode === "development",
      minifyIsEnabled: mode === "production",
    }),
    createAssetsLoaderRule({
      imageInlineSizeLimitBytes,
      assetsAreEmitted: true,
    }),
  ];

  const clientDevPlugins = [new ReactRefreshWebpackPlugin()];

  const clientPlugins = [
    ...(mode === "development" ? clientDevPlugins : []),
    new IgnorePlugin({
      resourceRegExp: serverModuleRegExp, // ignore server-side modules
    }),
    new WebpackManifestPlugin({
      basePath: "",
      publicPath: "",
      useEntryKeys: true,
    }),
  ];

  const base: Configuration = {
    mode,
    devtool,
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
      path: outputPath,
      filename: "index.js",
      clean: true,
      pathinfo: false,
    },
    plugins: extendPlugins
      ? [...extendPlugins(clientPlugins)]
      : [...clientPlugins],
  };

  const clientWebpack = Webpack(override ? override(base) : base);

  const clientWebpackDevServer =
    base.mode === "development"
      ? new WebpackDevServer(
          {
            liveReload: false,
            static: {
              directory: outputPath,
              publicPath,
            },
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
            host: "0.0.0.0",
            port: devServerPort,
            client: {
              webSocketURL: `ws://0.0.0.0:${devServerPort}/ws`,
            },
            proxy: [
              {
                target: "http://localhost:3000",
                path: "*",
                bypass: (req) => {
                  if (req.path.startsWith(publicPath)) {
                    // skip proxy for requests on publicPath to serve asset
                    return req.path;
                  }
                },
              },
            ],
          },
          clientWebpack
        )
      : null;

  return { clientWebpack, clientWebpackDevServer };
};
