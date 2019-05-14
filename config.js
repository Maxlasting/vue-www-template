const { join } = require('path')

const rp = arr => {
  const max = Math.max(...arr)
  const min = Math.min(...arr)
  return Math.round(
    Math.random() * (max - min) + min
  )
}

const port = 8000 + rp([0, 9]) * 100 + rp([0, 9]) * 10 + rp([0, 9])

module.exports = {
  build: {
    publicPath: '',
    postcss: true,
  },
  devServer: {
    host: '0.0.0.0',
    port,
    // 代理服务配置，详见 https://webpack.js.org/configuration/dev-server/#devserver-proxy
    proxy: {},
    contentBase: join(__dirname, 'public'),
    open: true,
  },
  plugins: {
    alwaysNotify: false,
  },
}

