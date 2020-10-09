import Vue from 'vue'
import App from './App.vue'

// 私有模块
import '@/plugins/Element'
import ElementLocale from 'element-ui/lib/locale'
import i18n from '@/locale'
// 注册全局组件
import '@/plugins/custom'

import './public-path'
import VueRouter from 'vue-router'
import { routes, beforeEach, beforeResolve, afterEach, onError, onReady } from './routes'
import store from './store'
import SharedModule from '@/shared'
import { toStore } from '@/shared/subscript-store'
import { cloneDeep } from 'lodash'
const MICRO_NAME = 'MicroAppLogin'

Vue.use(VueRouter)
ElementLocale.i18n((key, value) => i18n.t(key, value))

Vue.config.productionTip = false
/**
 * 注册路由实例
 * 即将开始监听 location 变化，触发路由规则
 */

let instance = null
let router = null
let sharedUnsubscribe = null
window.XHLCUSTOM_ENV = {}
/**
 * 渲染函数
 * 两种情况：主应用生命周期钩子中运行 / 微应用单独启动时运行
 */
function render (props) {
  const { shared = SharedModule.getShared(), NODE_ENV = process.env.NODE_ENV, VUE_APP_MODE = process.env.VUE_APP_MODE } = props
  SharedModule.overloadShared(shared)
  const { common } = shared.getState()
  // window.CUSTOM_NODE_ENV = NODE_ENV // 挂在应用运行环境变量
  // window.CUSTOM_VUE_APP_MODE = VUE_APP_MODE // 挂在应用运行环境变量
  window.XHLCUSTOM_ENV = {
    NODE_ENV,
    VUE_APP_MODE
  }
  store.commit('MainCommon/updateMainCommon', cloneDeep(common))
  i18n.locale = common.switchLang
  // store.commit('MainCommon/_________', cloneDeep(_________)) // 微应用在全局维护的状态值
  sharedUnsubscribe = shared.subscribe(toStore) // 订阅主应用通信模型映射到当前应用
  // 在 render 中创建 VueRouter，可以保证在卸载微应用时，移除 location 事件监听，防止事件污染
  router = new VueRouter({
    // 运行在主应用中时，添加路由命名空间 /vue
    base: window.__POWERED_BY_QIANKUN__ ? '/login' : '/',
    mode: 'history',
    routes
  })
  router.beforeEach(beforeEach)
  router.beforeResolve(beforeResolve)
  router.afterEach(afterEach)
  router.onReady(onReady)
  router.onError(onError)
  // 挂载应用
  instance = new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App)
  }).$mount('#micro-app-login')
}

// 独立运行时，直接挂载应用
if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap () {
  console.log(`${MICRO_NAME}  bootstraped`)
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount (props) {
  console.log(`${MICRO_NAME}  mount`, props)
  render(props)
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount () {
  console.log(`${MICRO_NAME} unmount`)
  instance.$destroy()
  instance.$el.innerHTML = ''
  instance = null
  router = null
  sharedUnsubscribe()
}
