import storage from 'store'
import expirePlugin from 'store/plugins/expire'
import { login, getInfo } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

storage.addPlugin(expirePlugin)
const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    UPDATE_ROLESITEM: (state, [name, text, key]) => {
      if (key) {
        state.roleList[key - 1].name = name
        state.roleList[key - 1].text = text
      } else {
        state.roleList.unshift({ name, text })
      }
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response
          storage.set(ACCESS_TOKEN, result.token, new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result.token)
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        // 请求后端获取用户信息
        getInfo().then(response => {
          const result = response.data
          commit('SET_INFO', result)
          commit('SET_NAME', { name: result.name, welcome: welcome() })
          commit('SET_AVATAR', result.avatar)
          resolve(result)
          // result.role = result.roles[0]
          // result.role = {
          //   id: 'admin',
          //   name: '管理员',
          //   describe: '拥有所有权限',
          //   status: 1,
          //   creatorId: 'system',
          //   createTime: 1497160610259,
          //   deleted: 0,
          //   permissions: [
          //     {
          //       roleId: 'admin',
          //       permissionId: 'dashboard',
          //       permissionName: '仪表大盘',
          //       actions:
          //         '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
          //       actionEntitySet: [
          //         {
          //           action: 'add',
          //           describe: '新增',
          //           defaultCheck: false
          //         },
          //         {
          //           action: 'query',
          //           describe: '查询',
          //           defaultCheck: false
          //         },
          //         {
          //           action: 'get',
          //           describe: '详情',
          //           defaultCheck: false
          //         },
          //         {
          //           action: 'update',
          //           describe: '修改',
          //           defaultCheck: false
          //         },
          //         {
          //           action: 'delete',
          //           describe: '删除',
          //           defaultCheck: false
          //         }
          //       ],
          //       actionList: null,
          //       dataAccess: null
          //     },
          //     {
          //       roleId: 'admin',
          //       permissionId: 'host',
          //       permissionName: '主机管理',
          //       actions:
          //         '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"edit","defaultCheck":false,"describe":"编辑"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
          //       actionEntitySet: [
          //         {
          //           action: 'add',
          //           describe: '新增',
          //           defaultCheck: false
          //         },
          //         {
          //           action: 'edit',
          //           describe: '编辑',
          //           defaultCheck: false
          //         },
          //         {
          //           action: 'query',
          //           describe: '查询',
          //           defaultCheck: false
          //         },
          //         {
          //           action: 'get',
          //           describe: '详情',
          //           defaultCheck: false
          //         },
          //         {
          //           action: 'update',
          //           describe: '修改',
          //           defaultCheck: false
          //         },
          //         {
          //           action: 'delete',
          //           describe: '删除',
          //           defaultCheck: false
          //         }
          //       ],
          //       actionList: null,
          //       dataAccess: null
          //     }
          //   ]
          // }
          // if (result.role && result.role.permissions.length > 0) {
          //   const role = { ...result.role }
          //   role.permissions = result.role.permissions.map(permission => {
          //     const per = {
          //       ...permission,
          //       actionList: (permission.actionEntitySet || {}).map(item => item.action)
          //      }
          //     return per
          //   })
          //   role.permissionList = role.permissions.map(permission => { return permission.permissionId })
          //   // 覆盖响应体的 role, 供下游使用
          //   result.role = role
          //   commit('SET_ROLES', role)
          //   commit('SET_INFO', result)
          //   commit('SET_NAME', { name: result.name, welcome: welcome() })
          //   commit('SET_AVATAR', result.avatar)
          //   // 下游
          //   resolve(result)
          // } else {
          //   reject(new Error('getInfo: roles must be a non-null array !'))
          // }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        storage.remove(ACCESS_TOKEN)
        resolve()
      })
    }

  }
}

export default user
