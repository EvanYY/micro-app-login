import axios from 'axios'
// import { Message } from 'element-ui'
// import { router } from '@/router'
import qs from 'qs'
import URLs from './env-url'
// import Cookies from 'js-cookie'
// import store from '@/store'
// import i18n from '@/locale'
// import { clearAllInfo } from '@/utils/safe'

// 请求地址设置
const reqUrl = (type = '') => {
  if (!(window.XHLCUSTOM_ENV && window.XHLCUSTOM_ENV.VUE_APP_MODE)) return ''
  const env = window.XHLCUSTOM_ENV && window.XHLCUSTOM_ENV.VUE_APP_MODE
  return URLs[env + type]
}
axios.defaults.baseURL = reqUrl()

// 其他设置
axios.defaults.withCredentials = true
axios.defaults.headers = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
}
// 定义多种发送配置
const ajax = axios.create({
  baseURL: reqUrl(),
  timeout: 30000,
  transformRequest: [
    (data) => {
      data = qs.stringify(data)
      return data
    }
  ]
})
const ajaxInternational = axios.create({
  baseURL: reqUrl('international'),
  timeout: 30000,
  transformRequest: [
    (data) => {
      data = qs.stringify(data)
      return data
    }
  ]
})

const util = {
  ajax,
  ajaxInternational
}

export default util
