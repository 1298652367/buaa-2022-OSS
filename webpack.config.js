const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const vueLoaderConfig = require('./scripts/vue-loader.conf');
const isDevServer = process.env.devServer === 'true';
const isWEB = process.env.WEB === 'true';
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
// 是web才去判断，插件环境始终是/
const assetsPublicPath = isWEB ? (process.env.NODE_ENV === 'development' ? '/' : 'https://csdnimg.cn/release/so-fe-v2/') : '/';
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const independentEntry = process.env.independentEntry === 'true';

// const ExtensionReloader = require('webpack-extension-reloader');
// if (config.mode === 'production') {
//   config.plugins.push(new BundleAnalyzerPlugin());
// }
const entryConfig = require('./scripts/entry.js');
const optimization = require('./scripts/optimization.js');
const envConfig = require('./scripts/env.js');

const config = {
  mode: process.env.NODE_ENV || 'development',
  context: path.join(__dirname, 'src'),
  devtool: false,
  output: {
    publicPath: assetsPublicPath,
    path: path.join(__dirname, isWEB ? 'dist' : 'extension'),
    chunkFilename: isWEB ? 'js/[name]-[hash:8].js' : 'js/[name].js',
    filename: pathData => {
      const chunkName = pathData.chunk.name;
      if (chunkName === 'serviceWorker') {
        console.log(pathData.chunk.name);
        return '[name].js';
      } else {
        return isWEB ? 'js/[name]-[hash:8].js' : 'js/[name].js';
      }
    },
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@common': path.resolve(__dirname, 'src/common/'),
      '@options': path.resolve(__dirname, 'src/options/'),
      '@background': path.resolve(__dirname, 'src/background/'),
      '@ant-design/icons/lib/dist$': path.resolve(__dirname, 'src/utils/ant-icons.js'),
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(css|sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: false, importLoaders: 1 } },
          // { loader: 'postcss-loader', options: { sourceMap: true } },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              data: '$assetsPublicPath: "' + assetsPublicPath + '";',
            },
          },
        ],
      },
      {
        test: /\.raw\.(svg|txt)$/,
        loader: 'raw-loader',
        include: [path.resolve(__dirname, './src/newTab')],
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [path.resolve(__dirname, './src/newTab/icons')],
        options: {
          symbolId: 'icon-[name]',
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
        loader: 'file-loader',
        exclude: [path.resolve(__dirname, './src/newTab/icons'), /\.raw\.(svg|txt)$/],
        options: {
          name: '[path][name].[ext]',
          outputPath: 'images/',
          emitFile: true,
          esModule: false,
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
          outputPath: '/fonts/',
          emitFile: true,
          esModule: false,
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      path: path.join(__dirname, 'extension'),
      ignoreOrder: true,
      filename: isWEB ? 'css/[name]-[hash:8].css' : 'css/[name].css',
    }),
    // lodash
    new LodashModuleReplacementPlugin(),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh_CN|en_GB/),
  ],
  performance: { hints: false },
};

if (config.mode === 'production') {
  // config.plugins.push(new BundleAnalyzerPlugin());
}

if (process.env.HMR !== 'true' && !independentEntry) {
  config.plugins.push(new CleanWebpackPlugin());
} else {
  // config.plugins = (config.plugins || []).concat([
  //   new ExtensionReloader({
  //     port: 9090,
  //     reloadPage: true,
  //     manifest: path.join(__dirname, './src/manifest.json'),
  //   }),
  // ]);
}

if (isDevServer) {
  config.devServer = {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
    // https: true,
    disableHostCheck: true,
    overlay: true,
    openPage: 'https://loc-plugin.csdn.net:8080/',
  };
}

module.exports = (env, argv) => {
  if (config.mode === 'development') {
    return {
      ...config,
      entry: { ...entryConfig.independentEntry, ...entryConfig.entry },
      plugins: [...config.plugins, ...entryConfig.plugins, ...entryConfig.pages, ...envConfig],
      ...optimization,
    };
  } else {
    return entryConfig.independentEntry && independentEntry
      ? {
          ...config,
          entry: entryConfig.independentEntry,
          plugins: [...config.plugins, ...entryConfig.plugins, ...envConfig],
          ...optimization,
        }
      : {
          ...config,
          entry: entryConfig.entry,
          plugins: [...config.plugins, ...entryConfig.plugins, ...entryConfig.pages, ...envConfig],
          ...optimization,
        };
  }
};
