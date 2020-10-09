/* eslint-disable no-useless-escape */
import {
  cloneDeep
} from 'lodash'
const dynamicDatasErrorMsg = '参数错误 去看src/utils/dynamicDatas.js 方法参数'

const getTreeTargetKeyToList = (treeList = [], nodeKey = 'children', target = 'person') => {
  /**
     * @仅拿到最底层
     * @flag需要过滤节点的key
     * @flagValue需要过滤节点的值
     * @nodeKey获取的节点键名
     * @changeNodeKey是否需要改变节点状态
     * @changeNodeKeyValue节点需要改成的值
     */
  if (!Array.isArray(treeList) || treeList.length === 0) {
    throw new Error(`getTreeTargetKeyToList ${dynamicDatasErrorMsg}`)
  }

  treeList = cloneDeep(treeList)
  const result = []
  const reduce = function (list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i][nodeKey]) {
        reduce(list[i][nodeKey])
      }
      if (list[i].nodeIdentifier.indexOf(target) !== -1) {
        result.push(list[i])
      }
    }
    return list
  }
  reduce(treeList)
  return result
}

const treeDataToList = (treeList = [], nodeKey = 'children') => {
  // 拿到整棵树列表
  if (!Array.isArray(treeList) || treeList.length === 0) {
    throw new Error(`treeDataToList ${dynamicDatasErrorMsg}`)
  }
  treeList = cloneDeep(treeList)
  let result = []
  const reduce = function (list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i][nodeKey] && list[i][nodeKey].length !== 0) {
        result.push(list[i])
        reduce(list[i][nodeKey] || [])
      } else {
        result = result.concat(list[i])
      }
    }
  }
  reduce(treeList)
  return result
}

const updateTreeNodes = (treeList = [], updateObj = {
  updateKey: 'children',
  updateValue: 'ingore',
  justifyKey: 'children',
  justifyKeyValue: 'arrToString' // 暂时限定为数组
}, nodeKey = 'children') => {
  // 更新节点值
  if (!Array.isArray(treeList)) {
    throw new Error(`updateTreeNodes ${dynamicDatasErrorMsg}`)
  }
  treeList = cloneDeep(treeList)
  const {
    updateKey,
    updateValue,
    justifyKey,
    justifyKeyValue
  } = updateObj
  const reduce = (list) => {
    for (let i = 0; i < list.length; i++) {
      const a = list[i][justifyKey]
      if (justifyKeyValue === 'arrToString') {
        if (a.length === 0) {
          list[i][updateKey] = updateValue
        } else {
          reduce(list[i][nodeKey])
        }
      } else {
        if (a === justifyKeyValue) {
          list[i][updateKey] = updateValue
        } else {
          reduce(list[i][nodeKey])
        }
      }
    }
  }
  reduce(treeList)
  return treeList
}

const removeNodeByLevelChildrenLength = (treeList = [], nodeLevel = 'level', nodeKey = 'children', extra = 'person') => {
  /**
     * @nodeKey获取的节点键名
     * @nodeLevel节点level所取字段名
     */
  if (!Array.isArray(treeList) || !nodeKey) {
    throw new Error(`removeNodeByLevelChildrenLength ${dynamicDatasErrorMsg}`)
  }
  treeList = cloneDeep(treeList)
  const maxLevel = Math.max.apply(null, treeDataToList(treeList).map(v => Number(v[nodeLevel])))
  const reduce = function (list, borderLevel) {
    for (let i = 0; i < list.length; i++) {
      if (list[i][nodeKey].length === 0 && Number(list[i][nodeLevel]) === borderLevel && list[i].nodeIdentifier.indexOf(extra) === -1) {
        list.splice(i, 1)
        i = i - 1
      } else if (list[i].nodeIdentifier.indexOf(extra) === -1) {
        reduce(list[i][nodeKey], borderLevel)
      }
    }
    return list
  }
  for (let i = maxLevel; i >= 0; i--) {
    treeList = reduce(treeList, i)
  }
  return treeList
}

const filterTreeNodeListByKey = (treeList = [], ingoreObj = {
  ingoreNodeKey: 'f',
  ingoreNodeKeyValue: 'ingore'
}, nodeKey = 'children') => {
  /**
     * @nodeKey获取的节点键名
     * @ingoreNodeKeyValue需要过滤的节点值
     */
  if (!Array.isArray(treeList) || !nodeKey || !ingoreObj) {
    throw new Error(`filterTreeNodeListByKey ${dynamicDatasErrorMsg}`)
  }
  treeList = cloneDeep(treeList)
  const {
    ingoreNodeKey,
    ingoreNodeKeyValue
  } = ingoreObj
  const reduce = function (list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i][ingoreNodeKey] === ingoreNodeKeyValue) {
        list.splice(i, 1)
      } else if (list.length > 0) {
        reduce(list[i][nodeKey])
      }
    }
    return list
  }
  reduce(treeList)
  return treeList
}

const filterListGarbageDatas = (_originList = [], filterList = [], obj = {
  o: 'id'
}) => {
  // 过滤树节点列表脏数据
  if (!Array.isArray(filterList) || !Array.isArray(_originList)) {
    console.log('数据格式错误', 'color: blue')
    return _originList
  }
  const originList = cloneDeep(_originList)
  const {
    o
  } = obj
  return {
    f: originList.filter(v => !filterList.some(m => Number(m) === v[o])),
    o: _originList
  }
}

const buldTreeStruct = (_parentList = [], _userList = [], disabledList = []) => {
  // 构建组织机构树
  if (!Array.isArray(_parentList) || !Array.isArray(_userList)) {
    throw new Error('buldTreeStruct 参数应为数组')
  }
  // 更新用户列表属性
  const userList = _userList.map(v => {
    return {
      parentId: v.departmentId,
      originAttribution: v,
      checked: false,
      disabled: disabledList.some(m => v.id === m),
      nodeIdentifier: `${v.id}-person`,
      children: [],
      level: -1,
      userId: v.id,
      power: v.manageName,
      name: v.fullname,
      id: v.id
    }
  })
  // 更新父节点列表属性
  let parentList = _parentList.map(v => {
    return {
      parentId: v.parentId,
      name: v.name,
      title: v.name,
      id: v.id,
      disabled: false,
      checked: false,
      expand: true,
      level: 0,
      nodeIdentifier: `${v.id}-department`,
      children: [],
      originAttribution: v
    }
  }).concat(userList)
  // 构建根节点
  const treeList = parentList.filter(v => v.parentId === 0)
  parentList = parentList.filter(v => v.parentId !== 0)
  const reduce = function (_treeList, _parentList, level) {
    for (let i = 0; i < _treeList.length; i++) {
      _treeList[i].children = _parentList.filter(v => v.parentId === _treeList[i].id).map(v => {
        return {
          ...v,
          ...{
            level
          }
        }
      })
      _parentList = _parentList.filter(v => v.parentId !== _treeList[i].id)
    }
    if (_parentList.length) {
      for (const treeItem of _treeList) {
        if (treeItem.children.length) {
          reduce(treeItem.children, _parentList, level + 1)
        }
      }
    }
    return _treeList
  }
  reduce(treeList, parentList, 1)
  return treeList
}
export function findComponentsDownward (context, componentName) {
  return context.$children.reduce((components, child) => {
    if (child.$options.name === componentName) components.push(child)
    const foundChilds = findComponentsDownward(child, componentName)
    return components.concat(foundChilds)
  }, [])
}
export function findComponentsUpward (context, componentName) {
  const parents = []
  const parent = context.$parent

  if (parent) {
    if (parent.$options.name === componentName) parents.push(parent)
    return parents.concat(findComponentsUpward(parent, componentName))
  } else {
    return []
  }
}
export const lengthFilter = (strs = '', len = 28) => {
  let str = strs
  if (typeof str === 'string' || typeof str === 'number') {
    str = String(str).trim()
    str = str.length < len ? str : `${str.substring(0, len)}...`
  } else {
    str = ''
  }
  return str
}

export const findComponentUpward = function (context, componentName) {
  let parent = context.$parent
  let name = parent.$options.name

  while (parent && (!name || [componentName].indexOf(name) < 0)) {
    parent = parent.$parent
    if (parent) name = parent.$options.name
  }
  return parent
}
export const findComponentDownward = function (context, componentName) {
  const childrens = context.$children
  let children = null

  if (childrens.length) {
    for (const child of childrens) {
      const name = child.$options.name

      if (name === componentName) {
        children = child
        break
      } else {
        children = findComponentDownward(child, componentName)
        if (children) break
      }
    }
  }
  return children
}

export const isJSON = function (str) {
  if (typeof str === 'string') {
    try {
      JSON.parse(str)
      return true
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        console.log(e)
      }
      return false
    }
  } else {
    console.log('It is not a string!')
  }
}
export const Rnum = (len = 6) => {
  if (typeof len === 'number' && !isNaN(len)) {
    len = Number(len)
    let rnd = ''
    for (let i = 0; i < len; i++) {
      rnd += Math.floor(Math.random() * 10)
    }
    return rnd
  } else {
    console.error('RndNum 不是Number类型')
  }
}
export const strToNumRange = (target = 0, max = 99999, min = '', abs = true) => {
  // 取正整数范围
  target = abs ? Math.abs(Math.round(Number(target))) : Math.round(Number(target))
  const sbpm = target || min
  return sbpm ? (sbpm > max ? max : sbpm) : (sbpm)
}
export const getObjectFitSize = (contains /* true = contain, false = cover */, containerWidth, containerHeight, width, height) => {
  const doRatio = width / height
  const cRatio = containerWidth / containerHeight
  let targetWidth = 0
  let targetHeight = 0
  const test = contains ? (doRatio > cRatio) : (doRatio < cRatio)
  if (test) {
    targetWidth = containerWidth
    targetHeight = targetWidth / doRatio
  } else {
    targetHeight = containerHeight
    targetWidth = targetHeight * doRatio
  }
  return {
    width: `${targetWidth}px`,
    height: `${targetHeight}px`,
    left: `${(containerWidth - targetWidth) / 2}px`,
    top: `${(containerHeight - targetHeight) / 2}px`
  }
}
export const dateFormat = (fmt, date) => {
  if (!date) date = new Date()
  let ret
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (const k in opt) {
    ret = new RegExp(`(${k})`).exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    };
  };
  return fmt
}
// 下划线转换驼峰
export const toHump = (name) => {
  return name.replace(/\_(\w)/g, function (all, letter) {
    return letter.toUpperCase()
  })
}
// 驼峰转换下划线
export const toLine = (name) => {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase()
}

export const getDefalutRouteName = (routes) => {
  if (!routes || !Array.isArray(routes)) return {}
  const reduce = function (list) {
    let item = {}
    for (let i = 0; i < list.length; i++) {
      const el = list[i]
      if (!el.children || !el.children.length) {
        item = el
        break
      } else {
        reduce(el.children)
      }
    }
    return item
  }
  return reduce(routes)
}
/** 数组根据数组对象中的某个属性值进行排序的方法
 * 使用例子：newArray.sort(sortBy('number',false)) //表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
 * @param attr 排序的属性 如number属性
 * @param rev true表示升序排列，false降序排序
 * */

export const arrDeepSort = function (attr, rev) {
  if (rev === undefined) {
    rev = 1
  } else {
    rev = rev ? 1 : -1
  }
  return function (a, b) {
    a = parseFloat(a[attr])
    b = parseFloat(b[attr])
    if (a < b) {
      return rev * -1
    }
    if (a > b) {
      return Number(rev)
    }
    return 0
  }
}

// 全屏的兼容
export const fullScreen = ele => {
  const func =
      ele.requestFullScreen ||
      ele.mozRequestFullScreen ||
      ele.webkitRequestFullScreen ||
      ele.msRequestFullScreen
  func.call(ele)
}
// 退出全屏的兼容
export const exitFullscreen = () => {
  const func =
      document.exitFullScreen ||
      document.mozCancelFullScreen ||
      document.webkitExitFullscreen ||
      document.msExitFullscreen
  func.call(document)
}

/* 利用数组的方法处理关键字高亮显示的方法 */
export const highLightKeyWords = (data, keywords) => {
  const arr1 = data.toLowerCase().split(keywords.toLowerCase())
  const arr2 = data.split('')
  const tempArr = []
  let tempIndex = 0
  for (let i = 0; i < arr2.length; i++) {
    let string = arr2[i]
    string = string.replace(/&/g, '&amp;')
    string = string.replace(/\"/g, '&quot;')
    string = string.replace(/</g, '&lt;')
    string = string.replace(/>/g, '&gt;')
    arr2[i] = string
  }
  for (let i = 0; i < arr1.length; i++) {
    let data = []
    data = arr2.slice(tempIndex, tempIndex + arr1[i].length)
    tempIndex = tempIndex + arr1[i].length
    tempArr.push(data.join(''))
    if (tempIndex < arr2.length) {
      data = arr2.slice(tempIndex, tempIndex + keywords.length)
      tempIndex = tempIndex + keywords.length
      tempArr.push(`<span class="keyword">${data.join('')}</span>`)
    }
  }
  // console.log('highLightKeyWords()------', arr1, arr2, tempArr);
  return tempArr.join('')
}


export default {
  getTreeTargetKeyToList, // 根据标识拿到树型数据过滤后的列表
  removeNodeByLevelChildrenLength, // 根据treeList最大level去除children.length === 0节点
  filterTreeNodeListByKey, // 根据过滤节点值过滤树形数据节点
  updateTreeNodes, // 根据justify key 更新 targetKey value
  treeDataToList, // 拿到整棵树列表
  buldTreeStruct, // 构建组织机构树
  filterListGarbageDatas, // 过滤树节点列表脏数据
  findComponentsDownward, // 找到所有指定组件
  findComponentsUpward, // 找到上层指定组件
  findComponentUpward, // 找到上册最近指定组件
  findComponentDownward, // 向下
  isJSON,
  strToNumRange,
  Rnum, // 生成指定长度随机数
  lengthFilter, // 字符串长度限定
  dateFormat, // 日期格式化
  toLine, // 驼峰转下划线
  toHump, // 下划线转驼峰
  arrDeepSort, // 数组深度排序
  getDefalutRouteName, // 找到第一个有效跳转路径
  fullScreen,
  exitFullscreen,
  getObjectFitSize, // 模拟object-fit
  highLightKeyWords // 数组方法实现关键词高亮显示
}
