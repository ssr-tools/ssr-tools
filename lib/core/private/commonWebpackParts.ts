import { WebpackPluginInstance } from "webpack";
import { WebpackManifestPlugin } from "webpack-manifest-plugin";

export const extensions = [
  ".tsx",
  ".ts",
  // .js(x) is needed here to resolve code from node_modules
  ".js",
  ".jsx",
  ".json",
  ".css",
];

const babelLoaderRule = {
  test: /\.tsx?$/,
  use: {
    loader: "babel-loader",
    options: {
      presets: [
        "@babel/preset-env",
        "@babel/preset-typescript",
        ["@babel/preset-react", { runtime: "automatic" }],
      ],
      plugins: ["@babel/transform-runtime"],
    },
  },
  exclude: /node_modules/,
};

export const basePlugins: WebpackPluginInstance[] = [
  new WebpackManifestPlugin({
    basePath: "",
    publicPath: "",
    useEntryKeys: true,
  }),
];

export const baseRuleset = [babelLoaderRule] as const;
