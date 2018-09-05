const webpack = require('webpack')
const { join } = require('path')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackProgressOraPlugin = require('webpack-progress-ora-plugin')

const nodeEnv = process.env.NODE_ENV || 'development'
const baseConfig = require('./webpack.base.config.js')

console.log(`当前环境变量 ======> ${nodeEnv}`)

const config = merge(baseConfig, {
  devtool: false,
  output: {
    filename: '[name]-[chunkhash].js'
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
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
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(nodeEnv)
    }),
    new WebpackProgressOraPlugin({ clear: true }),
    new webpack.NamedChunksPlugin()
  ]
})

module.exports = config
