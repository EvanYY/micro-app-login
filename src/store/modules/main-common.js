import { isObject, cloneDeep } from 'lodash'
import SharedModule from '@/shared'

// 全局状态观察池
export default {
  namespaced: true,
  state: {
    common: {}
  },
  mutations: {
    // 勿动
    updateMainCommon (state, payload = {}) {
      if (!isObject(payload)) throw Error('main payload has to be object')
      state.common = payload
    },
    updateMainCommonKey (state, payload = {}) {
      if (!isObject(payload)) throw Error('formation of payload has to key: payload')
      for (const k in payload) {
        state.common[k] = payload[k]
      }
      const shared = SharedModule.getShared()
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
