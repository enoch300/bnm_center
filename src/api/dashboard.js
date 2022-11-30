
import request from '@/utils/request'

const api = {
  minArea: '/flow/groupTimeSumSendRecv'
}

export default api

// 头部带宽趋势
export function getBillingCount (parameter) {
    return request({
        url: api.minArea,
        method: 'get',
        params: parameter
    })
}
