import Webpack, { IgnorePlugin, Configuration } from "webpack";
import { extensions, createSwcLoaderRule } from "./commonWebpackParts";
import { serverModuleRegExp } from "./serverModuleRegExp";
import type { ClientInternalWebpackConfig } from "../types";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import WebpackDevServer from "webpack-dev-server";
import { WebpackManifestPlugin } from "webpack-manifest-plugin";

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
}: ClientInternalWebpackConfig) => {
  const baseRuleSet = [
    createSwcLoaderRule({
      reactRefreshIsEnabled: mode === "development",
      minifyIsEnabled: mode === "production",
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
      path: outputPath,
      filename: "index.js",
      clean: true,
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
            },
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
            host: "0.0.0.0",
            port: devServerPort,
            client: {
              webSocketURL: `ws://0.0.0.0:${devServerPort}/ws`,
            },
          },
          clientWebpack
        )
      : null;

  return { clientWebpack, clientWebpackDevServer };
};
