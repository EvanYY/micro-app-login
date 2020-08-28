import store from '@/store'
import SharedModule from './index'
// import { cloneDeep } from 'lodash'
// 值映射
export const toStore = () => {
  debugger
  const { common, _________ } = SharedModule.getShared().getState()
  store.commit('MainCommon/updateMainCommon', (common))
  if (_________) {
    // 不需要则注释 主应用维护的 微应用域下状态值 映射
    // store.commit('MicroAppCrm/_________', (_________))
  }
}
