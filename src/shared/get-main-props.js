
/**
 * 书写自己运行时所需要的mock 值
 *
 * @class Shared
 */
class Shared {
 static ad = {
   a: 1,
   b: 2
 }

 balabalabala () {
   return {}
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
