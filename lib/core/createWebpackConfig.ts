import path from "path";
import type { CreateWebpackConfigCallback } from "./types";

/**
 * Create a configuration for the `runWebpack` function.
 */
export const createWebpackConfig = (callback: CreateWebpackConfigCallback) =>
  callback({
    resolvePath,
  });

export const resolvePath = (pathParts: string[]) =>
  path.resolve(process.cwd(), ...pathParts);
