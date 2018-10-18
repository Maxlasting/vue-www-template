const HtmlWebpackPlugin = require('html-webpack-plugin')
const { join } = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const NotifierPlugin = require('webpack-Notifier')
const { publicPath, alwaysNotify } = require('../config.js')

const cssLoader = (MiniCssExtractPlugin) => {
  const loaderMap = new Map([
    [/\.css$/, 'css-loader'],
    [/\.scss$/, 'sass-loader'],
    [/\.less$/, 'less-loader'],
    [/\.styl(us)?$/, 'stylus-loader']
  ])

  const loader = ([test, loader]) => {
    const use = ['vue-style-loader', 'css-loader', 'postcss-loader']

    if (loader !== 'css-loader') use.push(loader)

    if (process.env.NODE_ENV === 'production') {
      use.shift()
      use.shift()
      use.unshift(MiniCssExtractPlugin.loader, { loader: 'css-loader', options: { minimize: true } })
    }

    return { test, use }
  }

  return [...loaderMap].map(item => loader(item))
}

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
  resolve: {
    alias: {
      vue: join(__dirname, '../node_modules/vue/dist/vue.runtime.js'),
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          join(__dirname, '../src')
        ],
        exclude: /(node_modules)/
      },
      {
        test: /\.(png|jpe?g|gif|svg|mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          name: 'assets/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      ...cssLoader(MiniCssExtractPlugin)
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
      contentImage: join(__dirname, '../logo.png')
    })
  ]
}

console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: process.env.TEST_ENV ? '[name].css' : '[name]-[contenthash].css'
    })
  )
}

module.exports = config
