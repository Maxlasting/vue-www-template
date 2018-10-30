const webpack = require('webpack')
const merge = require('webpack-merge')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const Webpackbar = require('webpackbar')
const { host, port, open, hot, proxy, contentBase, publicPath } = require('../config.js')
const baseConfig = require('./webpack.base.config.js')
const nodeEnv = process.env.NODE_ENV

console.log(`当前环境变量 ======> ${nodeEnv}`)

const os = require('os')
const interfaces = os.networkInterfaces()

let ip = '0.0.0.0'

for (let key in interfaces) {
  const items = interfaces[key]
  for (let i=0; i<items.length; i++) {
    const item = items[i]
    if (item.family === 'IPv4' && !item.internal && item.address !== '127.0.0.1') {
      ip = item.address
    }
  }
}

const config = merge(baseConfig, {
  devtool: '#cheap-module-source-map',
  plugins: [
    new Webpackbar({ color: '#f46a97' }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(nodeEnv)
    }),
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`您的项目运行在 http://localhost:${port}`],
        notes: [`您也可以查看您的 电脑ip + 端口号 (http://${ip}:${port}) 来访问！`]
      },
      clearConsole: true
    })
  ],
  devServer: {
    host,
    port,
    open,
    hot,
    proxy,
    contentBase,
    clientLogLevel: 'none',
    overlay: { warnings: true, errors: true },
    quiet: true,
    progress: false,
    historyApiFallback: {
      index: publicPath + 'index.html'
    }
  }
})

module.exports = config
