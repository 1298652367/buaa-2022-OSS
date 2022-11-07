// const path = require('path');
const { version } = require('../package.json');
// const fs = require('fs-extra');
const webpack = require('webpack');
const isQrCode = process.env.QRCODE === 'true';
const isWEB = process.env.WEB === 'true';
const isJSON = process.env.JSON === 'true';
const hasTab = !(process.env.TAB === 'false');
const assetsPublicPath = isWEB ? (process.env.NODE_ENV === 'development' ? '/' : 'https://csdnimg.cn/release/so-fe-v2/') : '/';

// function findThemes(type) {
//   return fs
//     .readdirSync(path.join('./static', 'vendor/codemirror/theme', type))
//     .filter(function(filename) {
//       return /\.css$/.test(filename);
//     })
//     .map(function(theme) {
//       return theme.replace(/\.css$/, '');
//     });
// }
// const THEMES = (function() {
//   return JSON.stringify({
//     dark: findThemes('dark'),
//     light: findThemes('light'),
//   });
// })();

const getAppName = function() {
  let appName = '';
  if (isJSON) {
    appName = 'json';
  } else if (!hasTab) {
    appName = 'noTab';
  } else if (isQrCode) {
    appName = 'qrcode';
  } else {
    appName = 'full';
  }
  return appName;
};

const envs = (() => {
  const mode = process.env.NODE_ENV || 'development';
  let _plugins = [];

  if (mode === 'production') {
    _plugins = [
      new webpack.DefinePlugin({
        'process.env': {
          version: `"${version}"`,
          HTTP: `"${process.env.HTTP}"`,
          NODE_ENV: '"production"',
          // THEMES: THEMES,
          assetsPublicPath: '"' + assetsPublicPath + '"',
          TAB_API: '"https://bizapi.csdn.net/searchplugin"',
          isJSON: isJSON,
          isQrCode: isQrCode,
          isWEB: isWEB,
          isToolsBox: !hasTab,
          APPName: `"${getAppName()}"`,
        },
      }),
    ];
  }
  if (mode === 'development') {
    _plugins = [
      new webpack.DefinePlugin({
        'process.env': {
          version: `"${version}"`,
          HTTP: `"${process.env.HTTP}"`,
          TAB_API: '"https://bizapi.csdn.net/searchplugin"',
          // assetsPublicPath: '"https://csdnimg.cn/release/so-fe-v2/"',
          assetsPublicPath: '"' + assetsPublicPath + '"',
          // THEMES: THEMES,
          // 是JSON版
          isJSON: isJSON,
          // 是二维码版
          isQrCode: isQrCode,
          // 是网页版
          isWEB: isWEB,
          // 是否是开发者工具箱
          isToolsBox: !hasTab,
          APPName: `"${getAppName()}"`,
        },
      }),
    ];
  }
  return _plugins;
})();

module.exports = envs;
