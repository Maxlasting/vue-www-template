const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const WebpackNotifier = require('webpack-notifier')
const { join } = require('path')

const isDev = process.env.NODE_ENV === 'development'
const userConfig = require('../config.js')
const styleLoaders = require('./styles-loaders.js')

module.exports = {
  mode: process.env.NODE_ENV,
  target: 'web',
  entry: {
    main: join(__dirname, '..', 'src', 'index.js')
  },
  output: {
    path: join(__dirname, '../dist'),
    publicPath: userConfig.build.publicPath,
  },
  performance: {
    hints: false,
  },
  resolve: {
    alias: {
      vue: join(
        __dirname, '..', 'node_modules', 'vue', 'dist', 'vue.runtime.js'
      ),
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /(node_modules)/,
      },
      {
        // 对图片文件进行打包编译
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          // 文件的大小小于10000字节(10kb)的时候会返回一个dataUrl
          limit: 10000,
          // 生成的文件的保存路径和后缀名称
          name: 'assets/[name].[hash:7].[ext]'
        }
      },
      {
        // 对视频文件进行打包编译
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'assets/[name].[hash:7].[ext]'
        }
      },
      {
        // 对字体文件进行打包编译
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'assets/[name].[hash:7].[ext]'
        }
      },
      ...styleLoaders({
        extract: !isDev,
        postcss: userConfig.build.postcss,
        sourceMap: true,
      }),
    ]
  },
  plugins: [
    new WebpackNotifier({
      title: 'build completed...',
      alwaysNotify: userConfig.plugins.alwaysNotify,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new VueLoaderPlugin(),
  ],
}
