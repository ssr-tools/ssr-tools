import type { ReactElement } from "react";
import type {
  Configuration,
  ResolveOptions,
  RuleSetRule,
  WebpackPluginInstance,
} from "webpack";
import type { renderToPipeableStream } from "react-dom/server";

export type CreateWebpackConfigCallback = (deps: {
  /**
   * It joins and resolves the path parts. It ensures that the given path
   * is within the current working directory. Example:
   *
   * ```
   * // working dir: /app/example
   *
   * resolvePath(["client.tsx"]); // returns: /app/example/client.tsx
   * resolvePath(["dist", "js"]); // returns: /app/example/dist/js
   * ```
   */
  resolvePath: (pathParts: string[]) => string;
}) => WebpackConfig;

export type WebpackConfig = {
  /**
   * The path where your your client-side entry is. The file is
   * responsible for hydrating the app in the browser.
   */
  clientEntryPath: string;
  /** The path where your client-side built goes. */
  clientOutputPath: string;
  /**
   * The path where your server-side entry is. The file is responsible for
   * starting your app server.
   */
  serverEntryPath: string;
  /** The path where your server-side built goes. */
  serverOutputPath: string;
  /** https://webpack.js.org/configuration/mode/ */
  mode: Configuration["mode"];
  /**
   * Source maps configuration.
   *
   * https://webpack.js.org/configuration/devtool/#devtool
   */
  devtool?: WebpackDevtool;
  /**
   * It allows to extend plugins for client-side webpack
   * build.
   *
   * https://webpack.js.org/configuration/plugins/
   */
  extendClientPlugins?: InternalWebpackConfig["extendPlugins"];
  /**
   * It allows to extend plugins for server-side webpack
   * build.
   *
   * https://webpack.js.org/configuration/plugins/
   */
  extendServerPlugins?: InternalWebpackConfig["extendPlugins"];
  /**
   * It allows to extend `module.rules` for client-side webpack
   * build.
   *
   * https://webpack.js.org/configuration/module/#modulerules
   */
  extendClientRuleset?: InternalWebpackConfig["extendRuleset"];
  /**
   * It allows to extend `module.rules` for server-side webpack
   * build.
   *
   * https://webpack.js.org/configuration/module/#modulerules
   */
  extendServerRuleset?: InternalWebpackConfig["extendRuleset"];
  /**
   * It allows to extend `resolve` for the client-side webpack
   * build.
   *
   * https://webpack.js.org/configuration/resolve/
   */
  extendClientResolve?: (
    resolve: Readonly<ResolveOptions>
  ) => Readonly<ResolveOptions>;
  /**
   * It allows to extend `resolve` for the server-side webpack
   * build.
   *
   * https://webpack.js.org/configuration/resolve/
   */
  extendServerResolve?: (
    resolve: Readonly<ResolveOptions>
  ) => Readonly<ResolveOptions>;
  /**
   * Gives you access to the low-level Webpack config. However, make sure you
   * return the necessary configuration from `base` param of this callback.
   * Otherwise, you may cause the Webpack to crash or make it unable to load
   * the assets for your app.
   */
  override?: (base: Configuration) => Configuration;
  /**
   * Webpack in `development` mode uses this port to run the dev server with
   * hot reload. The client assets will be exposed on:
   * `http://localhost:{devServerPort}` and websocket endpoint for the fast
   * refresh will be on `ws://localhost:{devServerPort}`.
   *
   * https://webpack.js.org/configuration/dev-server/
   */
  devServerPort: number;
};

export type RenderToStreamConfig = {
  jsx: ReactElement;
  /**
   * The amount of time needed to auto-abort the stream.
   * It is useful to avoid getting stuck with an unresolved stream.
   * If you don't want the stream to auto-abort, put "never" as a value here.
   */
  timeoutMs?: number | "never";
  pipeableStreamOptions?: PipeableStreamOptions;
};

export type PipeableStreamOptions = Parameters<
  typeof renderToPipeableStream
>["1"];

export type ClientInternalWebpackConfig = InternalWebpackConfig & {
  devServerPort: number;
};

export type ServerInternalWebpackConfig = InternalWebpackConfig;

type InternalWebpackConfig = {
  entryPath: string;
  outputPath: string;
  mode: Configuration["mode"];
  devtool?: WebpackDevtool;
  extendPlugins?: (
    plugins: Readonly<WebpackPluginInstance[]>
  ) => Readonly<WebpackPluginInstance[]>;
  extendRuleset?: (ruleset: Readonly<RuleSetRule[]>) => Readonly<RuleSetRule[]>;
  extendResolve?: (
    resolve: Readonly<ResolveOptions>
  ) => Readonly<ResolveOptions>;
  override?: (base: Configuration) => Configuration;
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
