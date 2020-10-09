import { RulesMethods } from './form-rules-methods'
class FormRules {
  // 根据配置返回校验规则列表
  // types = [{t: 'methodName', m: ''}] clonfirm 为异步转同步校验方法 记得加 async await 语法糖
  init (types = [], msg = '', reqData = {}, confirm = null) {
    if (!Array.isArray(types)) throw new Error('types needs array')
    types = types.filter(v => v)
    if (!this.isFormat(types)) {
      throw new Error('formation of arguments is error')
    }
    return (rule, value, callback) => {
      if (typeof callback !== 'function') {
        console.log('callback have to be a function')
        return false
      }
      let type = types
      if ((confirm && typeof confirm === 'function') || (Array.isArray(confirm) && confirm.every(v => typeof v === 'function'))) {
        type = type.concat(confirm)
      }
      const rules = new RulesMethods()
      const store = type.find((v) => {
        if (typeof v === 'function') {
          return v(value, reqData)
        }
        const str = v.t
        if (rules[str] && typeof rules[str] === 'function') {
          return rules[str](value, reqData) // 校验 需要抛出异常则返回true 跳出循环 执行异常
        } else {
          console.error('格式不正确', v)
        }
        return false
      })
      if (!store) {
        callback()
      } else {
        callback(new Error(store.m || msg))
      }
    }
  }

  isFormat (arr = []) {
    return arr.every(v => this.objCall(v) === 'object' && v.t && this.objCall(v.t) === 'string')
  }

  objCall (v) {
    return Object.prototype.toString.call(v).slice(8, -1)
      .toLowerCase()
  }
}
export const createFormRules = new FormRules()
