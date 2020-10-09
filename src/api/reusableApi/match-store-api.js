import { Request } from '@/api/baseUtilAjax'
import { allowGetIsReadMode } from '@/steps/img-steps/mode-config'
import $cookie from 'js-cookie'
import $store from '@/store'

export const getIsReadMode = async (name = '', success = null, error = null, cbs = []) => {
  setTimeout(async () => {
    const url = '/oversea/tips/exist'
    if (!name || !url || !allowGetIsReadMode.some(v => v === name) || $store.state.app.isModeRead) return false
    const userId = $cookie.get('userId')
    const res = await new Request({
      utilKey: 'ajaxInternationalJson',
      url,
      params: {
        key: `${name}_${userId}` // 用户模块唯一key
      }
    }, 'get').init()
    if (res !== 1 && res.data === 0) {
      success(res)
    }
  }, 200)
}
