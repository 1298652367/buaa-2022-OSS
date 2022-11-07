const isJSON = process.env.JSON === 'true';
const independentEntry = process.env.independentEntry === 'true';
const isQrCode = process.env.QRCODE === 'true';

const optimization = (() => {
  const mode = process.env.NODE_ENV || 'development';
  const config = {};

  if (isJSON || isQrCode || independentEntry) {
    return mode === 'production'
      ? {
          optimization: {
            minimize: true,
          },
        }
      : {};
  } else if (mode === 'development') {
    config.optimization = {
      minimize: false,
    };
    config.devtool = 'cheap-module-source-map';
  } else if (mode === 'production') {
    config.optimization = {
      splitChunks: {
        chunks: 'all',
        minChunks: 2,
        cacheGroups: {
          vendors: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: -20,
          },
          vueChunk: {
            name: 'vue-chunk',
            test: /[\\/]node_modules[\\/]vue[\\/]/,
            priority: -15,
          },
          antDesignVue: {
            name: 'ant-design-chunk',
            test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/,
            priority: -10,
          },
        },
      },
    };
  }
  return config;
})();

module.exports = optimization;
