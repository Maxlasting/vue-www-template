const webpack = require('webpack')
const merge = require('webpack-merge')
const WebpackProgressOraPlugin = require('webpack-progress-ora-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const baseConfig = require('./webpack.base.config.js')

const nodeEnv = process.env.NODE_ENV

console.log(`当前环境变量 ======> ${nodeEnv}`)

const config = merge(baseConfig, {
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: {
      name: 'manifest'
    }
  },
  devtool: false,
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(nodeEnv)
    }),
    new WebpackProgressOraPlugin({ clear: true }),
    new webpack.NamedChunksPlugin()
  ]
})

if (nodeEnv === 'production') {
  config.output.filename = '[name].js?fq-[chunkhash]'

  config.plugins.push(
    new OptimizeCssAssetsWebpackPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        discardComments: { removeAll: true }
      },
      canPrint: true
    })
  )
}

module.exports = config
