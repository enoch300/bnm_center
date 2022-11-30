// 流程状态
const processStateMap = ['未部署', '任务已部署', '计费中']
// ip协议栈
const ipStackMap = ['IPV4', 'IPV6', '双栈']
// 是否IDC
const idcMap = ['非IDC', 'IDC']
// 网络状态
const networkStatusMap = ['离线', '在线']
// 部署方式
const deploymentTypeMap = ['裸机', '容器']
// 测试结果
const evaluationResMap = ['待测试', '测试中', '测试通过', '未通过']
// 网络类型
const networkTypeMap = ['固定IP', '拨号']
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
        name: '快手'
    },
    {
        id: 2,
        name: '头条'
    },
    {
        id: 3,
        name: '腾讯'
    },
    {
        id: 4,
        name: '百度'
    }
]
// 业务状态
const businessesStateMap = ['下线', '正在初始化', '正在部署', '部署完成', '服务中']
// 主机列表表头
const columns = [
    {
        title: '节点名',
        dataIndex: 'system.hostname',
        fixed: 'left',
        align: 'center',
        width: '150px',
        searchType: 1
    },
    {
        title: '节点ID',
        dataIndex: 'machineId',
        align: 'center',
        width: '180px',
        searchType: 1
    },
    {
        title: '流程状态',
        dataIndex: 'processState',
        align: 'center',
        width: '100px',
        searchMap: processStateMap,
        scopedSlots: { customRender: 'processState' }
    },
    {
        title: 'IP',
        dataIndex: 'controlIp',
        align: 'center',
        width: '150px'
    },
    {
        title: 'IP协议栈',
        dataIndex: 'ipStack',
        align: 'center',
        width: '100px',
        searchType: 2,
        searchMap: ipStackMap,
        customRender: (text) => ipStackMap[text]
    },
    {
        title: '是否IDC节点',
        dataIndex: 'idc',
        align: 'center',
        width: '100px',
        searchTitle: '是否IDC',
        customRender: (text) => idcMap[text]
    },
    {
        title: '地区',
        dataIndex: 'area',
        align: 'center',
        width: '100px'
    },
    {
        title: '运营商',
        dataIndex: 'isp',
        align: 'center',
        width: '120px',
        customRender: (text) => text.length > 0 ? text[0].province + (text.isp ? '-' + text.isp : '') : ''
        // scopedSlots: { customRender: 'isp' }
    },
    {
        title: '网络状态',
        dataIndex: 'networkStatus',
        align: 'center',
        width: '100px',
        searchMap: networkStatusMap,
        scopedSlots: { customRender: 'networkStatus' }
    },
    {
        title: '最近在线',
        dataIndex: 'onlineTime',
        align: 'center',
        width: '180px'
    },
    {
        title: '业务部署',
        dataIndex: 'businesses',
        align: 'center',
        width: '100px',
        scopedSlots: { customRender: 'businesses' }
    },
    {
        title: '部署方式',
        dataIndex: 'deploymentType',
        align: 'center',
        width: '100px',
        searchType: 2,
        searchMap: deploymentTypeMap,
        customRender: (text) => deploymentTypeMap[text]
    },
    {
        title: '测评结果',
        dataIndex: 'evaluationRes',
        align: 'center',
        width: '100px',
        customRender: (text) => evaluationResMap[text]
    },
    {
        title: '硬件',
        children: [
        // {
        //     title: '机型',
        //     dataIndex: 'model',
        //     align: 'center',
        //     width: '100px',
        //     searchType: 0
        // },
        {
            title: 'CPU',
            dataIndex: 'cpu',
            align: 'center',
            width: '100px',
            customRender: (text) => text.physicalCount + '核'
        },
        {
            title: '内存',
            dataIndex: 'mem',
            align: 'center',
            width: '100px',
            customRender: (text) => parseInt(text.total / 1000000000) + 'G' + text.model
        },
        {
            title: '硬盘',
            dataIndex: 'disk',
            align: 'center',
            width: '100px',
            customRender: (text) => text.total + 'G'
        }
        ]
    },
    {
        title: '网络类型',
        dataIndex: 'networkType',
        align: 'center',
        width: '100px',
        customRender: (text) => networkTypeMap[text]
    },
    {
        title: 'MAC地址',
        dataIndex: 'nic',
        align: 'center',
        width: '150px',
        customRender: (text) => text.length > 0 ? text[0].mac : ''
        // scopedSlots: { customRender: 'nic' }
    },
    {
        title: '上报带宽',
        dataIndex: 'reportBandwidth',
        align: 'center',
        width: '100px',
        customRender: (text) => text + 'G'
    },
    {
        title: '计费',
        children: [
        {
            title: '计费状态',
            dataIndex: 'billing.state',
            align: 'center',
            width: '100px',
            customRender: (text) => feeStateMap[text]
        },
        {
            title: '计费规则',
            dataIndex: 'billing.rule',
            align: 'center',
            width: '100px',
            customRender: (text) => feeRulesMap[text]
        },
        {
            title: '价格模式',
            dataIndex: 'billing.model',
            align: 'center',
            width: '100px',
            customRender: (text) => feeModelMap[text]
        },
        {
            title: '结算周期',
            dataIndex: 'billing.cycle',
            align: 'center',
            width: '100px',
            customRender: (text) => billingCycleMap[text]
        }
        ]
    },
    {
        title: '供应商',
        dataIndex: 'supplier',
        align: 'center',
        width: '100px'
    },
    {
        title: '上机时间',
        dataIndex: 'upTime',
        align: 'center',
        width: '180px'
    },
    {
        title: '下机时间',
        dataIndex: 'downTime',
        align: 'center',
        width: '180px'
    },
    {
        title: '对接人',
        dataIndex: 'owner',
        align: 'center',
        width: '100px'
    },
    {
        title: '客户ID',
        dataIndex: 'customerId',
        align: 'center',
        width: '100px',
        searchType: 1
    },
    {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        align: 'center',
        width: '100px',
        scopedSlots: { customRender: 'action' }
    }
]
// 主机详情-硬盘表头
const harddiskColumns = [
    {
        title: '名称',
        dataIndex: 'name',
        align: 'center'
    },
    {
        title: '容量(G)',
        dataIndex: 'total',
        align: 'center'
    },
    {
        title: '类型',
        dataIndex: 'type',
        align: 'center'
    }
]
// 主机详情-运营商
const ispColumns = [
    {
        title: 'IP',
        dataIndex: 'ip',
        align: 'center'
    },
    {
        title: '省份',
        dataIndex: 'province',
        align: 'center'
    },
    {
        title: '城市',
        dataIndex: 'city',
        align: 'center'
    },
    {
        title: '运营商',
        dataIndex: 'isp',
        align: 'center'
    }
]
// 主机详情-软件镜像版本
const businessesColumns = [
    {
        title: '业务名',
        dataIndex: 'name',
        align: 'center'
    },
    {
        title: '镜像版本',
        dataIndex: 'imgVersion',
        align: 'center'
    },
    {
        title: '状态',
        dataIndex: 'state',
        align: 'center',
        searchMap: businessesStateMap,
        scopedSlots: { customRender: 'state' }
    }
]
// 主机详情-内存表头
const memoryColumns = [
    {
        title: '序号',
        dataIndex: 'no',
        align: 'center'
    },
    {
        title: '型号',
        dataIndex: 'model',
        align: 'center'
    },
    {
        title: '容量(G)',
        dataIndex: 'size',
        align: 'center'
    },
    {
        title: '类型',
        dataIndex: 'type',
        align: 'center'
    }
]
// 主机详情-mac地址表头
const macColumns = [
    {
        title: '网卡名',
        dataIndex: 'name',
        align: 'center'
    },
    {
        title: 'MAC地址',
        dataIndex: 'mac',
        align: 'center'
    }
]
/// 主机详情-上报带宽表头
const bindWidthColumns = [
    {
        title: '类型',
        dataIndex: 'type',
        align: 'center'
    },
    {
        title: '线路数量',
        dataIndex: 'lineNumber',
        align: 'center'
    },
    {
        title: '单线(M)',
        dataIndex: 'lineFlow',
        align: 'center'
    }
]

export { processStateMap, ipStackMap, idcMap, networkStatusMap, deploymentTypeMap,
    evaluationResMap, networkTypeMap, feeStateMap, feeRulesMap, feeModelMap, billingCycleMap,
    areaMap, businessesMap, businessesStateMap, columns, ispColumns, businessesColumns,
    harddiskColumns, memoryColumns, macColumns, bindWidthColumns }
