module.exports = {
  plugins: [['import', { libraryName: 'ant-design-vue', libraryDirectory: 'lib', style: 'css' }], 'lodash'],
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
  ],
};
