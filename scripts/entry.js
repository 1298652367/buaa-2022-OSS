const { version } = require('../package.json');
const { HTMLTempalate } = require('./utils');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const independentEntry = process.env.independentEntry === 'true';
// const argv = require('minimist')(process.argv.slice(2));

// const reportJsTransform = () => {
//   const appName = 'full';
//   return [
//     {
//       from: path.join(__dirname, '../static/js/report.js'),
//       to: path.join(__dirname, '../extension/js/report.js'),
//       transform: function(content) {
//         let newContent = content.toString();
//         newContent = newContent.replace(/%APP_NAME%/g, appName).replace(/%CHANNEL_ID%/g, argv.channel || '');
//         return Buffer.from(newContent);
//       },
//     },
//   ];
// };

const config = (() => {
  let _config = {};

  _config = {
    entry: {
      options: './options/options.js',
      popup: './popup/index.js',
      collectBox: './collectBox/collectBox.js',
    },
    independentEntry: {
      content: './content/index.js',
      serviceWorker: './background/index.js',
    },
    plugins: [],
    pages: [
      HTMLTempalate('', 'popup.html', 'popup/popup.ejs', ['popup']),
      HTMLTempalate('CSDN-设置', 'options.html', 'options/options.ejs', ['options']),
      HTMLTempalate('', 'collect-box.html', 'collectBox/collect-box.ejs', ['collectBox']),
    ],
    independentEntryPages: [],
  };

  if (![independentEntry].some(Boolean)) {
    const copyPlugins = [
      // manifest
      {
        from: 'manifest.json',
        to: 'manifest.json',
        transform: content => {
          const jsonContent = JSON.parse(content);
          jsonContent.version = version;

          return JSON.stringify(jsonContent, null, 2);
        },
      },
      { from: path.join(__dirname, '../', 'static') },
      // ...reportJsTransform(),
    ];
    _config.plugins = [..._config.plugins, new CopyPlugin(copyPlugins)];
  }

  if (independentEntry) {
    _config.plugins = [..._config.plugins, ..._config.independentEntryPages];
  }

  return _config;
})();

module.exports = config;
