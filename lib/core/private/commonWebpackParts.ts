export const extensions = [
  ".tsx",
  ".ts",
  // .js(x) is needed here to resolve code from node_modules
  ".js",
  ".jsx",
  ".json",
  ".css",
];

export const createBabelLoaderRule = ({
  reactRefreshIsEnabled,
}: {
  reactRefreshIsEnabled: boolean;
}) => ({
  test: /\.tsx?$/,
  use: {
    loader: "babel-loader",
    options: {
      presets: [
        "@babel/preset-env",
        "@babel/preset-typescript",
        ["@babel/preset-react", { runtime: "automatic" }],
      ],
      plugins: reactRefreshIsEnabled
        ? ["@babel/transform-runtime", "react-refresh/babel"]
        : ["@babel/transform-runtime"],
    },
  },
  exclude: /node_modules/,
});
