#!/usr/bin/env node
const isJSON = process.env.JSON === 'true';
const isQrCode = process.env.QRCODE === 'true';
const hasTab = !(process.env.TAB === 'false');
// const isWEB = process.env.WEB === 'true';
const { version } = require('../package.json');
const zipBuild = require('./zip-utils');

// console.log('isJSON', isJSON);
// console.log('isQrCode', isQrCode);
// console.log('isWEB', isWEB);
// console.log('isToolsBox', !hasTab);

const main = async () => {
  let zipName = '';
  if (isJSON) {
    zipName = `csdn_chrome_plugin_v${version}_JSON.zip`;
  } else if (isQrCode) {
    zipName = `csdn_chrome_plugin_v${version}_QrCode.zip`;
  } else {
    zipName = `csdn_chrome_plugin_v${version}${hasTab ? '' : '_NoTab'}.zip`;
  }
  await zipBuild(zipName, '../extension-zip');
};

main();
// const copyFile = () => {
//   var fileName = 'report.js';
//   var sourceFile = path.join(__dirname, fileName);
//   var destPath = path.join(__dirname, '../extension/js/', fileName);
//   return new Promise(resolve => {
//     // 移动
//     // fs.rename(sourceFile, destPath, function(err) {
//     //   if (err) throw err;
//     //   fs.stat(destPath, function(err, stats) {
//     //     if (err) throw err;
//     //     resolve(JSON.stringify(stats));
//     //   });
//     // });
//     var readStream = fs.createReadStream(sourceFile);
//     var writeStream = fs.createWriteStream(destPath);
//     readStream.pipe(writeStream);
//     resolve();
//   });
// };
