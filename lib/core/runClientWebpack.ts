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
  override,
}: InternalWebpackConfig) => {
  const base = {
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
  };

  return webpack(override ? override(base) : base);
};
