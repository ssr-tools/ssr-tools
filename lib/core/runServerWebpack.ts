import webpack from "webpack";
import { extensions, basePlugins, baseRuleset } from "./commonWebpackParts";
import { InternalWebpackConfig } from "./types";

export const runServerWebpack = ({
  entryPath,
  outputPath,
  mode,
  devtool,
  extendPlugins,
  extendRuleset,
  override,
}: InternalWebpackConfig) => {
  const base = {
    mode,
    devtool,
    // by default, webpack is targeting a browser, so server-side modules won't work
    target: "node",
    entry: entryPath,
    module: {
      rules: extendRuleset ? [...extendRuleset(baseRuleset)] : [...baseRuleset],
    },
    resolve: {
      extensions,
    },
    output: {
      filename: "index.js",
      path: outputPath,
    },
    plugins: extendPlugins ? [...extendPlugins(basePlugins)] : [...basePlugins],
  };

  return webpack(override ? override(base) : base);
};
