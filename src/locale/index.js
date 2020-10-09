import Vue from 'vue'
import Cookies from 'js-cookie'
import VueI18n from 'vue-i18n'

import EN from './en'
import ZH from './zh'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

Vue.use(VueI18n)

// 自动设置语言
const navLang = navigator.language
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false
const lang = Cookies.get('LANG') || localLang || 'zh-CN'
Vue.config.lang = lang

// 多语言配置
const mergeZH = Object.assign(zhLocale, ZH)
const mergeEN = Object.assign(enLocale, EN)
// Vue.locale('zh-CN', mergeZH);
// Vue.locale('en-US', mergeEN);
const messages = {
  'zh-CN': mergeZH,
  'en-US': mergeEN
}
// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: lang, // set locale
  messages // set locale messages
})
export default i18n
