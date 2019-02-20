const { join } = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const cssLoaderConfig = function (loader) {
  const base = isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader
  return [base, 'css-loader', 'postcss-loader'].concat(loader === 'css-loader' ? [] : [loader])
}

const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  module: {
    rules: [
      {
        test: /\.js(\?.*)?$/,
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
          limit: 10240,
          name: 'assets/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          name: 'assets/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css(\?.*)?$/,
        use: cssLoaderConfig('css-loader')
      },
      {
        test: /\.less(\?.*)?$/,
        use: cssLoaderConfig('less-loader')
      },
      {
        test: /\.s(a|c)ss(\?.*)?$/,
        use: cssLoaderConfig('sass-loader')
      },
      {
        test: /\.styl(us)?(\?.*)?$/,
        use: cssLoaderConfig('stylus-loader')
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].css' : '[name].css?fq-[contenthash]'
    })
  ]
}
