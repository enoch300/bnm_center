<template>
  <a-drawer
    placement="right"
    :closable="false"
    :visible="visible"
    @close="$emit('drawClose')"
    width="60%"
  >
    <a-timeline v-if="model">
      <!-- 接入信息 -->
      <a-timeline-item>
        <div>接入信息</div>
        <a-descriptions title=" " size="small" :column="3" bordered>
          <a-descriptions-item label="默认IP">
            {{ model.controlIp }}
          </a-descriptions-item>
          <a-descriptions-item label="地区">
            {{ model.area }}
          </a-descriptions-item>
          <a-descriptions-item label="部署方式">
            {{ deploymentTypeMap[model.deploymentType] }}
          </a-descriptions-item>
          <a-descriptions-item label="运营商" :span="3">
            <a-table
              rowKey="id"
              :columns="ispColumns"
              :data-source="model.isp"
              width="400px"
              :pagination="false"
              size="small"
              bordered>
            </a-table>
          </a-descriptions-item>
          <!-- <a-descriptions-item label="招募/托管">
          </a-descriptions-item>
          <a-descriptions-item label="上机类型">
          </a-descriptions-item> -->
          <a-descriptions-item label="软件/镜像版本" :span="2">
            <a-table
              rowKey="id"
              :columns="businessesColumns"
              :data-source="model.businessState"
              width="400px"
              :pagination="false"
              size="small"
              bordered>
              <!-- 操作 -->
              <span slot="state" slot-scope="text">
                <span :style="{color: stateColor[text]}">{{ businessesStateMap[text] }}</span>
              </span>
            </a-table>
          </a-descriptions-item>
          <!-- <a-descriptions-item label="镜像安装时间">
          </a-descriptions-item>
          <a-descriptions-item label="绑定时间">
          </a-descriptions-item> -->
          <!-- <a-descriptions-item label="机房类型">
          </a-descriptions-item>
          <a-descriptions-item label="设备是否有UPS">
          </a-descriptions-item>
          <a-descriptions-item label="下机原因">
          </a-descriptions-item> -->
        </a-descriptions>
      </a-timeline-item>
      <!-- 系统信息 -->
      <a-timeline-item>
        <div>系统信息</div>
        <a-descriptions title=" " size="small" :column="2" bordered>
          <a-descriptions-item label="操作系统">
            {{ model.system.os }}
          </a-descriptions-item>
          <a-descriptions-item label="内核版本">
            {{ model.system.kernelVersion }}
          </a-descriptions-item>
          <!-- <a-descriptions-item label="防火墙">
          </a-descriptions-item> -->
          <a-descriptions-item label="主机名">
            {{ model.system.hostname }}
          </a-descriptions-item>
          <a-descriptions-item label="网络类型">
            {{ networkTypeMap[model.networkType] }}
          </a-descriptions-item>
          <a-descriptions-item label="是否IDC节点">
            {{ idcMap[model.idc] }}
          </a-descriptions-item>
        </a-descriptions>
      </a-timeline-item>
      <!-- 硬件信息 -->
      <a-timeline-item>
        <div>硬件信息</div>
        <a-descriptions title=" " size="small" :column="2" bordered>
          <a-descriptions-item label="机型">
            {{ model.hardware.manufacturer }}
          </a-descriptions-item>
          <a-descriptions-item label="服务器SN号">
            {{ model.hardware.serialNumber }}
          </a-descriptions-item>
          <a-descriptions-item label="CPU" :span="2">
            <a-row>
              <a-col :span="14">
                型号：{{ model.cpu.info ? model.cpu.info[0].modelName : '' }}
              </a-col>
              <a-col :span="5">
                核数：{{ model.cpu.logicalCount }}核
              </a-col>
              <a-col :span="5">
                主频：{{ model.cpu.info ? model.cpu.info[0].mhz/1000+'Mhz' : '' }}
              </a-col>
            </a-row>
          </a-descriptions-item>
          <a-descriptions-item label="内存" :span="2">
            <a-space direction="vertical">
              <div>大小：{{ parseInt(model.mem.total / 1000000000) }}G</div>
              <!-- <a-table
                rowKey="no"
                :columns="memoryColumns"
                :data-source="info.hardwareInfo.memoryList"
                width="80%"
                :pagination="false"
                size="small"
                bordered>
              </a-table> -->
            </a-space>
          </a-descriptions-item>
          <a-descriptions-item label="硬盘" :span="2">
            <a-space direction="vertical">
              <div>合计：{{ model.disk.total }}G</div>
              <a-table
                rowKey="id"
                :columns="harddiskColumns"
                :data-source="model.disk.devices"
                width="80%"
                :pagination="false"
                size="small"
                bordered>
              </a-table>
            </a-space>
          </a-descriptions-item>
          <a-descriptions-item label="MAC地址" :span="2">
            <a-space direction="vertical">
              <a-table
                rowKey="id"
                :columns="macColumns"
                :data-source="model.nic"
                width="80%"
                :pagination="false"
                size="small"
                bordered>
              </a-table>
            </a-space>
          </a-descriptions-item>
          <!-- <a-descriptions-item label="设备类型">
            {{ info.hardwareInfo.deviceType }}
          </a-descriptions-item>
          <a-descriptions-item label="raid卡型号">
            {{ info.hardwareInfo.raidModel }}
          </a-descriptions-item>
          <a-descriptions-item label="数据网卡">
            {{ info.hardwareInfo.networkCard }}
          </a-descriptions-item> -->
        </a-descriptions>
      </a-timeline-item>
      <!-- 网络信息 -->
      <!-- <a-timeline-item>
        <div>网络信息</div>
        <a-descriptions title=" " size="small" :column="2" bordered>
          <a-descriptions-item label="上报带宽" :span="2">
            <a-space direction="vertical">
              <a-row>
                <a-col :span="4">
                  总数量：
                </a-col>
                <a-col :span="4">
                  总计(G)：68632
                </a-col>
              </a-row>
              <a-table
                rowKey="type"
                :columns="bindWidthColumns"
                :data-source="[]"
                width="80%"
                :pagination="false"
                size="small"
                bordered>
              </a-table>
            </a-space>
          </a-descriptions-item>
          <a-descriptions-item label="实际带宽">
            {{ info.networkInfo.actualBandwidth }}
          </a-descriptions-item>
          <a-descriptions-item label="公网/内网">
            {{ info.networkInfo.networkModel == 0 ? '内网' : '公网' }}
          </a-descriptions-item>
          <a-descriptions-item label="NAT类型">
            {{ info.networkInfo.natType }}
          </a-descriptions-item>
          <a-descriptions-item label="网络类型">
            {{ networkTypeMap[model.networkType] }}
          </a-descriptions-item>
          <a-descriptions-item label="网络配置结果">
            {{ info.networkInfo.networkConfig }}
          </a-descriptions-item>
          <a-descriptions-item label="是否IDC节点">
            {{ idcMap[model.idc] }}
          </a-descriptions-item>
        </a-descriptions>
      </a-timeline-item> -->
    </a-timeline>
  </a-drawer>
</template>
<script>
import { idcMap, deploymentTypeMap, networkTypeMap,
  ispColumns, businessesColumns, businessesStateMap, harddiskColumns, memoryColumns,
  macColumns, bindWidthColumns } from './hostColumns'
const stateColor = ['#F04864', '#FACC14', '#1890FF', '#223273', '#2FC25B']
export default {
  props: {
      visible: {
          type: Boolean,
          required: true
      },
      model: {
        type: Object,
        default: () => null
      }
  },
  data () {
    return {
      idcMap,
      deploymentTypeMap,
      networkTypeMap,
      ispColumns,
      businessesColumns,
      businessesStateMap,
      stateColor,
      harddiskColumns,
      memoryColumns,
      macColumns,
      bindWidthColumns
    }
  }
}
</script>
<style>
  .ant-descriptions-bordered.ant-descriptions-small .ant-descriptions-item-label{
    word-break: keep-all !important
  }
</style>
