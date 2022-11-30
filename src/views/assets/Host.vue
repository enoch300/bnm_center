<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <!-- 头部筛选表单 -->
        <a-form layout="inline">
          <!-- gutter 栅格间隔 -->
          <a-row :gutter="50">
            <div v-for="(item, itemIndex) in searchColumns" :key="item.dataIndex">
              <a-col :md="8" :sm="24" v-show="itemIndex < 2 || advanced">
                <a-form-item :label="item.searchTitle || item.title">
                  <!-- 下拉选择器 -->
                  <a-select v-if="item.searchType == 2" v-model="queryParam[item.dataIndex]" placeholder="">
                    <a-select-option v-for="(value, index) in item.searchMap.length > 0 ? item.searchMap : 2" :key="index" :value="index">
                      <span v-if="item.searchMap.length > 0">{{ value }}</span>
                      <span v-else>{{ item.title + '--' +value }}</span>
                    </a-select-option>
                  </a-select>
                  <!-- 时间选择器 -->
                  <a-date-picker v-else-if="item.searchType == 3" v-model="queryParam[item.dataIndex]" style="width: 100%" placeholder=""/>
                  <!-- 输入框 -->
                  <a-input v-else v-model="queryParam[item.dataIndex]" placeholder="" />
                </a-form-item>
              </a-col>
            </div>
            <!-- 筛选操作按钮 -->
            <a-col :md="(!advanced && 8) || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}">
                <a-button type="primary" @click="queryTable">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => (this.queryParam = {})">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 新建/多选操作 -->
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAddOrEdit(null)">新建</a-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-button style="margin-left: 8px" @click="handleDel"> 批量删除 </a-button>
          <!-- <a-menu slot="overlay">
            <a-menu-item key="1" @click="itemsOperate(0)" ><a-icon type="delete" />删除</a-menu-item>
            <a-menu-item key="2" @click="itemsOperate(1)"><a-icon type="vertical-align-top" />上机</a-menu-item>
            <a-menu-item key="3" @click="itemsOperate(2)"><a-icon type="vertical-align-bottom" />下机</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /> </a-button> -->
        </a-dropdown>
      </div>
      <!-- 主机表格 -->
      <s-table
        ref="table"
        size="small"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
        bordered
        column.ellipsis
        :scroll="{ x: 2000,y: 500 }" >
        <!-- 通过插槽修改每列的样式 -->
        <span v-for="item in slotsList" :key="item.dataIndex" :slot="item.scopedSlots.customRender" slot-scope="text">
          <!-- 运营商 mac地址 业务部署显示多个 -->
          <span v-if="item.dataIndex == 'businesses'">
            <div v-for="textItem in text" :key="textItem.id">
              <!-- <span v-if="item.dataIndex == 'isp'">{{ textItem.province }}{{ textItem.isp ? '-' + textItem.isp : '' }}</span> -->
              <span>{{ textItem.name }}</span>
              <!-- <span v-else>{{ textItem.mac }}</span> -->
            </div>
          </span>
          <!-- <span v-if="item.dataIndex == 'isp' || item.dataIndex == 'nic'"></span> -->
          <!-- 其他插槽 -->
          <span v-else :class="[item.dataIndex == 'networkStatus' ? 'underline-text status-color' + text : '', item.dataIndex == 'processState' ? 'process-color' + text : '']">
            {{ item.searchMap[text] }}
          </span>
        </span>
        <!-- 操作 -->
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleAddOrEdit(record)">配置</a>
            <a-divider type="vertical" />
            <a @click="handleToggleDetail(record)">详情</a>
          </template>
        </span>
      </s-table>
      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk" />
      <!-- 机器详情 -->
      <HostDetailDrawer
        :visible="detailVisible"
        :model="detailInfo"
        @drawClose="handleToggleDetail(null)" >
      </HostDetailDrawer>
    </a-card>
  </page-header-wrapper>
</template>
<script>
  import { STable } from '@/components'
  import { getHostList, addHost, updateHost, deleteHost } from '@/api/assets'
  import { CreateForm, HostDetailDrawer } from './modules'
  import { columns } from './modules/hostColumns'
  // import Mock from 'mockjs2'

  // 搜索项
  const searchColumns = columns.filter((item, index) => {
    return item.searchType
  })
  // 遍历子项
  // searchColumns.forEach((item, index) => {
  //   if (item.children && item.children.length > 0) {
  //     searchColumns.splice(index, 1, ...item.children)
  //   }
  // })
  // 自定义表格的插槽
  const slotsList = columns.filter(item => {
    return item.scopedSlots
  })

  export default {
    name: 'Host',
    components: {
      STable,
      CreateForm,
      HostDetailDrawer
    },
    data () {
      this.columns = columns // 表头
      this.searchColumns = searchColumns // 搜索项
      this.slotsList = slotsList // 表格自定义插槽列表
      return {
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          return getHostList(requestParameters)
            .then(res => {
              return res
            })
        },
        // 选中的列和key
        selectedRowKeys: [],
        selectedRows: [],
        // 新建/配置弹窗
        visible: false,
        confirmLoading: false,
        mdl: null, // 传递信息
        // 主机详情
        detailVisible: false,
        detailInfo: null
      }
    },
    computed: {
      // 表格选中的列
      rowSelection () {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onSelectChange
        }
      }
    },
    methods: {
      // 新建或配置
      handleAddOrEdit (record) {
        this.visible = true
        if (record) {
          record.hostname = record.system.hostname || ''
        }
        this.mdl = record || null
      },
      // 详细信息
      handleToggleDetail (record) {
        this.detailInfo = record || null
        this.detailVisible = !!record
      },
      // 新建/配置表单取消
      handleCancel () {
        this.visible = false
        this.mdl = null
        const form = this.$refs.createModal.form
        form.resetFields() // 清理表单数据（可不做）
      },
      // 新建/配置表单提交
      handleOk () {
        const form = this.$refs.createModal.form
        this.confirmLoading = true
        form.validateFields((errors, values) => {
          if (!errors) {
            // 业务-镜像版本
            values.businesses = []
            values.businessName.forEach(item => {
              values.businesses.push({
                id: item
              })
            })
            // 计费
            values.billing = {
              state: values.id ? this.mdl.billing.state : 0,
              rule: values.billingRules,
              model: values.billingModel,
              cycle: values.billingCycle
            }
            // 客户id
            values.customerId = parseInt(values.customerId)
            values.reportBandwidth = parseInt(values.reportBandwidth)
            // 调用接口
            const type = values.id ? 2 : 1
            // if (type === 1) {
            //   values.area = Mock.Random.region()
            //   const isp = []
            //   const len = Mock.mock('@integer(1, 3)')
            //   const ispMap = ['移动', '电信', '联通']
            //   for (let index = 0; index < len; index++) {
            //     const cityData = Mock.Random.city(true).split(' ')
            //     isp.push({
            //       ip: Mock.mock('@ip'),
            //       province: cityData[0],
            //       city: cityData[1],
            //       isp: ispMap[Mock.mock('@integer(0, 2)')]
            //     })
            //   }
            //   values.isp = isp
            //   console.log(isp)
            // }
              // 编辑用户 把编辑的部分更新到原有的数据上一起提交
              if (type === 2) {
                const newParam = this.mdl
                // newParam.machineName = values.machineName
                newParam.machineId = values.machineId
                newParam.idc = values.idc
                newParam.businesses = values.businesses
                newParam.deploymentType = values.deploymentType
                newParam.networkType = values.networkType
                newParam.reportBandwidth = values.reportBandwidth
                newParam.billing = values.billing
                newParam.supplier = values.supplier
                newParam.owner = values.owner
                newParam.customerId = values.customerId
                values = newParam
              }
              this.handleItemOper(type, values)
          } else {
            this.confirmLoading = false
            this.$message.error(values.name ? '修改失败' : '新增失败')
          }
        })
      },
      // 批量删除
      handleDel () {
        this.$confirm({
          title: '删除提示',
          content: '确定删除选中主机吗',
          onOk: () => {
            const param = {
              id: this.selectedRowKeys
            }
            this.handleItemOper(0, param)
          },
          onCancel () {}
        })
      },
      // type 0 删除  1添加 2 编辑
      handleItemOper (type, param) {
        const funArr = [
          {
            title: '删除',
            fun: deleteHost
          },
          {
            title: '新增',
            fun: addHost
          },
          {
            title: '修改',
            fun: updateHost
          }
        ]
        funArr[type].fun(param).then(res => {
          if (res.code === 0) {
            if (type === 0) {
              // 删除后 清除选中
              this.$refs.table.clearSelected()
            } else {
              // 编辑/新增 成功后重置表单 关闭弹窗
              this.visible = false
              this.mdl = null
              this.confirmLoading = false
              const form = this.$refs.createModal.form
              // 重置表单数据
              form.resetFields()
            }
            // 刷新表格
            this.$refs.table.refresh()
            this.$message.info(`${funArr[type].title}成功`)
          } else {
            this.confirmLoading = false
            this.$message.error(res.msg)
          }
        }).catch(err => {
          console.log(err)
          this.confirmLoading = false
          this.$message.info(`${funArr[type].title}失败`)
        })
      },
      // 表格多选
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      // 显式/隐藏 筛选其他条件
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      // 查询
      queryTable () {
        // 时间需要格式化再传 不然是moment对象
        // this.queryParam.onlineTime.format('YYYY-MM-DD')
        // this.queryParam.upTime.format('YYYY-MM-DD')
        // this.queryParam.downTime.format('YYYY-MM-DD')
        console.log(this.queryParam)
        this.$refs.table.refresh()
      },
      // 删除/上机/下机
      itemsOperate (type) {
        const operMap = ['删除', '上机', '下机']
        this.$message.loading(`正在批量${operMap[type]}...`, 1)
        // operHost({
        //   type: type,
        //   items: this.selectedRowKeys.join(',')
        // }).then(res => {
        //   if (res.result.status) {
        //     this.$refs.table.clearSelected()
        //     // 刷新表格
        //     this.$refs.table.refresh()
        //     this.$message.info(`${operMap[type]}成功`)
        //   } else {
        //     this.$message.error(`${operMap[type]}失败`)
        //   }
        // })
      }
    }
  }
</script>
<style>
  .status-color0{
    color: #F04864;
  }
  .status-color1,.process-color1{
    color: #2FC25B;
  }
  .process-color2{
    color: #FACC14;
  }
  .underline-text{
    text-decoration: underline;
  }
</style>
