<template>
  <a-card :bordered="false">
    <!-- 头部搜索 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <div v-for="(item, itemIndex) in searchColumns" :key="item.dataIndex">
            <a-col :md="8" :sm="24" v-show="itemIndex < 2 || advanced">
              <a-form-item :label="item.title">
                <!-- 下拉选择器 -->
                <a-select v-if="item.searchType == 1" v-model="queryParam[item.dataIndex]" placeholder="">
                  <a-select-option
                    v-for="(value, index) in item.dataIndex == 'roles' ? roleList : item.searchMap"
                    :key="index"
                    :value="value.id"
                  >
                    <span>{{ value.name }}</span>
                  </a-select-option>
                </a-select>
                <!-- 时间选择器 -->
                <a-date-picker
                  v-else-if="item.searchType == 2"
                  v-model="queryParam[item.dataIndex]"
                  style="width: 100%"
                  placeholder=""
                />
                <!-- 输入框 -->
                <a-input v-else v-model="queryParam[item.dataIndex]" placeholder="" />
              </a-form-item>
            </a-col>
          </div>
          <a-col :md="(!advanced && 6) || 24" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
            >
              <a-button type="primary" @click="handleSearch">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => (this.queryParam = { status: -1 })">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 新增用户，多选后显示批量删除 -->
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAddOrEdit()">添加用户</a-button>
      <!-- 选中用户后显式批量操作 -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-button style="margin-left: 8px" @click="handleTips(0)"> 批量删除 </a-button>
        <!-- <a-menu slot="overlay">
          <a-menu-item key="1" @click="handleTips(0)"><a-icon type="delete" />删除</a-menu-item>
          <a-menu-item key="2" @click="handleTips(1)"><a-icon type="unlock" />启用</a-menu-item>
          <a-menu-item key="3" @click="handleTips(2)"><a-icon type="lock" />禁用</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /> </a-button> -->
      </a-dropdown>
    </div>
    <!-- 用户列表 -->
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowSelection="rowSelection"
      showPagination="auto"
      bordered
    >
      <!-- 通过插槽修改每列的样式 -->
      <span slot="userName" slot-scope="text, record">
        <template>
          <a-space>
            <a-avatar v-if="record.avatar" size="small" :src="record.avatar" />
            <span>{{ text }}</span>
          </a-space>
        </template>
      </span>
      <span slot="status" slot-scope="text">
        <a-badge :status="text ? 'success' : 'error'" :text="text ? '启用' : '禁用'" />
      </span>
      <span slot="roles" slot-scope="text">
        <a-tag color="blue" v-for="item in text" :key="item.id">
          {{ item.name }}
        </a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleAddOrEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleTips(record.status + 1, record)">{{ record.status ? '禁用' : '启用' }}</a>
          <a-divider type="vertical" />
          <a @click="handleTips(0, record)" class="color-red">删除</a>
        </template>
      </span>
    </s-table>
    <!-- 新建/编辑用户 -->
    <user-form
      ref="createModal"
      :visible="visible"
      :loading="confirmLoading"
      :roleList="roleList"
      :model="mdl"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </a-card>
</template>
<script>
import md5 from 'md5'
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import UserForm from './modules/UserForm'
import { getRoleList, getUserList, addUser, deleteUser, updateUser } from '@/api/system'
import { userColumns } from './modules/columnsData'
// 搜索项
const searchColumns = userColumns.filter((item, itemindex) => {
  return item.searchType !== -1
})

export default {
  name: 'UserManage',
  components: {
    STable,
    Ellipsis,
    UserForm,
  },
  data() {
    this.columns = userColumns
    this.searchColumns = searchColumns
    return {
      // 新建/编辑用户
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        status: -1,
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return getUserList(requestParameters).then((res) => {
          return res
        })
      },
      // 多选选中的数据
      selectedRowKeys: [],
      selectedRows: [],
      // 角色列表
      roleList: [],
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
      }
    },
  },
  created() {
    getRoleList().then((res) => {
      if (res.code === 0) {
        this.roleList = res.data
      } else {
        this.$message.error(res.msg)
      }
    })
  },
  methods: {
    // 用户操作
    handleTips(type, record) {
      // type 0-删除  1-启用  2-禁用
      const user = !record ? '选中用户' : `用户“${record.name}”`
      const operMap = ['删除', '启用', '禁用']

      this.$confirm({
        title: `${operMap[type]}提示`,
        content: `确定${operMap[type]}${user}吗？`,
        onOk: () => {
          let param = record
          if (type === 0) {
            param = {
              id: record ? [record.id] : this.selectedRowKeys,
            }
          } else {
            param.status = type === 1 ? 1 : 0
          }
          this.handleItemOper(type === 0 ? 0 : 2, param)
        },
        onCancel() {},
      })
    },
    // 添加或编辑用户
    handleAddOrEdit(mdl = null) {
      this.mdl = mdl
      if (mdl) {
        this.mdl.role = this.mdl.roles.length > 0 ? this.mdl.roles[0].id : ''
      }
      this.visible = true
    },
    // 添加或删除点击取消
    handleCancel() {
      this.visible = false
      this.mdl = null
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    // 添加或编辑点击确认
    handleOk() {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          values.roles = []
          if (values.role) {
            values.roles = [
              {
                id: values.role,
              },
            ]
          }
          const type = values.id ? 2 : 1
          if (type === 1) {
            values.password = md5(values.password || values.username)
          } else {
            // 编辑用户 把编辑的部分更新到原有的数据上一起提交
            const avatar = 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png'
            const param = this.mdl
            param.avatar = values.avatar || avatar
            param.id = values.id
            param.username = values.username
            param.name = values.name
            param.password = values.password !== param.password ? md5(values.password) : param.password
            param.roles = values.roles
            param.email = values.email
            param.telephone = values.telephone
            param.status = values.status
            values = param
          }
          this.handleItemOper(type, values)
        } else {
          this.confirmLoading = false
        }
      })
    },
    // type 0 删除  1添加 2 编辑
    handleItemOper(type, param) {
      const funArr = [
        {
          title: '删除',
          fun: deleteUser,
        },
        {
          title: '新增',
          fun: addUser,
        },
        {
          title: '修改',
          fun: updateUser,
        },
      ]
      funArr[type]
        .fun(param)
        .then((res) => {
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
        })
        .catch((err) => {
          console.log(err)
          this.confirmLoading = false
          this.$message.info(`${funArr[type].title}失败`)
        })
    },
    // 选中数据
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 显示隐藏其他搜索项
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    handleSearch() {
      // 时间需要格式化再传 不然是moment对象
      if (this.queryParam.time) {
        this.queryParam.time = this.queryParam.time.format('YYYY-MM-DD')
      }
      this.$refs.table.refresh()
    },
    // 重置搜索表单
    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date()),
      }
    },
  },
}
</script>
<style>
.color-red {
  color: #f04864;
}
</style>
