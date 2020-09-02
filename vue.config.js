const path = require('path')
const eslintSorceMap = process.env.NODE_ENV !== 'production' || process.env.NODE_ENV === 'test'
module.exports = {
  lintOnSave: eslintSorceMap,
  publicPath: process.env.NODE_ENV === 'production' ? '/micro-app-login/' : '/',
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    output: {
      // 微应用的包名，这里与主应用中注册的微应用名称一致
      library: 'MicroAppLogin',
      // 将你的 library 暴露为所有的模块定义下都可运行的方式
      libraryTarget: 'umd',
      // 按需加载相关，设置为 webpackJsonp_MicroAppCrm 即可
      jsonpFunction: `webpackJsonp_MicroAppLogin`
    }
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'test') {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin).end()
    }
  },
  // productionSourceMap: eslintSorceMap,
  productionSourceMap: false,
  devServer: {
    // 监听端口
    port: 5800,
    open: false,
    // 关闭主机检查，使微应用可以被 fetch
    disableHostCheck: true,
    // 配置跨域请求头，解决开发环境的跨域问题
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}
