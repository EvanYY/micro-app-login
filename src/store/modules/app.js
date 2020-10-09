
export default {
  namespaced: true,
  state: {
    isUpgrade: false
  },
  mutations: {
    isUpgrade (state, payload) {
      state.isUpgrade = payload
    }
  },
  actions: {
    // incrementIfOddOnRootSum ({ state, commit, rootState }) {
    // }
  },
  // 自定义方便
  getters: {}
}
