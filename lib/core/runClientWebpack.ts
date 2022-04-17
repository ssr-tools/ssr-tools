import webpack from "webpack";
import { extensions, basePlugins, baseRuleset } from "./commonWebpackParts";
import { InternalWebpackConfig } from "./types";

export const runClientWebpack = ({
  entryPath,
  outputPath,
  mode,
  extendPlugins,
  devtool,
  extendRuleset,
}: InternalWebpackConfig) =>
  webpack({
    mode,
    devtool,
    entry: entryPath,
    module: {
      rules: extendRuleset ? [...extendRuleset(baseRuleset)] : [...baseRuleset],
    },
    resolve: {
      extensions,
    },
    output: {
      path: outputPath,
      filename: "index.js",
      clean: true,
    },
    plugins: extendPlugins ? [...extendPlugins(basePlugins)] : [...basePlugins],
  });
