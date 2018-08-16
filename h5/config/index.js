// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var devEnv = require('./dev.env')
module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8881,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // 会员中心
      '/uc': {
        target: JSON.parse(devEnv.UC_URL),
        changeOrigin: true
      },
      // 商品系统
      '/goods': {
        target: JSON.parse(devEnv.GOODS_URL),
        changeOrigin: true
      },
      // 广告系统
      '/advert': {
        target: JSON.parse(devEnv.ADVERT_URL),
        changeOrigin: true,
      },
      // 广告系统
      '/market': {
        target: JSON.parse(devEnv.ADVERT_URL),
        changeOrigin: true,
        pathRewrite: {
          '^/market': '/advert'
        }
      },
      '/order': {
        target: JSON.parse(devEnv.ORDER_URL),
        changeOrigin: true
      },
      '/common': {
        target: JSON.parse(devEnv.COMMON_URL),
        changeOrigin: true
      },
      '/reportform': {
        target: JSON.parse(devEnv.REPORT_URL),
        changeOrigin: true
      }
    },
    cssSourceMap: false
  }
}
