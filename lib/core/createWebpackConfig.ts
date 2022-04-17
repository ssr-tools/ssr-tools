import path from "path";
import type { CreateWebpackConfigCallback } from "./types";

/**
 * Create a configuration for the `runWebpack` function.
 */
export const createWebpackConfig = (callback: CreateWebpackConfigCallback) =>
  callback({
    resolveEntryPath,
  });

export const resolveEntryPath = (...pathParts: string[]) =>
  path.resolve(process.cwd(), ...pathParts);
