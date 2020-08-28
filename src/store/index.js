import Vue from 'vue'
import Vuex from 'vuex'
import MainCommon from './modules/main-common'
// 自定义全局 数据池处理 main 定义名称均为微应用名称
// import _________ from './modules/main-self'
Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    MainCommon,
    // _________
  }
})
