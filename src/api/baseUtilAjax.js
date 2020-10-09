import util from '@/libs/util'
// 对于util 统一管理
export class Request {
  constructor (config, type = 'post') {
    this.methodModule = {
      get: {
        utilKey: 'ajax',
        url: '',
        method: 'GET',
        params: {},
        level: 1
      },
      post: {
        utilKey: 'ajax',
        url: '',
        method: 'POST',
        data: {},
        params: {},
        level: 1
      }
    }
    this.config = config
    this.type = type
  }

  async init (success = null, error200 = null, callBacks = []) {
    if (!this.methodModule[this.type]) {
      throw new Error('Request need method in post or get')
    }
    const response = await this.axios({ ...this.methodModule[this.type], ...this.config }).catch(err => err)
    if (typeof success === 'function' && ((response.data && response.data.code === '1') || response.status === 200)) this.success(success, response.data || response, response)
    if (error200 && response.data.code !== '1') this.er(error200, response.data, response)
    if (Array.isArray(callBacks) && callBacks.length) this.cbs(callBacks, response.data, response)
    return response.data || response
  }

  async cbs (callBacks, data) {
    // callBacks 执行回调函数集 在return值之前同步执行
    callBacks.forEach((cb, i) => {
      // 注意若需要执行组件内部方法或值请用() => {} 绑定this
      if (typeof cb === 'function') {
        cb(data)
      } else {
        console.log(cb, 'color:blue')
      }
    })
    return true
  }

  async success (success, data, res) {
    success(data, res)
  }

  async er (error200, data) {
    if (typeof error200 === 'function') { error200(data) }
  }

  async requestAll (requestList = [], cb = null) {
    const values = await Promise.all(requestList).catch(err => err)
    if (typeof cb === 'function') {
      cb(Array.from(values))
    }
    if (!values.length) console.info('%c ---->   requestAll', 'color:blue', values)
    return Array.from(values)
  }

  axios (param = {
    utilKey: '',
    url: '',
    method: '',
    // headers: {},
    data: {},
    params: {}
  }) {
    const { utilKey, url, method, data, params } = param
    if (!utilKey || !url) {
      console.log('utilKey url 为使用util的属性 必需存在', 'color: bule')
      return false
    }
    return util[utilKey]({
      url,
      method,
      data,
      params
    })
  }
}
