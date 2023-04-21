'use strict';

const autoprefixer = require('autoprefixer');
const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInjectPreload = require('@principalstudio/html-webpack-inject-preload');
const { merge } = require('webpack-merge');

// DEPLOY_PATH is set by the s3-deploy-action its value will be:
// `branch/[branch-name]/` or `version/[tag-name]/`
// See the following documentation for more detail:
//   https://github.com/concord-consortium/s3-deploy-action/blob/main/README.md#top-branch-example
const DEPLOY_PATH = process.env.DEPLOY_PATH;

// build-info.json is generated in the root build step but not in the individual sim build steps
// so it might not exist if the sim build command is used and in that case don't add a zip extension
let zipExtension = '';
const buildInfoPath = path.resolve(__dirname, '..', 'dist', "build-info.json");
if (fs.existsSync(buildInfoPath)) {
  const buildInfo = require(buildInfoPath);
  if (buildInfo.zipExtension) {
    zipExtension = `-${buildInfo.zipExtension}`;
  }
}

module.exports = (env, argv, simulationDirname, customizations) => {
  const devMode = argv.mode !== 'production';
  const simName = path.basename(simulationDirname);
  const simPath = path.resolve(simulationDirname, '..', 'dist', simName);

  const common = {
    context: simulationDirname, // to automatically find tsconfig.json
    devServer: {
      hot: true,
      allowedHosts: "all"
    },
    devtool: devMode ? 'eval-cheap-module-source-map' : 'source-map',
    entry: './src/index.tsx',
    mode: 'development',
    output: {
      // set the path to be ../dist/${simName}
      path: simPath,
      filename: 'assets/index.[contenthash].js',
    },
    performance: { hints: false },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader'
        },
        // This code coverage instrumentation should only be added when needed. It makes
        // the code larger and slower
        process.env.CODE_COVERAGE ? {
          test: /\.[tj]sx?$/,
          loader: 'istanbul-instrumenter-loader',
          options: { esModules: true },
          enforce: 'post',
          exclude: path.join(simulationDirname, 'node_modules'),
        } : {},
        {
          test: /\.(sa|sc|le|c)ss$/i,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: `[name]-[local]`
                },
                sourceMap: true,
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [autoprefixer()]
                }
              }
            },
            'sass-loader'
          ]
        },
        {
          test: /\.(png|jpg|woff|woff2|eot|ttf|mp3)$/,
          type: 'asset'
        },
        { // disable svgo optimization for files ending in .nosvgo.svg
          test: /\.nosvgo\.svg$/i,
          loader: '@svgr/webpack',
          options: {
            svgo: false
          }
        },
        {
          test: /\.svg$/i,
          exclude: /\.nosvgo\.svg$/i,
          oneOf: [
            {
              // Do not apply SVGR import in CSS files.
              issuer: /\.(css|scss|less)$/,
              type: 'asset'
            },
            {
              issuer: /\.tsx?$/,
              loader: '@svgr/webpack',
              options: {
                svgoConfig: {
                  plugins: [
                    {
                      // cf. https://github.com/svg/svgo/releases/tag/v2.4.0
                      name: 'preset-default',
                      params: {
                        overrides: {
                          // don't minify "id"s (i.e. turn randomly-generated unique ids into "a", "b", ...)
                          // https://github.com/svg/svgo/blob/master/plugins/cleanupIDs.js
                          cleanupIDs: { minify: false },
                          // leave <line>s, <rect>s and <circle>s alone
                          // https://github.com/svg/svgo/blob/master/plugins/convertShapeToPath.js
                          convertShapeToPath: false,
                          // leave "class"es and "id"s alone
                          // https://github.com/svg/svgo/blob/master/plugins/prefixIds.js
                          prefixIds: false,
                          // leave "stroke"s and "fill"s alone
                          // https://github.com/svg/svgo/blob/master/plugins/removeUnknownsAndDefaults.js
                          removeUnknownsAndDefaults: { defaultAttrs: false },
                          // leave viewBox alone
                          removeViewBox: false
                        }
                      }
                    }
                  ]
                }
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: [ '.ts', '.tsx', '.js' ]
    },
    stats: {
      // suppress "export not found" warnings about re-exported types
      warningsFilter: /export .* was not found in/
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/index.html',
        publicPath: '.',
        templateParameters: {
          language: 'en'
        },
      }),
      new HtmlWebpackPlugin({
        filename: 'index-es.html',
        template: 'src/index.html',
        publicPath: '.',
        templateParameters: {
          language: 'es'
        },
      }),
      new HtmlWebpackInjectPreload({
        // Preload PNG and SVG images.
        files: [
          {
            match: /\.(png|svg)$/,
            attributes: {as: 'image'},
          }
        ]
      }),
      ...(DEPLOY_PATH ? [new HtmlWebpackPlugin({
        filename: 'index-top.html',
        template: 'src/index.html',
        publicPath: `../${DEPLOY_PATH}/${simName}`,
        templateParameters: {
          language: 'en'
        },
      })] : [])
    ]
  };

  return merge(common, customizations);
};
