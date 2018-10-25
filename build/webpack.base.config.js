const HtmlWebpackPlugin = require('html-webpack-plugin')
const { join } = require('path')
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
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'images/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'medias/[name].[ext]?[hash]'
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: join(__dirname, '../index.html')
    }),
    new NotifierPlugin({
      title: '编译完成...',
      alwaysNotify,
      contentImage: join(__dirname, '../logo.png')
    })
  ]
}

module.exports = config
