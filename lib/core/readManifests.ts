import path from "path";

import { readFile as readFileWithCallback } from "fs";

/**
 * Reads webpack manifests for the client and server bundles.
 *
 * https://webpack.js.org/concepts/manifest/#manifest
 */
export const readManifests = async ({
  clientOutputPath,
  serverOutputPath,
}: {
  clientOutputPath: string;
  serverOutputPath: string;
}) => {
  const manifestClient = JSON.parse(
    await readFile(path.resolve(clientOutputPath, "manifest.json"))
  ) as Record<string, string>;

  const manifestServer = JSON.parse(
    await readFile(path.resolve(serverOutputPath, "manifest.json"))
  ) as Record<string, string>;

  return {
    manifestClient,
    manifestServer,
  };
};

const readFile = (filepath: string) =>
  new Promise<string>((resolve, reject) =>
    readFileWithCallback(
      filepath,
      {
        encoding: "utf-8",
      },
      (err, data) => {
        if (err) return reject(err);
        return resolve(data);
      }
    )
  );
