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
   * Make sure you include plugins from the callback's param to the result
   * as well.
   *
   * https://webpack.js.org/configuration/plugins/
   */
  extendClientPlugins?: InternalWebpackConfig["extendPlugins"];
  /**
   * It allows to extend plugins for server-side webpack
   * build.
   *
   * Make sure you include plugins from the callback's param to the result
   * as well.
   *
   * https://webpack.js.org/configuration/plugins/
   */
  extendServerPlugins?: InternalWebpackConfig["extendPlugins"];
  /**
   * It allows to extend `module.rules` for client-side webpack
   * build.
   *
   * Make sure you include rules from the callback's param to the result
   * as well.
   *
   * https://webpack.js.org/configuration/module/#modulerules
   */
  extendClientRuleSet?: InternalWebpackConfig["extendRuleSet"];
  /**
   * It allows to extend `module.rules` for server-side webpack
   * build.
   *
   * Make sure you include rules from the callback's param to the result
   * as well.
   *
   * https://webpack.js.org/configuration/module/#modulerules
   */
  extendServerRuleSet?: InternalWebpackConfig["extendRuleSet"];
  /**
   * It allows to extend `resolve` for the client-side webpack
   * build.
   *
   * Make sure you include rules from the callback's param to the result
   * as well.
   *
   * Webpack docs: https://webpack.js.org/configuration/resolve/
   */
  extendClientResolve?: (
    resolve: Readonly<ResolveOptions>
  ) => Readonly<ResolveOptions>;
  /**
   * It allows to extend `resolve` for the server-side webpack
   * build.
   *
   * Webpack docs: https://webpack.js.org/configuration/resolve/
   */
  extendServerResolve?: (
    resolve: Readonly<ResolveOptions>
  ) => Readonly<ResolveOptions>;
  /**
   * This prop gives you access to the low-level Webpack config. You must be
   * careful, though. You still need to to return the necessary configuration
   * from the `base` param of this callback. Otherwise, you may break the config
   * and the app won't work properly.
   *
   * Webpack docs: https://webpack.js.org/configuration/#options
   */
  override?: (base: Configuration) => Configuration;
  /**
   * Webpack in `development` mode uses this port to run the dev server with
   * fast refresh/hot reload.
   *
   * It MUST be different than the `appPort`.
   *
   * Webpack docs: https://webpack.js.org/configuration/dev-server/
   */
  devServerPort: number;
  /**
   * Threshold size for the image to be inlined using data URL. The images that
   * weight more than that that won't be inlined.
   *
   * We inline images to avoid multiple HTTP requests for lightweight images.
   *
   * Defaults to: `10000`
   */
  imageInlineSizeLimitBytes?: number;
  /**
   * To differentiate between app routes and assets URLs you need to specify
   * the prefix for the assets. Make sure you won't use the assets prefix
   * as an app route. Otherwise you may run into conflicting URLs.
   *
   * Usually, it should be `public`.
   *
   * You may also provide URL instance here, if you decide you'd like to serve
   * the assets from a different domain for instance.
   */
  assetsPrefix: string | URL;
  /**
   * The app host. For local environments use `localhost`.
   *
   * Use it in the server config as well.
   */
  appHost: string;
  /**
   * The app port.
   *
   * Use it in the server config as well.
   */
  appPort: number;
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
  appHost: string;
  appPort: number;
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
  extendRuleSet?: (ruleSet: Readonly<RuleSetRule[]>) => Readonly<RuleSetRule[]>;
  extendResolve?: (
    resolve: Readonly<ResolveOptions>
  ) => Readonly<ResolveOptions>;
  override?: (base: Configuration) => Configuration;
  imageInlineSizeLimitBytes?: number;
  assetsPublicUrl: {
    url: string | null;
    publicPath: string;
  };
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
