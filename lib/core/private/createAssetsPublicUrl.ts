import { WebpackConfig } from "../types";

export const createAssetsPublicUrl = ({
  providedAssetsPrefix,
  devServerPort,
  mode,
}: {
  providedAssetsPrefix: string | URL;
  devServerPort: number;
  mode: WebpackConfig["mode"];
}) => {
  if (typeof providedAssetsPrefix !== "string") {
    const publicPath = normalizePath(providedAssetsPrefix.pathname);

    return {
      url: `//${providedAssetsPrefix.host}${publicPath}`,
      publicPath,
    };
  }

  const publicPath = normalizePath(providedAssetsPrefix);

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

const normalizePath = (path: string) => {
  const withoutSlashes = path.replace(/(^\/|\/$)/g, "");
  return withoutSlashes === "" ? "/" : `/${withoutSlashes}/`;
};
