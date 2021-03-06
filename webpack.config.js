const path = require("path");
const webpack = require("webpack");
const { TsConfigPathsPlugin } = require("awesome-typescript-loader");
const HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')


const dev = process.env.NODE_ENV !== 'production'

const extractApp = new ExtractTextPlugin("app.css");
const cssLoaders = [
  {
    loader: "css-loader",
    options: {
      namedExport: true,
      camelCase: true,
      modules: true,
      importLoaders: 2,
      localIdentName: dev
        ? "[local]--[hash:base64:5]"
        : "[hash:base64:5]",
      sourceMap: dev,
      minimize: dev ? false : {
        preset: ["default", {
          discardComments: {
            removeAll: true
          },
          autoprefixer: false,
          zindex: false,
          normalizeUrl: false
        }]
      }
    }
  },
  "postcss-loader"
]

module.exports = {

  context: path.resolve("./"),

  entry: {
    app: dev
      ? [
        "react-hot-loader/patch",
        "webpack-hot-middleware/client",
        "./src/bootstrap.tsx",
      ]
      : "./src/bootstrap.tsx",

    vendor: "./src/vendor.ts"
  },

  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "/"
  },

  resolve: {
    extensions: [".tsx", ".ts", ".css", ".js"],
    plugins: [
      new TsConfigPathsPlugin()
    ],
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: [/node_modules/],
        use: [
          "react-hot-loader/webpack",
          "awesome-typescript-loader"
        ]
      },
      {
        test: /\.svg$|.jpg$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 64000
            }
          }
        ]
      },
      {
        test: /.ttf$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "fonts/[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: dev
          ? [{ loader: "style-loader" }].concat(cssLoaders)
          : extractApp.extract({
            fallback: "style-loader",
            use: cssLoaders
          })
      },
    ]
  },

  devtool: dev
    ? "inline-source-map"
    : "nosources-source-map",

  plugins: [
    new HtmlPlugin({
      template: "./src/index.html"
    }),
    new webpack.ProvidePlugin({
      d3: "d3",
      "window.d3": "d3",
    }),
    extractApp
  ].concat(dev
    ? [
      new webpack.HotModuleReplacementPlugin(),
    ]
    : [
      new UglifyJsPlugin(),
    ]),

  stats: {
    children: false
  }
};
