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
  imageInlineSizeLimitBytes,
  publicHost: providedPublicHost,
  assetsPrefix: providedAssetsPrefix,
}: WebpackConfig) => {
  const publicHost =
    providedPublicHost.slice(-1) === "/"
      ? providedPublicHost.slice(0, -1)
      : providedPublicHost;

  const sanitizedAssetsPrefix = providedAssetsPrefix.replace(/\//g, "");
  const assetsPrefix = `/${sanitizedAssetsPrefix}/`;

  const parsedAssetsPublicUrl = new URL(publicHost + assetsPrefix);

  const assetsPublicUrl =
    mode === "production"
      ? `//${parsedAssetsPublicUrl.host}` + `${parsedAssetsPublicUrl.pathname}`
      : `http://localhost:${devServerPort}/${sanitizedAssetsPrefix}/`;

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
    publicPath: assetsPrefix,
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
