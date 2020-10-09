import {
  Request
} from '@/api/baseUtilAjax'

export const syncBiPrivilege = async (params = {}, success = null, error = null, cbs = []) => {
  /**
   * @userId
   *  @orgId
   */
  return new Request({
    url: 'new-privilege/biPermission/syncBiPrivilege',
    params
  }, 'get').init(success, error, cbs)
}
export const serverLogin = async (data = {}, success = null, error = null, cbs = []) => {
  /**
        enterpriseId: enterpriseId,
        accid: accid,
        token: token,
        serviceName: serviceName,
        userType: userType
  */
  return new Request({
    url: '/server/serverLogin',
    data
  }).init(success, error, cbs)
}
