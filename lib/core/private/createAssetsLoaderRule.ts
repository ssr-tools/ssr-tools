import { RuleSetRule } from "webpack";

export const createAssetsLoaderRule = ({
  assetsAreEmitted,
  imageInlineSizeLimitBytes = 10000,
}: {
  assetsAreEmitted: boolean;
  imageInlineSizeLimitBytes?: number;
}) => {
  const rasterImagesRule: RuleSetRule = {
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.avif$/],
    type: "asset",
    parser: {
      dataUrlCondition: {
        maxSize: imageInlineSizeLimitBytes,
      },
    },
    generator: {
      emit: assetsAreEmitted,
    },
  };

  const vectorImagesRule = {
    test: /\.svg$/,
    use: [
      {
        loader: "@svgr/webpack",
        options: {
          prettier: false,
          svgo: false,
          svgoConfig: {
            plugins: [{ removeViewBox: false }],
          },
          titleProp: true,
          ref: true,
        },
      },
      {
        loader: "file-loader",
        options: {
          name: "[name].[hash].[ext]",
        },
      },
    ],
    issuer: {
      and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
    },
  };

  const othersRule = {
    exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx|json)$/],
    type: "asset/resource",
  };

  const rule: RuleSetRule = {
    oneOf: [rasterImagesRule, vectorImagesRule, othersRule],
  };

  return rule;
};
