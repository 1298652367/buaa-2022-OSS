#!/usr/bin/env node
const inquirer = require('inquirer');
const chalk = require('chalk');
const { version } = require('../package.json');
const execa = require('execa');
const zipBuild = require('./zip-utils');
// console.log(chalk.green('开始打包任务'));

// dev => 选择版本(json,web) => 生产还是测试 => 执行
// prod => 选择版本 => (输入渠道ID) => 是否生成zip => 执行

const BUILD_TYPES = {
  FULL: 'full',
  DEVELOP_TOOLBOX: 'toolBox',
  JSON: 'json',
  QRCODE: 'qrcode',
};

const buildTypes = [
  {
    name: 'CSDN浏览器助手',
    value: BUILD_TYPES.FULL,
    run: ['run', 'build'],
    zipName: 'csdn_chrome_plugin',
  },
  {
    name: '开发者工具箱(无新标签页版)',
    value: BUILD_TYPES.DEVELOP_TOOLBOX,
    run: ['run', 'build'],
    zipName: 'csdn_chrome_plugin_toolBox',
  },
  {
    name: 'JSON格式化工具',
    value: BUILD_TYPES.JSON,
    run: '',
    zipName: 'csdn_chrome_plugin_json',
  },
  {
    name: '二维码助手',
    value: BUILD_TYPES.QRCODE,
    run: '',
    zipName: 'csdn_chrome_plugin_qrcode',
  },
];

const release = async () => {
  const { types, reportId, isBuildZip } = await inquirer.prompt([
    {
      type: 'checkbox', // 这是一个多选型问题
      name: 'types',
      message: '选择打包插件类型',
      pageSize: 5,
      choices: buildTypes,
    },
    {
      type: 'input',
      name: 'reportId',
      message: '请填写上报渠道ID',
    },
    {
      type: 'confirm',
      name: 'isBuildZip',
      message: '是否生成ZIP压缩包',
    },
  ]);
  for (let i = 0; i < types.length; i++) {
    await tasks.build[types[i]]({ reportId, isBuildZip });
  }
};

const tasks = {
  build: {
    [BUILD_TYPES.FULL]: async options => {
      const { reportId, isBuildZip } = options;
      await execa('npm', ['run', 'build:normalEntry', '--', `--channel=${reportId}`], { stdio: 'inherit' });
      await execa('npm', ['run', 'build:independentEntry', '--', `--channel=${reportId}`], { stdio: 'inherit' });
      if (isBuildZip) {
        await zipBuild(`csdn_chrome_plugin${reportId ? '_' + reportId : ''}_v${version}.zip`);
      }
    },
    [BUILD_TYPES.DEVELOP_TOOLBOX]: async options => {
      const { reportId, isBuildZip } = options;
      await execa('npm', ['run', 'build:notab:normalEntry', '--', `--channel=${reportId}`], { stdio: 'inherit' });
      await execa('npm', ['run', 'build:notab:independentEntry', '--', `--channel=${reportId}`], { stdio: 'inherit' });
      if (isBuildZip) {
        await zipBuild(`csdn_chrome_plugin_toolbox${reportId ? '_' + reportId : ''}_v${version}.zip`);
      }
    },
    [BUILD_TYPES.JSON]: async options => {
      const { reportId, isBuildZip } = options;
      await execa('npm', ['run', 'build:json', '--', `--channel=${reportId}`], { stdio: 'inherit' });
      if (isBuildZip) {
        await zipBuild(`csdn_chrome_plugin_json${reportId ? '_' + reportId : ''}_v${version}.zip`);
      }
    },
    [BUILD_TYPES.QRCODE]: async options => {
      const { reportId, isBuildZip } = options;
      await execa('npm', ['run', 'build:qrcode', '--', `--channel=${reportId}`], { stdio: 'inherit' });
      if (isBuildZip) {
        await zipBuild(`csdn_chrome_plugin_qrcode${reportId ? '_' + reportId : ''}_v${version}.zip`);
      }
    },
  },
};

release()
  .then(() => {
    console.log(chalk.green('🍺 打包任务结束'));
  })
  .catch(err => {
    console.log(chalk.red(err));
    process.exit(1);
  });
