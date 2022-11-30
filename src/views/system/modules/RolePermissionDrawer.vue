<template>
  <a-drawer
    placement="right"
    :maskClosable="false"
    :visible="roleVisible"
    @close="$emit('drawClose')"
    width="60%"
    :title="(model ? model.name : '') + '-菜单权限设置'"
  >
    <a-table
      :style="{ marginBottom: '50px' }"
      :columns="columns"
      :data-source="menuListTree"
      rowKey="id"
      :pagination="false"
      bordered
    >
      <!-- 页面 -->
      <span slot="page" slot-scope="text, record">
        <template>
          <a-checkbox
            :checked="checkMenuCheck(record.id)"
            @change="onMenuCheck(record,$event)"
          >
            {{ text }}
          </a-checkbox>
        </template>
      </span>
      <!-- 功能 -->
      <span slot="actions" slot-scope="text, record">
        <template>
          <a-row>
            <a-col :span="8" v-for="(item, index) in text" :key="index">
              <a-checkbox
                :checked="checkActionCheck(record.name, item.id)"
                @change="onActionCheck(record.name, item.id, $event)"
                :disabled="!checkMenuCheck(record.id)"
              >
                {{ item.describe }}
              </a-checkbox>
            </a-col>
          </a-row>
        </template>
      </span>
    </a-table>
    <!-- 底部按钮组 -->
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-button :style="{ marginRight: '8px' }" @click="$emit('drawClose')">
        取消
      </a-button>
      <a-button type="primary" @click="onhandleSubmit" :loading="loading">
        确定
      </a-button>
    </div>
  </a-drawer>
</template>
<script>
  import { roleDrawColumns } from './columnsData'
  import { updateRole } from '@/api/system'

  export default {
    props: {
        roleVisible: {
            type: Boolean,
            required: true
        },
        model: {
          type: Object,
          default: () => null
        },
        // 总菜单树
        menuListTree: {
          type: Array,
          default: () => []
        },
        // 父子菜单映射表
        childList: {
          type: Array,
          default: () => []
        }
    },
    data () {
      this.columns = roleDrawColumns
      return {
        loading: false,
        selectMenuId: [], // 选中的菜单id
        selectAction: [] // 选中的action
      }
    },
    created () {
      // 当 model 发生改变时，为表单设置值
      this.$watch('model', () => {
        this.handleInitData()
      })
    },
    methods: {
      handleInitData () {
        this.selectMenuId = []
        this.selectAction = []
        if (this.model) {
          if (this.model.permissions.length === 0) {
            this.model.permissions = [
              {
                menus: []
              }
            ]
          }
          // 遍历角色的菜单
          if (this.model.permissions[0].menus.length > 0) {
            this.model.permissions[0].menus.forEach(item => {
              this.selectMenuId.push(item.id)
            })
          }
          // 遍历出角色的actions
          // if (this.model.permissions.length > 0) {
          //   this.model.permissions.forEach(item => {
          //     if (item.actions && item.actions.length > 0) {
          //       const actionIds = []
          //       item.actions.forEach(action => {
          //         actionIds.push(action.id)
          //       })
          //       this.selectAction.push({
          //         name: item.permissionId,
          //         actions: actionIds
          //       })
          //     }
          //   })
          // }
        }
      },
      // 判断菜单是否选中
      checkMenuCheck (id) {
        return this.selectMenuId.indexOf(id) !== -1
      },
      // 点击选择菜单
      onMenuCheck (record, event) {
        const checked = event.target.checked
        const parent = record.parentId !== 0 ? record.parentId.split('-') : []
        if (checked) {
          parent.forEach(item => {
            item = parseInt(item)
            if (this.selectMenuId.indexOf(item) === -1) {
              this.selectMenuId.push(item)
            }
          })
          this.selectMenuId.push(record.id)
        } else {
          this.removeMenuId(record.id)
          this.removeActions(record.name)
          parent.reverse()
          for (let index = 0; index < parent.length; index++) {
            const element = parent[index]
            if (this.queryChildCheck(element)) {
              break
            } else {
              // 子元素都没有选中的 则移除自己
              this.removeMenuId(element)
            }
          }
        }
      },
      // 根据id查询子菜单是否有选中的
      queryChildCheck (id) {
        id = parseInt(id)
        let child = []
        for (let index = 0; index < this.childList.length; index++) {
          if (this.childList[index].id === id) {
              child = this.childList[index].childId
              break
          }
        }
        // 拿到父元素的所有子元素 并判断是否有选中的
        let hasChild = false
        child.forEach(item => {
          if (this.selectMenuId.indexOf(item) !== -1) {
            hasChild = true
          }
        })
        return hasChild
      },
      // 移除选中的ID
      removeMenuId (id) {
        id = parseInt(id)
        const index = this.selectMenuId.indexOf(id)
        if (index !== -1) {
          this.selectMenuId.splice(index, 1)
        }
      },
      // 检查action是否选中
      checkActionCheck (name, id) {
        let ischeck = false
        for (let index = 0; index < this.selectAction.length; index++) {
          const element = this.selectAction[index]
          if (element.name === name) {
              ischeck = element.actions.indexOf(id) !== -1
              break
          }
        }
        return ischeck
      },
      // action处理
      onActionCheck (name, id, event) {
        const checked = event.target.checked
        let selIndex = -1
        for (let index = 0; index < this.selectAction.length; index++) {
          const element = this.selectAction[index]
          if (element.name === name) {
              selIndex = index
              break
          }
        }
        if (checked) {
          if (selIndex === -1) {
            this.selectAction.push({
              name: name,
              actions: [id]
            })
          } else {
            this.selectAction[selIndex].actions.push(id)
          }
        } else {
          if (selIndex !== -1) {
            const actionInd = this.selectAction[selIndex].actions.indexOf(id)
            this.selectAction[selIndex].actions.splice(actionInd, 1)
          }
        }
      },
      // 根据菜单名移除该菜单的actions
      removeActions (name) {
        this.selectAction = this.selectAction.filter(item => {
          return item.name !== name
        })
      },
      // 修改菜单
      onhandleSubmit () {
        this.loading = true
        const param = this.model
        // 菜单id
        const ids = this.selectMenuId.map(item => {
          return { id: item }
        })
        param.permissions[0].menus = ids
        // // action id
        // const permissionsList = this.selectAction.map(item => {
        //   const actions = []
        //   item.actions.forEach(action => {
        //     actions.push({ id: action })
        //   })
        //   return {
        //     permissionId: item.name,
        //     permissionName: item.name,
        //     actions: actions
        //   }
        // })
        // param.permissions = permissionsList
        updateRole(param).then(res => {
          this.loading = false
          this.$message.info('修改成功')
          this.$emit('drawClose')
          this.$emit('refreshTable')
        }).catch(err => {
          this.loading = false
          console.log(err)
          this.$message.info('修改失败')
        })
      }
    }
  }
</script>
