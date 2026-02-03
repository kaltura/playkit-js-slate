const path = require('path');
packageData = require('./package.json');
const {insertStylesWithNonce} = require('@playkit-js/webpack-common');

module.exports = (env, { mode }) => {
  return {
    target: 'web',
    entry: './src/index.ts',
    optimization: {
      minimize: mode !== 'development'
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: { configFile: mode === 'development' ? 'tsconfig.dev.json' : 'tsconfig.json' },
          exclude: /node_modules/
        },
        {
          test: /\.scss/,
          use: [
              {
                loader: 'style-loader',
                options: {
                  injectType: "singletonStyleTag",
                  attributes: {
                    id: `${packageData.name}`
                  },
                  insert: insertStylesWithNonce
                }
              },
            {
              loader: 'css-loader',
              options: {
                esModule: true,
                modules: {
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                  namedExport: true
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: mode === 'development'
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    output: {
      filename: 'playkit-slate.js',
      path: path.resolve(__dirname, 'dist'),
      library: ['KalturaPlayer', 'plugins', 'slate'],
      clean: true
    },
    externals: {
      '@playkit-js/kaltura-player-js': 'root KalturaPlayer',
      '@playkit-js/playkit-js': 'root KalturaPlayer.core',
      preact: 'root KalturaPlayer.ui.preact'
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'demo')
      },
      client: {
        progress: true
      }
    }
  };
};
