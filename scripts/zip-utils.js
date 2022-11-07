const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const archiver = require('archiver');
const DEST_DIR = path.join(__dirname, '../extension');
const { version } = require('../package.json');
const DEST_ZIP_DIR = path.join(__dirname, `../release/${version}`);

const buildZip = (src, dist, zipFilename) => {
  console.info(`Building ${zipFilename}...`);
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(path.join(dist, zipFilename));
  return new Promise((resolve, reject) => {
    archive
      .directory(src, false)
      .on('error', err => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
};

const main = async (zipName = '', filePath = '') => {
  zipName = zipName || `csdn_chrome_plugin_v${version}_JSON.zip`;
  filePath = filePath ? path.join(__dirname, filePath) : DEST_ZIP_DIR;
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath);
  }
  buildZip(DEST_DIR, filePath, zipName)
    .then(() => console.log(chalk.green(`📦 Build zip Success, FileName: ${zipName}`)))
    .catch(console.err);
};

module.exports = main;
