import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

// 数据总条数
const totalCount = 200

// 主机列表
const hostList = (options) => {
    // 筛选条件
    const parameters = getQueryParameters(options)
    // console.log('==========hostList options============')
    // console.log(parameters)

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
        no: tmpKey,
        name: '节点名-' + Mock.mock('@string("lower", 5, 8)') + Mock.mock('@city'),
        nodeId: Mock.mock('@string("lower", 32, 32)'),
        processStatus: Mock.mock('@integer(0, 5)'),
        ip: Mock.mock('@ip'),
        ipStack: Mock.mock('@integer(0, 2)'),
        isIdc: Mock.mock('@integer(0, 1)'),
        area: `${ Mock.mock('@region') }-${ Mock.mock('@province') }${ Mock.mock('@city') }`,
        isp: Mock.mock('@integer(0,2)'),
        networkStatus: Mock.mock('@integer(0,1)'),
        onlineTime: Mock.mock('@datetime'),
        isoVersion: Mock.mock('@integer(1, 999)'),
        deploymentType: Mock.mock('@integer(0, 1)'),
        evaluationRes: Mock.mock('@integer(0, 1)'),
        model: '机型-' + Mock.mock('@string("lower", 3, 5)'),
        cpu: Mock.mock('@integer(1, 60)'),
        memory: Mock.mock('@integer(0, 3)'),
        hardDisk: Mock.mock('@integer(1, 60)'),
        networkType: Mock.mock('@integer(0, 4)'),
        mac: Mock.mock('@ip'),
        reportBandwidth: Mock.mock('@float(1,5,2,2)'),
        feeStatus: '计费状态',
        feeRules: Mock.mock('@integer(0, 4)'),
        priceModel: '价格模式',
        billingCycle: Mock.mock('@integer(0, 2)'),
        supplier: Mock.mock('@name'),
        upTime: Mock.mock('@datetime'),
        downTime: Mock.mock('@datetime'),
        butt: Mock.mock('@name'),
        customerId: Mock.mock('@id')
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

// 主机详情
const hostDetail = (options) => {
    // 筛选条件
    // const parameters = getQueryParameters(options)
    // console.log('==========hostDetail options============')
    // console.log(parameters)

    const diskList = []
    const memoryList = []
    const macList = []
    const bindWidthList = [
        {
            type: 'IPV4',
            lineFlow: Mock.mock('@integer(100, 200)'),
            lineNumber: Mock.mock('@integer(10, 30)')
        },
        {
            type: 'IPV6',
            lineFlow: Mock.mock('@integer(100, 200)'),
            lineNumber: Mock.mock('@integer(10, 30)')
        }
    ]
    for (let i = 0; i < 4; i++) {
        diskList.push({
            no: i + 1,
            model: Mock.mock('@string("lower", 4, 4)'),
            name: Mock.mock('@string("lower", 4, 4)'),
            size: Mock.mock('@float(1, 6, 2, 2)'),
            type: Mock.mock('@string("lower", 4, 4)')
        })
        memoryList.push({
            no: i + 1,
            model: Mock.mock('@string("lower", 4, 4)'),
            size: Mock.mock('@float(1, 6, 2, 2)'),
            type: Mock.mock('@string("lower", 4, 4)')
        })
        macList.push({
            no: i + 1,
            model: Mock.mock('@string("lower", 4, 4)'),
            name: Mock.mock('@string("lower", 4, 4)'),
            mac: '56:78:90:453',
            ip: Mock.mock('@ip')
        })
    }

    const details = {
        accessInfo: {
            defaultIp: Mock.mock('@ip'),
            area: `${ Mock.mock('@region') }-${ Mock.mock('@province') }${ Mock.mock('@city') }`,
            isp: Mock.mock('@integer(0,2)'),
            status: Mock.mock('@integer(0,1)'),
            OnboardType: '上机类型',
            isoVersion: '1.0/Pal-1.1.5',
            isoInstallTime: Mock.mock('@datetime'),
            bingTime: Mock.mock('@datetime'),
            deploymentType: Mock.mock('@integer(0, 1)'),
            roomType: '机房类型',
            hasUps: Mock.mock('@integer(0,1)'),
            downReason: '下机原因'
        },
        systemInfo: {
            system: 'windows 64',
            kernelVersion: 'dasd266',
            firewall: Mock.mock('@integer(0,1)'),
            hostName: '主机名'
        },
        hardwareInfo: {
            model: '机型-58345j',
            cpuModel: 'Inter(R) Xeon(R) CPU',
            cpuKernel: Mock.mock('@integer(10,99)'),
            cpuHz: '3.1GHz',
            deviceType: Mock.mock('@string("lower", 8, 8)'),
            diskTotal: Mock.mock('@integer(125,520)'),
            diskList: diskList,
            memoryTotal: Mock.mock('@integer(10,20)'),
            memoryList: memoryList,
            raidModel: Mock.mock('@string("lower", 16, 16)'),
            networkCard: '^enp9s$',
            mac: macList,
            snNo: Mock.mock('@string("lower", 16, 16)')
        },
        networkInfo: {
            reportBandwidth: bindWidthList,
            actualBandwidth: Mock.mock('@integer(10,99)'),
            networkModel: Mock.mock('@integer(0,1)'),
            natType: 'NATO',
            networkType: Mock.mock('@integer(0,4)'),
            networkConfig: '网络配置结果',
            isIdc: Mock.mock('@integer(0,1)')
        }
    }
    return builder(details)
}

// 批量 删除/上机/下机
const hostOper = (options) => {
    // const parameters = getQueryParameters(options)
    // console.log('==========hostOper options============')
    // console.log(parameters)
    const result = {
        status: Mock.mock('@integer(0,1)'),
        msg: 'success'
    }
    return builder(result)
}

// 新增/编辑主机
const hostEdit = (options) => {
    const parameters = getQueryParameters(options)
    console.log('==========hostEdit options============')
    console.log(parameters)
    const result = {
        status: Mock.mock('@integer(0,1)'),
        msg: 'success'
    }
    return builder(result)
}

Mock.mock(/\/api\/host\/list/, 'get', hostList)
Mock.mock(/\/api\/host\/detail/, 'get', hostDetail)
Mock.mock(/\/api\/host\/oper/, 'get', hostOper)
Mock.mock(/\/api\/host\/edit/, 'get', hostEdit)
