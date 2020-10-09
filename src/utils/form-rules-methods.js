export class RulesMethods {
  constructor (type = 'status') {
    this.type = type
  }

  test (value) {
    const rule = (v) => {
      // 写规则 返回校验值
      return v === 1
    }
    if (this.type === 'status') return rule(value)
    return {
      status: rule(value),
      method: rule
    }
  }

  valueType (v) {
    return Object.prototype.toString.call(v).slice(8, -1)
      .toLowerCase()
  }

  isEmail (value) {
    const rule = (v) => {
      if (typeof v === 'string') {
        v = v.trim()
      }
      return !(/^[a-z0-9]+([.]?[+-_a-z0-9]+)*@([a-z0-9]+([.-][a-z0-9]+)*\.)[a-z0-9]+$/i.test(v))
    }
    // 通过 返回false 异常返回true
    if (this.type === 'status') return rule(value)
    return {
      status: rule(value),
      method: rule
    }
  }

  isEmpty (value) {
    const rule = (v) => {
      if (typeof v === 'string') {
        v = v.trim()
      }
      return !v
    }
    // 通过 返回false 异常返回true
    if (this.type === 'status') return rule(value)
    return {
      status: rule(value),
      method: rule
    }
  }

  isEmptyStr (value) {
    const rule = (v) => {
      if (typeof v === 'string') {
        return v.length === 0
      }
      return !v
    }
    // 通过 返回false 异常返回true
    if (this.type === 'status') return rule(value)
    return {
      status: rule(value),
      method: rule
    }
  }

  strMaxLenth (value, len) {
    const type = this.valueType(value)
    if ((type === 'number' || type === 'string') && len) {
      const rule = (v, l) => {
        return String(v).length > l
      }
      // 通过 返回false 异常返回true
      if (this.type === 'status') return rule(value, len)
      return {
        status: rule(value, len),
        method: rule
      }
    } else {
      console.error('只有字符串和数字')
      return false
    }
  }
}
export const getFormStatus = new RulesMethods()
export const getFormStatusAndRules = new RulesMethods('method')
