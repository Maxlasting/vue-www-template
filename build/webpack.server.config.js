const webpack = require('webpack')
const { join } = require('path')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')
const Webpackbar = require('webpackbar')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const userConfig = require('../config.js')

const os = require('os')

const iptools = function () {
  let ip = '0.0.0.0'
  let interfaces = os.networkInterfaces()
  for (let key in interfaces) {
    const items = interfaces[key]
    for (let item of items) {
      if (item.family === 'IPv4' && !item.internal && item.address !== '127.0.0.1') {
        ip = item.address
        return ip
      }
    }
  }
}

module.exports = merge(baseConfig, {
  output: {
    filename: '[name].js',
  },
  devtool: '#cheap-module-source-map',
  plugins: [
    new Webpackbar({ color: '#f46a97' }),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`您的项目运行在 http://localhost:${userConfig.devServer.port}`],
        notes: [`您也可以查看您的 电脑ip + 端口号 (http://${iptools()}:${userConfig.devServer.port}) 来访问！`]
      },
      clearConsole: true,
    }),
    new HtmlWebpackPlugin({
      template: join(__dirname, '..', 'index.html'),
      filename: 'index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    ...userConfig.devServer,
    hot: true,
    clientLogLevel: 'none',
    overlay: {
      warnings: true,
      errors: true,
    },
    quiet: true,
    progress: false,
    historyApiFallback: {
      index: baseConfig.output.publicPath + 'index.html'
    },
    stats: {
      colors: true
    },
  }
})

