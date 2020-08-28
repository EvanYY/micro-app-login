import { isObject, cloneDeep } from 'lodash'
import SharedModule from '@/shared'
const shared = SharedModule.getShared()

// 全局状态观察池
export default {
  namespaced: true,
  state: {
    common: {}
  },
  mutations: {
    // 勿动
    updateMainCommon (state, value = {}) {
      if (!isObject(value)) throw Error('main value has to be object')
      state.common = value
    },
    updateMainCommonKey (state, value = {}) {
      if (!isObject(value)) throw Error('formation of value has to key: value')
      for (const k in value) {
        state.common[k] = value[k]
      }
      // 更新全局组件 common 状态值
      shared.dispatch({ type: 'COMMON_SET_VALUE', payload: cloneDeep(state.common) })
    }
  },
  actions: {
    // incrementIfOddOnRootSum ({ state, commit, rootState }) {
    // }
  },
  // 自定义方便获取common值得方法
  getters: {}

}
