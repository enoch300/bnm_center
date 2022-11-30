import request from '@/utils/request'

const api = {

  user: '/user/list',
  addUser: '/user/create',
  editUser: '/user/update',
  delUser: '/user/delete',

  role: '/role/list',
  addRole: 'role/create',
  editRole: 'role/update',
  delRole: 'role/delete',
  detailRole: 'role/info',

  menu: '/menu/list'

}

export default api

export function getUserList (parameter) {
    return request({
        url: api.user,
        method: 'get',
        params: parameter
    })
}

export function addUser (parameter) {
    return request({
        url: api.addUser,
        method: 'post',
        data: parameter
    })
}

export function updateUser (parameter) {
    return request({
        url: api.editUser,
        method: 'post',
        data: parameter
    })
}

export function deleteUser (parameter) {
    return request({
        url: api.delUser,
        method: 'post',
        data: parameter
    })
}

export function getRoleList (parameter) {
    return request({
      url: api.role,
      method: 'get',
      params: parameter
    })
}

export function addRole (parameter) {
    return request({
        url: api.addRole,
        method: 'post',
        data: parameter
    })
}

export function updateRole (parameter) {
    return request({
        url: api.editRole,
        method: 'post',
        data: parameter
    })
}

export function deleteRole (parameter) {
    return request({
        url: api.delRole,
        method: 'post',
        data: parameter
    })
}

export function getMenuList () {
    return request({
      url: api.menu,
      method: 'get'
    })
}
