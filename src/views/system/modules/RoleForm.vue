<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="$emit('ok')"
    @cancel="$emit('cancel')"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改其他是新增，新增不显示主键ID -->
        <a-form-item v-show="false" label="主键ID" disabled>
          <a-input v-decorator="['id', { initialValue: 0 }]" />
        </a-form-item>
        <a-form-item label="角色名称">
          <a-input v-decorator="['name', {rules: [{required: true, min: 1, message: '请输入角色名称'}]}]" />
        </a-form-item>
        <a-form-item label="角色说明">
          <a-input v-decorator="['describe', {rules: [{required: true, min: 1, message: '请输入角色说明'}]}]" />
        </a-form-item>
        <!-- <a-form-item label="是否默认">
          <a-switch v-decorator="['status', { valuePropName: 'checked', initialValue: 0, getValueProps: value => ({ checked: value === 1 }), getValueFromEvent: value => { return value ? 1 : 0 }}]" />
        </a-form-item> -->
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
// const fields = ['id', 'name', 'describe', 'status']
const fields = ['id', 'name', 'describe']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this)
    }
  },
  computed: {
    title () {
      return this.model && this.model.id > 0 ? '编辑角色' : '新建角色'
    }
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))
    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      console.log('新增/编辑角色', this.model)
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
