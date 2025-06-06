/** @type {import('webpack').defaultConfig} */
const defaultConfig = require("@wordpress/scripts/config/webpack.config.js");
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
        test: /\.js$/,
        use: "babel-loader",
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
  if ((argv.mode === "production" || argv.mode === "development") && argv.env && (argv.env.BT || argv.env.ET)) {
    let dirDist, dirEntry;

    if(argv.env.BT){
      const dirSrc = path.resolve(__dirname, "block-inline-translation");
      dirDist = path.resolve(__dirname, "../assets/block-translator");
      dirEntry = `${dirSrc}/editorAssets/index.ts`;
    }else if(argv.env.ET){
      const dirSrc = path.resolve(__dirname, "elementor-inline-translation");
      dirDist = path.resolve(__dirname, "../assets/elementor-widget-translator");
      dirEntry = `${dirSrc}/index.js`;
    }

    return {
      ...config,
      entry: {
        index: dirEntry,
      },
      output: {
        path: dirDist,
        filename: "[name].js",
        publicPath: "/",
      },
    };
  }else{
    return defaultConfig;
  }
};
