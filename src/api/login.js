import request from '@/utils/request'

const userApi = {
  Login: '/auth/login',
  Logout: '/auth/logout',

  ForgePassword: '/auth/forge-password',
  SendSms: '/account/sms',
  // get my info
  UserInfo: '/user/info',
  UserMenu: '/user/menu'
}

/**
 * 用户登录
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter
  })
}
/**
 * 获取验证码
 * parameter: {
 * }
 * @param parameter
 * @returns {*}
 */
export function getSmsCaptcha (parameter) {
  return request({
    url: userApi.SendSms,
    method: 'post',
    data: parameter
  })
}
// 获取用户信息
export function getInfo (parameter) {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    data: parameter
  })
}
// 获取用户菜单
export function getCurrentUserNav () {
  return request({
    url: userApi.UserMenu,
    method: 'get'
  })
}
// 退出登录
export function logout () {
  return request({
    url: userApi.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
