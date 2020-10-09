import Vue from 'vue'
import i18n from '@/locale'
import CryptoJS from 'crypto-js'

const Utils = Object.create(null)

Utils.encode = function (_map, _content) {
  _content = `${_content}`
  if (!_map || !_content) {
    return _content || ''
  }
  return _content.replace(_map.r, function ($1) {
    const _result = _map[!_map.i ? $1.toLowerCase() : $1]
    return _result != null ? _result : $1
  })
}

Utils.escape = (function () {
  const _reg = /<br\/?>$/
  const _map = {
    r: /\<|\>|\&|\r|\n|\s|\'|\"/g,
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    ' ': '&nbsp;',
    '"': '&quot;',
    '\'': '&#39;',
    '\n': '<br/>',
    '\r': ''
  }
  return function (_content) {
    _content = Utils.encode(_map, _content)
    return _content.replace(_reg, '<br/>')
  }
})()

Utils.object2query = function (obj) {
  const keys = Object.keys(obj)
  const queryArray = keys.map(item => {
    return `${item}=${encodeURIComponent(obj[item])}`
  })
  return queryArray.join('&')
}

// https://cn.vuejs.org/v2/guide/reactivity.html
// Vue 不能检测到对象属性的添加或删除。然而它可以使用 Vue.set(object, key, value) 方法将响应属性添加到嵌套的对象上
Utils.mergeObject = function (dest, src) {
  if (typeof dest !== 'object' || dest === null) {
    dest = Object.create(null)
  }
  dest = Object.assign(Object.create(null), dest, src)
  return dest
}

Utils.mergeVueObject = function (dest, src) {
  const keys = Object.keys(src)
  keys.forEach(item => {
    if (typeof src[item] !== 'undefined') {
      Vue.set(dest, item, src[item])
    }
  })
  return dest
}

// 消息类型列表
Utils.mapMsgType = function (msg) {
  const map = {
    text: '文本消息',
    image: '图片消息',
    file: '文件消息',
    audio: '语音消息',
    video: '视频消息',
    geo: '地理位置消息',
    tip: '提醒消息',
    custom: '自定义消息',
    notification: '系统通知',
    robot: '机器人消息'
  }
  const type = msg.type
  return map[type] || '未知消息类型'
}

Utils.stringifyDate = function (datetime, simple = false) {
  // let weekMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const weekMap = [i18n.t('Sunday'), i18n.t('Monday'), i18n.t('Tuesday'), i18n.t('Wednesday'), i18n.t('Thursday'), i18n.t('Friday'), i18n.t('Saturday')]
  datetime = new Date(datetime)
  const year = datetime.getFullYear()
  const simpleYear = datetime.getYear() - 100
  let month = datetime.getMonth() + 1
  month = month > 9 ? month : `0${month}`
  let day = datetime.getDate()
  day = day > 9 ? day : `0${day}`
  let hour = datetime.getHours()
  hour = hour > 9 ? hour : `0${hour}`
  let min = datetime.getMinutes()
  min = min > 9 ? min : `0${min}`
  let week = datetime.getDay()
  week = weekMap[week]
  const thatDay = (new Date(year, month - 1, day, 0, 0, 0)).getTime()
  const yesterday = i18n.t('Yesterday')

  if (simple) {
    return {
      withYear: `${day}/${month}/${simpleYear}`,
      withMonth: `${month}-${day}`,
      withDay: `${week}`,
      withLastDay: `${yesterday}`,
      withHour: `${hour}:${min}`,
      thatDay
    }
  } else {
    return {
      withYear: `${year}-${month}-${day} ${hour}:${min}`,
      withMonth: `${month}-${day} ${hour}:${min}`,
      withDay: `${week} ${hour}:${min}`,
      withLastDay: `${yesterday} ${hour}:${min}`,
      withHour: `${hour}:${min}`,
      thatDay
    }
  }
}

/* 格式化日期 */
Utils.formatDate = function (datetime, simple = false) {
  const tempDate = (new Date()).getTime()
  const result = this.stringifyDate(datetime, simple)
  const thatDay = result.thatDay
  const deltaTime = (tempDate - thatDay) / 1000

  if (deltaTime < 3600 * 24) {
    return result.withHour
  } else if (deltaTime < 3600 * 24 * 2) {
    return result.withLastDay
  } else if (deltaTime < 3600 * 24 * 7) {
    return result.withDay
  } else if (deltaTime < 3600 * 24 * 30) {
    return result.withMonth
  } else {
    return result.withYear
  }
}

Utils.parseSession = function (sessionId) {
  if (/^p2p-/.test(sessionId)) {
    return {
      scene: 'p2p',
      to: sessionId.replace(/^p2p-/, '')
    }
  } else if (/^team-/.test(sessionId)) {
    return {
      scene: 'team',
      to: sessionId.replace(/^team-/, '')
    }
  }
}

Utils.parseCustomMsg = function (msg) {
  if (msg.type === 'custom') {
    try {
      const cnt = JSON.parse(msg.content)
      switch (cnt.type) {
        case 1:
          return '[猜拳消息]'
        case 2:
          return '[阅后即焚]'
        case 3:
          return '[贴图表情]'
        case 4:
          return '[白板消息]'
      }
    } catch (e) {
    }
    return '[自定义消息]'
  }
  return ''
}
/* 获得有效的备注名 */
Utils.getFriendAlias = function (userInfo) {
  userInfo.alias = userInfo.alias ? userInfo.alias.trim() : ''
  return userInfo.alias || userInfo.nick || userInfo.account
}

Utils.generateChatroomSysMsg = function (data) {
  let text
  switch (data.attach.type) {
    case 'memberEnter':
      text = `欢迎${data.attach.fromNick}进入直播间`
      break
    case 'memberExit':
      text = `${data.attach.fromNick}离开了直播间`
      break
    case 'blackMember':
      text = `${(data.attach.toNick[0] || data.attach.to[0])}被管理员拉入黑名单`
      break
    case 'unblackMember':
      text = `${(data.attach.toNick[0] || data.attach.to[0])}被管理员解除拉黑`
      break
    case 'gagMember':
      text = `${(data.attach.toNick[0] || data.attach.to[0])}被管理员禁言`
      break
    case 'ungagMember':
      text = `${(data.attach.toNick[0] || data.attach.to[0])}被管理员解除禁言`
      break
    case 'addManager':
      text = `${(data.attach.toNick[0] || data.attach.to[0])}被任命管理员身份`
      break
    case 'removeManager':
      text = `${(data.attach.toNick[0] || data.attach.to[0])}被解除管理员身份`
      break
    case 'addTempMute':
      text = `${(data.attach.toNick[0] || data.attach.to[0])}被管理员临时禁言`
      break
    case 'removeTempMute':
      text = `${(data.attach.toNick[0] || data.attach.to[0])}被管理员解除临时禁言`
      break
    case 'addCommon':
      text = '管理员添加普通成员'
      break
    case 'removeCommon':
      text = '管理员删除普通成员'
      break
    case 'kickMember':
      text = `${data.attach.toNick[0]}被管理员踢出房间`
      break
      // case 'xxx':
      // 直播公告已更新
      // break;
    default:
      text = '通知消息'
      break
  }
  return text
}

Utils.encrypt = function (word, keyStr) {
  keyStr = keyStr || 'abcdefgabcdefg12'
  const key = CryptoJS.enc.Utf8.parse(keyStr)
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  return encrypted.toString()
}

Utils.decrypt = function (word, keyStr) {
  keyStr = keyStr || 'abcdefgabcdefg12'
  const key = CryptoJS.enc.Utf8.parse(keyStr)
  const decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

// 存放正则表达式
Utils.regExp = {
  // email: /^[a-z0-9]+([.]?[-_a-z0-9]+)*@([a-z0-9]+([.-][a-z0-9]+)*\.)[a-z0-9]+$/i,
  email: /\w+?@\S+?\.[A-Za-z\d]{2,4}/,
  phone: /((\+\d{1,3}([- _])?\(?\d\)?[- _]?\d{1,5})|(\(?\d{2,6}\)?))[- _]?(\d{3,4})[- _]?(\d{4})(( x| ext)\d{1,5})?/,
  fullEmail: /^[a-z\d]+([.]?[-_a-z\d]+)*@([a-z\d]+([.-][a-z\d]+)*\.)[a-z\d]+$/i,
  fullPhone: /^((\+\d{1,3}[- _]?\(?\d\)?[- _]?\d{1,5})|(\(?\d{2,6}\)?)|)[- _]?(\d{3,4})[- _]?(\d{4})(( x| ext)\d{1,5})?$/,
  whatsApp: /^[ \-_`~!@#$%^&*()+=|{}':;',\[\].<>/?~！@#￥%……&*（）——+\d]+$/,
  link: /((https|http):\/\/[\S.\/]+)(?![^<]+>)/i
}

/**
 * @Description: 增加一个全局方法用来转化字符串为 float + 避免出现 NaN
 * @author 汤一飞
 * @date 2020/5/6
 */
Utils.toFloat = function (val) {
  const result = parseFloat(val)
  return isNaN(result) ? val : result
}

// 图标 chart 色值集合
// 完全不透明色值; 折线图用
Utils.chartColors = [
  '#325bce',
  '#1fbfb1',
  '#ee5943',
  '#ffaea2',
  '#673da3',
  '#8291f5',
  '#ff7f2c',
  '#feb660',
  '#3b9bf5',
  '#96e18f',
  '#45b83a'
]
// 不透明度 80% 色值; 柱状图, 条形图, 漏斗图用
Utils.chartColors_80per = [
  'rgba(50, 91, 206, 0.80)',
  'rgba(31, 191, 177, 0.80)',
  'rgba(238, 89, 67, 0.80)',
  'rgba(255, 174, 162, 0.80)',
  'rgba(103, 61, 163, 0.80)',
  'rgba(130, 145, 245, 0.80)',
  'rgba(255, 127, 44, 0.80)',
  'rgba(254, 182, 96, 0.80)',
  'rgba(59, 155, 245, 0.80)',
  'rgba(150, 225, 143, 0.80)',
  'rgba(69, 184, 58, 0.80)'
]

export default Utils
