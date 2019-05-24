const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isDev = process.env.NODE_ENV === 'development'

const cssLoaders = function () {
  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: isDev
    }
  }
  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: isDev,
      plugins: [
        require('autoprefixer')
      ]
    }
  }

  function generateLoaders (loader, loaderOptions = {}) {
    const loaders = [cssLoader, postcssLoader]

    if (loader) {
      const someLoader = `${loader}-loader`
      const someOptions = Object.assign(
        {}, { sourceMap: isDev, }, loaderOptions
      )
      loaders.push({ loader: someLoader, options: someOptions })
    }

    if (!isDev) {
      loaders.unshift({
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: '../..'
        }
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }

    return loaders
  }

  return {
    // css-loader
    css: generateLoaders(),
    // less-loader
    less: generateLoaders('less'),
    // sass-loader 后面的选项表明sass使用的是缩进的语法
    sass: generateLoaders('sass', { indentedSyntax: true }),
    // scss-loader
    scss: generateLoaders('sass'),
    // stylus-loader stylus文件有两种后缀名.stylus和styl
    stylus: generateLoaders('stylus'),
    // stylus-loader
    styl: generateLoaders('stylus')
  }
}

// 使用这个函数，为那些独立的style文件创建加载器配置。
const styleLoaders = function () {
  // 保存加载器配置的变量
  const output = []
  // 获取所有css文件类型的loaders
  const loaders = cssLoaders()

  // console.log(loaders)

  for (const extension in loaders) {
    const loader = loaders[extension]
    // 生成对应的loader配置
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

module.exports = styleLoaders
