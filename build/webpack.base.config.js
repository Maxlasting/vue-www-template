const HtmlWebpackPlugin = require('html-webpack-plugin')
const { join } = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const NotifierPlugin = require('webpack-Notifier')
const staticLoaders = require('./static-loader.js')
const { publicPath, alwaysNotify } = require('../config.js')

const config = {
  mode: process.env.NODE_ENV,
  target: 'web',
  entry: {
    app: join(__dirname, '../src/', 'index.js')
  },
  output: {
    path: join(__dirname, '../dist'),
    publicPath
  },
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [join(__dirname, '../src')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: true
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          join(__dirname, '../src')
        ],
        exclude: /(node_modules)/
      },
      ...staticLoaders(MiniCssExtractPlugin)
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: join(__dirname, '../index.html')
    }),
    new VueLoaderPlugin(),
    new NotifierPlugin({
      title: '编译完成...',
      alwaysNotify,
      // contentImage: join(__dirname, '../logo.png')
    })
  ]
}

module.exports = config
