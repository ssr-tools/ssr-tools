import { Config } from "@swc/core/types";
import { RuleSetRule } from "webpack";

export const createSwcLoaderRule = ({
  reactRefreshIsEnabled,
  minifyIsEnabled,
}: {
  reactRefreshIsEnabled: boolean;
  minifyIsEnabled: boolean;
}) => {
  const swcConfig: Config = {
    jsc: {
      target: "es2015",
      transform: {
        react: {
          refresh: reactRefreshIsEnabled,
          runtime: "automatic",
        },
      },
      parser: {
        syntax: "typescript",
        tsx: true,
        dynamicImport: true,
      },
    },
    minify: minifyIsEnabled,
  };

  const rule: RuleSetRule = {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: {
      loader: "swc-loader",
      options: swcConfig,
    },
  };

  return rule;
};
