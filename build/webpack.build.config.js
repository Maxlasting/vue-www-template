const webpack = require('webpack')
const merge = require('webpack-merge')
const WebpackProgressOraPlugin = require('webpack-progress-ora-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const baseConfig = require('./webpack.base.config.js')

const nodeEnv = process.env.NODE_ENV
const isDev = nodeEnv === 'development'

console.log(`当前环境变量 ======> ${nodeEnv}`)

const config = merge(baseConfig, {
  output: {
    filename: isDev ? '[name].js' : '[name]-[chunkhash].js'
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.styl(us)?$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'stylus-loader'
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /css$/,
          enforce: true
        },
        vendor: {
          name: 'vendor',
          test: /[\/]node_modules[\/]/,
          enforce: true
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(nodeEnv)
    }),
    new WebpackProgressOraPlugin({ clear: true }),
    new webpack.NamedChunksPlugin(),
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].css' : '[name]-[contenthash].css'
    })
  ]
})

if (!isDev) {
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
