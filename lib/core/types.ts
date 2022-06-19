import { ReactElement } from "react";
import { Configuration, RuleSetRule, WebpackPluginInstance } from "webpack";
import { baseRuleset } from "./commonWebpackParts";
import type { resolveEntryPath } from "./createWebpackConfig";
import type { renderToPipeableStream } from "react-dom/server";

export type CreateWebpackConfigCallback = (deps: {
  resolveEntryPath: typeof resolveEntryPath;
}) => WebpackConfig;

export type WebpackConfig = {
  /**
   * The path where your server-side entry is. The file is responsible for
   * starting your app server.
   */
  serverEntryPath: string;
  /** The path where your server-side built goes. */
  serverOutputPath: string;
  /**
   * The path where your your client-side entry is. The file is
   * responsible for hydrating the app in the browser.
   */
  clientEntryPath: string;
  /** The path where your client-side built goes. */
  clientOutputPath: string;
  /**
   * Enables webpack automatic re-run when something changes in server or client
   * code. It also starts the script at `serverOutputPath` as a child process.
   * */
  watchIsEnabled: boolean;
  /** https://webpack.js.org/configuration/mode/ */
  mode: Configuration["mode"];
  /** https://webpack.js.org/configuration/devtool/#devtool */
  devtool?: WebpackDevtool;
  /**
   * It allows to extend plugins for client-side webpack
   * build.
   */
  extendClientPlugins?: InternalWebpackConfig["extendPlugins"];
  /**
   * It allows to extend plugins for server-side webpack
   * build.
   */
  extendServerPlugins?: InternalWebpackConfig["extendPlugins"];
  /**
   * It allows to extend `module.rules` for client-side webpack
   * build.
   */
  extendClientRuleset?: InternalWebpackConfig["extendRuleset"];
  /**
   * It allows to extend `module.rules` for server-side webpack
   * build.
   */
  extendServerRuleset?: InternalWebpackConfig["extendRuleset"];
  /**
   * Gives you access to the low-level Webpack config. However, make sure you
   * return the necessary configuration from `base` param from this callback.
   * Otherwise, you may cause the Webpack to crash.
   */
  override?: (base: Configuration) => Configuration;
};

export type RenderToStreamConfig = {
  jsx: ReactElement;
  /** A path to a directory where you serve a static assets e.g `/public`. */
  staticAssetsPrefix: string;
  pipeableStreamOptions?: PipeableStreamOptions;
  /**
   * Webpack manifest for client-side bundle
   *
   * https://webpack.js.org/concepts/manifest/#manifest
   */
  manifestClient: Record<string, string>;
};

export type PipeableStreamOptions = Parameters<
  typeof renderToPipeableStream
>["1"];

export type InternalWebpackConfig = BaseInternalWebpackConfig & {
  override?: (base: Configuration) => Configuration;
};

export type BaseInternalWebpackConfig = {
  entryPath: string;
  outputPath: string;
  mode: Configuration["mode"];
  devtool?: WebpackDevtool;
  extendPlugins?: (
    plugins: Readonly<WebpackPluginInstance[]>
  ) => Readonly<WebpackPluginInstance[]>;
  extendRuleset?: (ruleset: typeof baseRuleset) => Readonly<RuleSetRule[]>;
};

/** https://webpack.js.org/configuration/devtool/#devtool */
type WebpackDevtool =
  | "eval"
  | "eval-cheap-source-map"
  | "eval-cheap-module-source-map"
  | "eval-source-map"
  | "cheap-source-map"
  | "cheap-module-source-map"
  | "source-map"
  | "inline-cheap-source-map"
  | "inline-cheap-module-source-map"
  | "inline-source-map"
  | "eval-nosources-cheap-source-map"
  | "eval-nosources-cheap-module-source-map"
  | "eval-nosources-source-map"
  | "inline-nosources-cheap-source-map"
  | "inline-nosources-cheap-module-source-map"
  | "inline-nosources-source-map"
  | "nosources-cheap-source-map"
  | "nosources-cheap-module-source-map"
  | "nosources-source-map"
  | "hidden-nosources-cheap-source-map"
  | "hidden-nosources-cheap-module-source-map"
  | "hidden-nosources-source-map"
  | "hidden-cheap-source-map"
  | "hidden-cheap-module-source-map"
  | "hidden-source-map";
