const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')
const Webpackbar = require('webpackbar')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

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

const config = merge(baseConfig, {
  output: {
    filename: '[name].js',
    publicPath: userConfig.dev.publicPath,
  },
  devtool: '#cheap-module-source-map',
  plugins: [
    new Webpackbar({ color: '#f46a97' }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    host: '0.0.0.0',
    port: userConfig.dev.port,
    hot: true,
    open: false,
    contentBase: false,
    quiet: true,
    progress: false,
    proxy: userConfig.dev.proxy,
    clientLogLevel: 'none',
    overlay: {
      warnings: true,
      errors: true,
    },
    historyApiFallback: {
      index: userConfig.dev.publicPath + 'index.html'
    },
  }
})

module.exports = new Promise(async (resolve, reject) => {
  portfinder.basePort = process.env.PORT || userConfig.dev.port || 8080
  portfinder.getPort((err, port) => {
    if (err) return reject(err)
    config.devServer.port = port
    config.plugins.push(
      new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`您的项目运行在 http://localhost:${port}`],
          notes: [`您也可以查看您的 电脑ip + 端口号 (http://${iptools()}:${port}) 来访问！`]
        },
        clearConsole: true,
      })
    )
    resolve(config)
  })
})
