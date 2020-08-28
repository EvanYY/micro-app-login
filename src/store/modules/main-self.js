
import { isObject } from 'lodash'
// import SharedModule from '@/shared'
// const shared = SharedModule.getShared()
// 暴露给全局的自定义共享值 需要多应用共享需放在main-common
export default {
  namespaced: true,
  state: {
    conmmon: {}
  },
  mutations: {
    // 勿动
    updateMainCommon (state, value = {}) {
      if (!isObject(value)) throw Error('main value has to be object')
      state.conmmon = value
    },
    updateMainCommonKey (state, value = {}) {
      if (!isObject(value)) throw Error('formation of value has to key: value')
      for (const k in value) {
        state.conmmon[k] = value[k]
      }
      // 更新全局组件 common 状态值 自定义action 触发事件
      // shared.dispatch({ type: '', payload: state.conmmon })
    }
  },
  actions: {
    // incrementIfOddOnRootSum ({ state, commit, rootState }) {
    // }
  },
  // 自定义方便
  getters: {}
}
