const webpack = require('webpack')
const merge = require('webpack-merge')
const WebpackProgressOraPlugin = require('webpack-progress-ora-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

const nodeEnv = process.env.NODE_ENV || 'development'
const baseConfig = require('./webpack.base.config.js')

console.log(`当前环境变量 ======> ${nodeEnv}`)

const config = merge(baseConfig, {
  devtool: false,
  output: {
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(nodeEnv)
    }),
    new WebpackProgressOraPlugin({ clear: true }),
    new webpack.NamedChunksPlugin()
  ]
})

config.plugins.push(
  new OptimizeCssAssetsWebpackPlugin({
    cssProcessor: require('cssnano'),
    cssProcessorOptions: {
      discardComments: { removeAll: true }
    },
    canPrint: true
  })
)

config.optimization = {
  minimize: true,
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      styles: {
        name: 'styles',
        test: /\.css$/,
        chunks: 'all',
        enforce: true
      },
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendor',
        priority: 10,
        enforce: true
      }

    }
  },
  runtimeChunk: {
    name: 'manifest'
  }
}

module.exports = config
