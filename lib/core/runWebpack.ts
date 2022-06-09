import { Stats } from "webpack";
import { runClientWebpack } from "./runClientWebpack";
import { runServerWebpack } from "./runServerWebpack";
import { WebpackConfig } from "./types";
import { ChildProcess, execFile } from "child_process";

/**
 * Process the client and the server code using webpack, so that it can compile
 * and split the code, as well as load the assets of various kind.
 *
 * The compiled code is then accessible in the `clientOutputPath` and
 * `serverOutputPath`. You can run the server using `node {serverOutputPath}`.
 */
export const runWebpack = ({
  serverEntryPath,
  serverOutputPath,
  clientEntryPath,
  clientOutputPath,
  watchIsEnabled,
  mode,
  devtool,
  extendClientPlugins,
  extendServerPlugins,
  extendClientRuleset,
  extendServerRuleset,
  override,
}: WebpackConfig) => {
  const serverWebpack = runServerWebpack({
    mode,
    devtool,
    entryPath: serverEntryPath,
    outputPath: serverOutputPath,
    extendPlugins: extendServerPlugins,
    extendRuleset: extendServerRuleset,
    override,
  });

  const clientWebpack = runClientWebpack({
    mode,
    devtool,
    entryPath: clientEntryPath,
    outputPath: clientOutputPath,
    extendPlugins: extendClientPlugins,
    extendRuleset: extendClientRuleset,
    override,
  });

  let serverProcess: ChildProcess | undefined;

  if (watchIsEnabled) {
    return [
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
        return console.log("[server webpack]", stats?.toString());
      }),
      clientWebpack.watch({}, (err, stats) => {
        // eslint-disable-next-line no-console
        if (err) return console.log("[client webpack]", JSON.stringify(err));

        // eslint-disable-next-line no-console
        return console.log("[client webpack]", stats?.toString());
      }),
    ];
  }

  const bundlePromises = Promise.all([
    new Promise<Stats>((resolve, reject) =>
      serverWebpack.run((err, stats) => {
        if (stats) {
          return resolve(stats);
        }

        return reject(err);
      })
    ),
    new Promise<Stats>((resolve, reject) =>
      clientWebpack.run((err, stats) => {
        if (stats) {
          return resolve(stats);
        }

        return reject(err);
      })
    ),
  ]);

  return bundlePromises.catch((err) => {
    Promise.reject(err);
    // eslint-disable-next-line no-console
    console.log(err);
    process.exit(1);
  });
};
