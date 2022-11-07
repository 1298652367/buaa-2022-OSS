const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const isWEB = process.env.WEB === 'true';

exports.cssLoaders = function(options) {
  options = options || {};

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap,
    },
  };
  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap,
    },
  };
  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    // const config = require('../config');
    const loaders = [cssLoader];
    // const assetsSubDirectory = process.env.NODE_ENV === 'production' ? config.build.assetsSubDirectory : config.dev.assetsSubDirectory;
    if (options.usePostCSS) {
      loaders.push(postcssLoader);
    }
    if (loader) {
      loaders.push({
        loader: `${loader}-loader`,
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap,
        }),
      });
    }
    return [
      'css-hot-loader',
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: '../'.repeat(''.split('/').length + 1),
          ...(options.extract
            ? {}
            : {
                hmr: true,
                reloadAll: true,
              }),
        },
      },
      ...loaders,
    ];
  }
  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus'),
  };
};

// HTML 模版
exports.HTMLTempalate = function(title, filename, template, chunks, options = {}) {
  return new HtmlWebpackPlugin({
    title: title,
    hash: true,
    cache: true,
    inject: 'body',
    filename: (isWEB ? './' : './pages/') + filename,
    template: path.resolve(__dirname, '../src/' + template),
    chunks: chunks,
    ...options,
  });
};

// CopyPlugin { from: 'options/options.html', to: 'options/options.html', transform: transformHtml },
// exports.transformHtml = function(content) {
//   return ejs.render(content.toString(), {
//     ...process.env,
//   });
// };
