import fetch from "node-fetch";

/**
 * Reads manifest from the client build.
 *
 * https://webpack.js.org/concepts/manifest/#manifest
 */
export const fetchManifest = async (url: string) => {
  try {
    const response = await fetch(url);
    const manifest = await response.json();
    return manifest as Record<string, string> & { main: string };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return null;
  }
};
