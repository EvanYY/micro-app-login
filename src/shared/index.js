import { isFunction } from 'lodash'
/**
 * 书写自己运行时所需要的mock 值
 *
 * @class Shared
 */
class Shared {
  getState () {
    return {
      common: {}
    }
  }

  subscript (cb) {
    if (isFunction(cb)) cb()
  }
}
class SharedModule {
  static shared = new Shared();
  /**
   * 重载 shared
   */
  static overloadShared (shared) {
    SharedModule.shared = shared
  }

  /**
   * 获取 shared 实例
   */
  static getShared () {
    return SharedModule.shared
  }
}
export default SharedModule
