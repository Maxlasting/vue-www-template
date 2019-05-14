const webpack = require('webpack')
const { join } = require('path')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const WebpackProgressOraPlugin = require('webpack-progress-ora-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(baseConfig, {
  output: {
    filename: 'assets/[name].[chunkhash].js',
  },
  devtool: 'cheap-module-source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    // runtimeChunk: {
    //   name: 'manifest',
    // },
  },
  plugins: [
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css(\?.*)?$/,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: [
          'default',
          {
            discardComments: { removeAll: true }
          }
        ]
      },
      canPrint: true,
    }),
    new WebpackProgressOraPlugin({
      clear: true,
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/[name].[contenthash].css'
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*'],
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: join(__dirname, '..', 'index.html'),
      minify: {
        removeComments: true,  // 移除注释
        collapseWhitespace: true, // 去除空格和换行
        removeAttributeQuotes: true // 尽可能移除属性中的引号和空属性
        // 更多配置:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      inject: true,
      // 定义排序规则
      chunksSortMode: 'dependency',
    }),
    new webpack.NamedChunksPlugin(),
  ],
})
