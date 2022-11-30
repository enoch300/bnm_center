<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAddOrEdit()">添加角色</a-button>
      <!-- 选中用户后显式批量操作 -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-button style="margin-left: 8px" @click="handleDelete()"> 批量删除 </a-button>
      </a-dropdown>
    </div>
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowSelection="rowSelection"
      :showPagination="false"
      bordered
    >
      <!-- 通过插槽修改每列的样式 -->
      <span slot="roleName" slot-scope="text, record">
        <template>
          <a-space>
            <a-avatar v-if="record.avatar" size="small" :src="record.avatar" />
            <span>{{ text }}</span>
          </a-space>
        </template>
      </span>
      <span slot="isDefault" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleToggleMenu(record)">菜单权限</a>
          <a-divider type="vertical" />
          <a @click="handleAddOrEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDelete(record)" class="color-red">删除</a>
        </template>
      </span>
    </s-table>

    <role-form
      ref="createModal"
      :visible="visible"
      :loading="confirmLoading"
      :model="mdl"
      @cancel="handleCancel"
      @ok="handleOk"
    />
    <!-- 菜单权限 -->
    <RolePermissionDrawer
      :roleVisible="roleVisible"
      :model="roleInfo"
      :menuListTree="menuListTree"
      :childList="childList"
      @drawClose="handleToggleMenu"
      @refreshTable="refreshTable"
    >
    </RolePermissionDrawer>
  </a-card>
</template>
<script>
  import { STable, Ellipsis } from '@/components'
  import { RoleForm, RolePermissionDrawer } from './modules'
  import { getRoleList, addRole, updateRole, deleteRole, getMenuList } from '@/api/system'
  import { roleColumns } from './modules/columnsData'
  import { listToTree } from '@/router/generator-routers'

  let newTableData = []
  let sum = 0
  let nextIndex = 0

  export default {
    name: 'RoleManage',
    components: {
      STable,
      Ellipsis,
      RoleForm,
      RolePermissionDrawer
    },
    data () {
      this.columns = roleColumns
      return {
        // 新建/编辑
        visible: false,
        confirmLoading: false,
        mdl: null,
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter)
          return getRoleList(requestParameters)
            .then(res => {
              res.pageNo = 1
              res.totalCount = 50
              return res
            })
        },
        selectedRowKeys: [],
        selectedRows: [],
        // 菜单权限
        roleVisible: false,
        roleInfo: null,
        // 菜单列表
        menuListTree: [],
        childList: []
      }
    },
    created () {
      getMenuList().then(res => {
        if (res.code === 0) {
          const tree = []
          listToTree(res.data, tree, 0)
          this.childList = []
          this.getChildMap(tree, this.childList)
          newTableData = []
          sum = 0
          nextIndex = 0
          this.dataFilter(tree)
          newTableData[newTableData.length - sum].rowSpan = sum
          this.menuListTree = newTableData
        }
      })
    },
    filters: {
      statusFilter (type) {
        return type ? '是' : '否'
      },
      statusTypeFilter (type) {
        return type ? 'success' : 'error'
      }
    },
    computed: {
      rowSelection () {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      }
    },
    methods: {
      refreshTable () {
        this.$refs.table.refresh()
      },
      // 获取所有带子菜单的映射关系
      getChildMap (list, arr) {
        list.forEach(item => {
          if (item.children && item.children.length > 0) {
              const childitem = {
                id: item.id,
                childId: []
              }
              item.children.forEach(child => {
                childitem.childId.push(child.id)
              })
              this.getChildMap(item.children, arr)
              arr.push(childitem)
          }
        })
      },
      // 格式化后台返回的菜单列表适配表格
      dataFilter (arr = [], module = '', parentId = '', page = '', count = 0) {
        arr.forEach((item, index) => {
          if (count === 0) {
              module = this.$t(item.title)
              if (index !== 0) {
                newTableData[nextIndex].rowSpan = sum
                nextIndex += sum
              }
              sum = 0
          }
          const name = this.$t(item.title)
          if (item.children && item.children.length > 0) {
              this.dataFilter(item.children, module, item.parentId === 0 ? '' : parentId + item.parentId + '-', count === 0 ? '' : page + name + '-', count + 1)
          } else {
              sum += 1
              newTableData.push({
                  module: module,
                  name: item.name,
                  page: page + name,
                  actions: item.actions || [],
                  id: item.id,
                  parentId: item.parentId === 0 ? 0 : parentId + item.parentId,
                  checked: false,
                  rowSpan: 0
              })
          }
        })
      },
      // 添加或编辑角色
      handleAddOrEdit (mdl = null) {
        this.mdl = mdl
        this.visible = true
      },
      // 添加或编辑点击确定
      handleOk () {
        const form = this.$refs.createModal.form
        this.confirmLoading = true
        form.validateFields((errors, values) => {
          if (!errors) {
            const type = values.id ? 2 : 1
            this.handleItemOper(type, values)
          } else {
            this.confirmLoading = false
          }
        })
      },
      // 删除提示
      handleDelete (record) {
        const param = {
          id: record ? [record.id] : this.selectedRowKeys
        }
        const name = record ? `”${record.name}“` : '选中的'
        this.$confirm({
          title: '删除提示',
          content: `确定删除${name}角色吗？`,
          onOk: () => {
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
            fun: deleteRole
          },
          {
            title: '新增',
            fun: addRole
          },
          {
            title: '修改',
            fun: updateRole
          }
        ]
        if (type === 2) {
          const { name, describe } = { ...param }
          param = this.mdl
          param.name = name
          param.describe = describe
        }
        funArr[type].fun(param).then(res => {
          if (res.code === 0) {
            if (type === 0) {
              this.$refs.table.clearSelected()
            } else {
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
            this.$message.error(res.msg)
          }
        }).catch(err => {
          console.log(err)
          this.confirmLoading = false
          this.$message.info(`${funArr[type].title}失败`)
        })
      },
      // 添加或编辑点击取消
      handleCancel () {
        this.visible = false
        const form = this.$refs.createModal.form
        form.resetFields() // 清理表单数据（可不做）
      },
      // 选中数据
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      // 显示菜单权限
      handleToggleMenu (record = null) {
        this.roleInfo = record || null
        this.roleVisible = !!record
      }
    }
  }
</script>
<style>
  .color-red{
    color: #F04864;
  }
</style>
