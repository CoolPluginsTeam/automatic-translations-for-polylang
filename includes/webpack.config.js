/** @type {import('webpack').defaultConfig} */
const defaultConfig = require("@wordpress/scripts/config/webpack.config.js");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");
const glob = require("glob");

/** @type {import('webpack').Configuration} */
const customConfig = (argv) => {
  
  return {
    ...defaultConfig,
    mode: argv.mode || 'production',
    devtool: argv.mode === 'development' ? 'source-map' : false,
    plugins: [...defaultConfig.plugins, new CleanWebpackPlugin(
      {
        cleanOnceBeforeBuildPatterns: ['**/*.map'], // Delete old map files before every build
      }
    )],
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
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
    }
  };
}

module.exports = (env, argv) => {
  if ((argv.mode === "production" || argv.mode === "development") && argv.env && argv.env.inlineTranslate) {

    const inlineDirectories = ['elementor', 'block'];

    const inlineConfigDirectories = inlineDirectories.map(name => {
      const dirDist = path.resolve(__dirname, "../assets/" + name + "-inline-translation");
      const dirSrc = path.resolve(__dirname, "src/" + name + "-inline-translation");
      let dirEntry = `${dirSrc}/index.js`;

      if (name === 'block') {
        dirEntry = `${dirSrc}/editor-assets/index.ts`;
      }

      return {
        ...customConfig(argv),
        entry: {
          index: dirEntry,
        },
        output: {
          path: dirDist,
          filename: "[name].js",
          publicPath: "/",
        },
      }
    });

    const commonInlineModule = {
      ...customConfig(argv),
      entry: {
        index: path.resolve(__dirname, "src/inline-translate-modal/modal/index.tsx"),
      },
      output: {
        path: path.resolve(__dirname, "../assets/inline-translate-modal"),
        filename: "[name].js",
        publicPath: "/",
      },
    };

    return [...inlineConfigDirectories, commonInlineModule];
  } else {
    return defaultConfig;
  }
};
