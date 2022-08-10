import Webpack, {
  IgnorePlugin,
  HotModuleReplacementPlugin,
  Configuration,
} from "webpack";
import { extensions, createBabelLoaderRule } from "./commonWebpackParts";
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
  extendRuleset,
  override,
  extendResolve,
  devServerPort,
}: ClientInternalWebpackConfig) => {
  const baseRuleset = [
    createBabelLoaderRule({
      reactRefreshIsEnabled: mode === "development",
    }),
  ];

  const clientDevPlugins = [
    new HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
  ];

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
      rules: extendRuleset ? [...extendRuleset(baseRuleset)] : [...baseRuleset],
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
