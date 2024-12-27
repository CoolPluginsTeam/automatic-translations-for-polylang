/** @type {import('webpack').defaultConfig} */
const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require("path");
const glob = require("glob");

/** @type {import('webpack').Configuration} */
const config = {
  ...defaultConfig,
  plugins: [...defaultConfig.plugins],
  module: {
    ...defaultConfig.module,
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["postcss-preset-env"]],
              },
            },
          },
        ],
      },
    ],
  },
};

module.exports = (env, argv) => {
  // if (argv.mode === "production" || argv.mode === "development") {
    const dirDist = path.resolve(__dirname, "../assets/block-translator");
    const dirSrc = path.resolve(__dirname, "block-translator");

    return {
      ...config,
      entry: {
        index: `${dirSrc}/editorAssets/index.ts`,
      },
      output: {
        path: dirDist,
        filename: "[name].js",
        publicPath: "/",
      },
    };
  // }
};
