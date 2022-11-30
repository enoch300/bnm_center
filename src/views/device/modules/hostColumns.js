// 状态

const statusList = { 0: '离线', 1: '在线' }
// IP协议栈
const ipStackMap = { 4: 'IPV4', 6: 'IPV6' }

// 网络类型
const networkTypeMap = {
  0: 'NAT1',
  1: 'NAT2',
  2: 'NAT3',
  3: 'NAT4',
  4: 'NAT5',
}

// 流程状态
const processStateMap = ['未部署', '任务已部署', '计费中']
// ip协议栈
// 是否IDC
const idcMap = ['非IDC', 'IDC']
// 网络状态
const networkStatusMap = ['离线', '在线']
// 部署方式
const deploymentTypeMap = ['裸机', '容器']
// 测试结果
const evaluationResMap = ['待测试', '测试中', '测试通过', '未通过']
// 计费状态
const feeStateMap = ['未计费', '计费中']
// 计费规则
const feeRulesMap = ['日95', '晚95', '买断', '月95', '保底']
// 价格模式
const feeModelMap = ['移动公网', '移动内网', '移动城域网', '电联公网']
// 结算周期
const billingCycleMap = ['日结', '月结']
// 地区
const areaMap = ['华东', '华南', '华北', '西南', '东北', '西北']
// 业务名
const businessesMap = [
  {
    id: 1,
    name: '快手',
  },
  {
    id: 2,
    name: '头条',
  },
  {
    id: 3,
    name: '腾讯',
  },
  {
    id: 4,
    name: '百度',
  },
]
// 业务状态
const businessesStateMap = ['下线', '正在初始化', '正在部署', '部署完成', '服务中']
// 设备列表表头
const columns = [
  {
    title: '用户ID',
    dataIndex: 'id',
    align: 'center',
    fixed: 'left',
    width: '100px',
    searchType: 1,
  },
  {
    title: '设备SN',
    dataIndex: 'sn',
    align: 'center',
    width: '180px',
    // searchMap: processStateMap,
    // scopedSlots: { customRender: 'processState' },
  },
  {
    title: '所属客户',
    dataIndex: 'customer[0].name',
    align: 'center',
    width: '150px',
  },
  {
    title: '状态',
    dataIndex: 'online',
    align: 'center',
    width: '100px',
    scopedSlots: { customRender: 'online' },
  },
  {
    title: '网络类型',
    dataIndex: 'net_type',
    align: 'center',
    width: '100px',
    customRender: (text) => networkTypeMap[text],
  },
  {
    title: 'IP协议栈',
    dataIndex: 'ip_stack',
    align: 'center',
    width: '100px',
    searchType: 2,
    searchMap: ipStackMap,
    customRender: (value) => {
      return ipStackMap[value]
    },
  },
  {
    title: '设备型号',
    dataIndex: 'cpu',
    align: 'center',
    width: '180px',
    searchTitle: '是否IDC',
    customRender: (value) => {
      if (value.physicalCount !== 0) {
        return `${value.vendorId}
        physicalCount:${value.physicalCount}`
      } else {
        return null
      }
    },
  },
  {
    title: 'CPU型号',
    dataIndex: 'cpu.model',
    align: 'center',
    width: '180px',
  },
  {
    title: '内存(M)',
    dataIndex: 'mem.total',
    align: 'center',
    width: '100px',
    // scopedSlots: { customRender: 'isp' }
  },
  {
    title: '硬盘(G)',
    dataIndex: 'disk.total',
    align: 'center',
    width: '100px',
    // scopedSlots: { customRender: 'networkStatus' },
  },
  {
    title: '插件数量',
    dataIndex: 'dev_plugin.length',
    align: 'center',
    width: '100px',
  },
  {
    title: '插件信息',
    dataIndex: 'dev_plugin',
    align: 'center',
    width: '180px',
    customRender: (value, row, index) => {
      const text = value.map((item) => {
        const status = item.status === 0 ? '停止' : '服务'
        return item.name + '_v' + item.version + status
      })
      return text
    },
  },

  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    align: 'center',
    width: '150px',
    scopedSlots: { customRender: 'action' },
  },
]
// 主机详情-硬盘表头
const harddiskColumns = [
  {
    title: '名称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '容量(G)',
    dataIndex: 'total',
    align: 'center',
  },
  {
    title: '类型',
    dataIndex: 'type',
    align: 'center',
  },
]
// 主机详情-运营商
const ispColumns = [
  {
    title: 'IP',
    dataIndex: 'ip',
    align: 'center',
  },
  {
    title: '省份',
    dataIndex: 'province',
    align: 'center',
  },
  {
    title: '城市',
    dataIndex: 'city',
    align: 'center',
  },
  {
    title: '运营商',
    dataIndex: 'isp',
    align: 'center',
  },
]
// 主机详情-软件镜像版本
const businessesColumns = [
  {
    title: '业务名',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '镜像版本',
    dataIndex: 'imgVersion',
    align: 'center',
  },
  {
    title: '状态',
    dataIndex: 'state',
    align: 'center',
    searchMap: businessesStateMap,
    scopedSlots: { customRender: 'state' },
  },
]
// 主机详情-内存表头
const memoryColumns = [
  {
    title: '序号',
    dataIndex: 'no',
    align: 'center',
  },
  {
    title: '型号',
    dataIndex: 'model',
    align: 'center',
  },
  {
    title: '容量(G)',
    dataIndex: 'size',
    align: 'center',
  },
  {
    title: '类型',
    dataIndex: 'type',
    align: 'center',
  },
]
// 主机详情-mac地址表头
const macColumns = [
  {
    title: '网卡名',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: 'MAC地址',
    dataIndex: 'mac',
    align: 'center',
  },
]
/// 主机详情-上报带宽表头
const bindWidthColumns = [
  {
    title: '类型',
    dataIndex: 'type',
    align: 'center',
  },
  {
    title: '线路数量',
    dataIndex: 'lineNumber',
    align: 'center',
  },
  {
    title: '单线(M)',
    dataIndex: 'lineFlow',
    align: 'center',
  },
]

export {
  processStateMap,
  ipStackMap,
  idcMap,
  networkStatusMap,
  deploymentTypeMap,
  evaluationResMap,
  networkTypeMap,
  feeStateMap,
  feeRulesMap,
  feeModelMap,
  billingCycleMap,
  areaMap,
  businessesMap,
  businessesStateMap,
  columns,
  ispColumns,
  businessesColumns,
  harddiskColumns,
  memoryColumns,
  macColumns,
  bindWidthColumns,
  statusList,
}
