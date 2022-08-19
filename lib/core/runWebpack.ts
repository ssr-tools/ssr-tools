import { Stats } from "webpack";
import { runClientWebpack } from "./private/runClientWebpack";
import { runServerWebpack } from "./private/runServerWebpack";
import { WebpackConfig } from "./types";
import { ChildProcess, execFile } from "child_process";

/**
 * Process the client and the server code using webpack, so that it can compile
 * and split the code, as well as load the assets of various kind.
 *
 * The compiled code is then accessible in the `clientOutputPath` and
 * `serverOutputPath`. You can run the server using `node {serverOutputPath}`.
 */
export const runWebpack = async ({
  serverEntryPath,
  serverOutputPath,
  clientEntryPath,
  clientOutputPath,
  mode,
  devtool,
  extendClientPlugins,
  extendServerPlugins,
  extendClientRuleSet,
  extendServerRuleSet,
  extendClientResolve,
  extendServerResolve,
  override,
  devServerPort,
  assetsPrefix: providedAssetsPrefix,
  imageInlineSizeLimitBytes,
  appHost,
  appPort,
}: WebpackConfig) => {
  const assetsPublicUrl = createAssetsPublicUrl({
    providedAssetsPrefix,
    devServerPort,
    mode,
  });

  const serverWebpack = runServerWebpack({
    mode,
    devtool,
    entryPath: serverEntryPath,
    outputPath: serverOutputPath,
    extendPlugins: extendServerPlugins,
    extendRuleSet: extendServerRuleSet,
    extendResolve: extendServerResolve,
    override,
    imageInlineSizeLimitBytes,
    assetsPublicUrl,
  });

  const { clientWebpack, clientWebpackDevServer } = runClientWebpack({
    mode,
    devtool,
    entryPath: clientEntryPath,
    outputPath: clientOutputPath,
    extendPlugins: extendClientPlugins,
    extendRuleSet: extendClientRuleSet,
    extendResolve: extendClientResolve,
    override,
    devServerPort,
    imageInlineSizeLimitBytes,
    assetsPublicUrl,
    appHost,
    appPort,
  });

  let serverProcess: ChildProcess | undefined;

  if (mode === "development" && clientWebpackDevServer) {
    await clientWebpackDevServer.start();

    serverWebpack.watch({}, (err, stats) => {
      // eslint-disable-next-line no-console
      if (err) return console.log("[server webpack]", JSON.stringify(err));

      if (serverProcess) {
        serverProcess.kill(1);
      }

      serverProcess = execFile("node", [serverOutputPath]);

      process.on("exit", () => serverProcess?.kill(1));

      serverProcess.stdout?.pipe(process.stdout);
      serverProcess.stdin?.pipe(process.stdin);
      serverProcess.stderr?.pipe(process.stderr);

      // eslint-disable-next-line no-console
      console.log("[server webpack]", stats?.toString());
    });

    return;
  }

  const bundlePromises = Promise.all([
    new Promise<Stats>((resolve, reject) =>
      serverWebpack.run((err, stats) => {
        if (!stats) {
          // eslint-disable-next-line no-console
          console.error("[server webpack]", err);
          return reject(err);
        }

        if (stats.compilation.errors.length) {
          // eslint-disable-next-line no-console
          console.error("[server webpack]", stats.compilation.errors);
          return reject(err);
        }

        // eslint-disable-next-line no-console
        console.log("[server webpack]", "assets", stats.compilation.assets);

        return resolve(stats);
      })
    ),
    new Promise<Stats>((resolve, reject) =>
      clientWebpack.run((err, stats) => {
        if (!stats) {
          // eslint-disable-next-line no-console
          console.error("[client webpack]", err);
          return reject(err);
        }

        if (stats.compilation.errors.length) {
          // eslint-disable-next-line no-console
          console.error("[client webpack]", stats.compilation.errors);
          return reject(stats.compilation.errors);
        }

        // eslint-disable-next-line no-console
        console.log("[client webpack]", "assets", stats.compilation.assets);

        return resolve(stats);
      })
    ),
  ]);

  await bundlePromises.catch((err) => {
    Promise.reject(err);
    // eslint-disable-next-line no-console
    console.log(err);
    process.exit(1);
  });

  return;
};

const createAssetsPublicUrl = ({
  providedAssetsPrefix,
  devServerPort,
  mode,
}: {
  providedAssetsPrefix: string | URL;
  devServerPort: number;
  mode: WebpackConfig["mode"];
}) => {
  if (typeof providedAssetsPrefix !== "string") {
    const publicPath = `/${removeEdgeSlashes(providedAssetsPrefix.pathname)}/`;
    return {
      url: `//${providedAssetsPrefix.host}${publicPath}`,
      publicPath: publicPath,
    };
  }

  const publicPath = `/${removeEdgeSlashes(providedAssetsPrefix)}/`;

  if (mode === "production") {
    return {
      // Since the provided assets prefix is a relative path, we don't need to
      // use URL in production.
      url: null,
      publicPath,
    };
  }

  return {
    // In the development mode we use complete URL to serve assets from the
    // webpack dev server.
    url: `//localhost:${devServerPort}${publicPath}`,
    publicPath,
  };
};

/** It removes initial and trailing slash from the path.  */
const removeEdgeSlashes = (path: string) => path.replace(/(^\/|\/$)/g, "");
