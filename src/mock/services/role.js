import store from '@/store/index'
import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

// 数据总条数
const roleList = (options) => {
  const roleList = store.state.user.roleList
  const totalCount = roleList.length
  const parameters = getQueryParameters(options)

  const result = []
  // 页码
  const pageNo = parseInt(parameters.pageNo)
  // 每页多少条
  const pageSize = parseInt(parameters.pageSize)
  // 总页数
  const totalPage = Math.ceil(totalCount / pageSize)
  const key = (pageNo - 1) * pageSize
  const next = (pageNo >= totalPage ? (totalCount % pageSize) : pageSize) + 1
  for (let i = 1; i < next; i++) {
    const tmpKey = key + i
    result.push({
      roleId: Mock.mock('@id'),
      roleName: roleList[tmpKey - 1].name,
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
      roleDesc: roleList[tmpKey - 1].text,
      isDefault: roleList[tmpKey - 1].isDefault,
      createTime: Mock.mock('@datetime')
    })
  }

  return builder({
    pageSize: pageSize,
    pageNo: pageNo,
    totalCount: totalCount,
    totalPage: totalPage,
    data: result
  })
}

Mock.mock(/\/api\/role\/list/, 'get', roleList)
