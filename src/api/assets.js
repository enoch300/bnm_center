import request from '@/utils/request'

const api = {
  list: '/cmdb/list',
  add: '/cmdb/create',
  update: '/cmdb/update',
  delete: '/cmdb/delete',
  detail: '/cmdb/detail'
}

export default api
// 主机列表
export function getHostList (parameter) {
    return request({
        url: api.list,
        method: 'get',
        params: parameter
    })
}
// 主机详情
export function getHostDetail (parameter) {
    return request({
        url: api.detail,
        method: 'get',
        params: parameter
    })
}
// 添加主机
export function addHost (parameter) {
    return request({
        url: api.add,
        method: 'post',
        data: parameter
    })
}
// 更新主机
export function updateHost (parameter) {
    return request({
        url: api.update,
        method: 'post',
        data: parameter
    })
}
// 删除主机
export function deleteHost (parameter) {
    return request({
        url: api.delete,
        method: 'post',
        data: parameter
    })
}
