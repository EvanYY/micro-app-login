/** 业务处理代码注册于原型上 */
const TableHeaderEllipsis = function (columnWidth = 130, hasFilter = true) {
  // 动态表头 修改超出不换行 垂直居中 c 子元素 f 父元素 fb 为fiterBox组件
  return {
    c: {
      display: 'inline-block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: `${columnWidth - 42}px`
    },
    f: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'

    },
    fb: {
      position: 'absolute',
      right: '-24px',
      top: '-1.8px'
    },
    tip: {
      position: 'absolute',
      right: `-${(hasFilter ? 24 : 0) + 16}px`
    }
  }
}
const dealImgName = (url, name) => {
  if (typeof url === 'string' && typeof name === 'string') {
    return `${url}${url.indexOf('?') === -1 ? '?' : '&'}download=${encodeURIComponent(name)}`
  } else {
    console.error('url is not string')
    return url
  }
}
const openWindow = (url = '', type = '_blank', data = '') => {
  if (!url) return false
  window.open(url, type, data)
}
const switchLang = (lang = '') => {
  const type = {
    'zh-CN': 'en-US',
    'en-US': 'zh-CN'
  }
  return type[`${lang}`] || 'zh-CN'
}
export default {
  TableHeaderEllipsis,
  dealImgName,
  openWindow,
  switchLang
}
