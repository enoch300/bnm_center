<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="loading"
    @ok="
      () => {
        $emit('ok')
      }
    "
    @cancel="
      () => {
        $emit('cancel')
      }
    "
  >
    <a-spin :spinning="loading">
      <div class="table-page-search-wrapper">
        <a-form :form="form" layout="inline" :labelCol="{ style: 'width: 100px' }">
          <a-form-item v-show="false" label="id">
            <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
          </a-form-item>
          <a-row :gutter="40">
            <a-col :span="12">
              <a-form-item label="设备SN">
                <a-input v-decorator="['sn', { rules: [{ required: true }] }]" :disabled="model && model.id != ''" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="状态" class="creat-form-item">
                <a-select v-decorator="['online', { rules: [{ required: true }] }]">
                  <a-select-option v-for="(item, key) in statusList" :key="key" :value="key * 1">
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="IP协议栈" class="creat-form-item">
                <a-select v-decorator="['ip_stack', { rules: [{ required: true }] }]">
                  <a-select-option v-for="(item, key) in ipStackMap" :key="key" :value="key * 1">
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="网络类型" class="creat-form-item">
                <a-select v-decorator="['net_type', { rules: [{ required: true }] }]">
                  <a-select-option v-for="(item, key) in networkTypeMap" :key="key" :value="key * 1">
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import {
  statusList,
  ipStackMap,
  idcMap,
  deploymentTypeMap,
  networkTypeMap,
  feeStateMap,
  feeRulesMap,
  feeModelMap,
  billingCycleMap,
  businessesMap,
} from './hostColumns'
// 表单数据项
const fields = ['id', 'sn', 'online', 'ip_stack', 'net_type']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
    model: {
      type: Object,
      default: () => null,
    },
    hostname: {
      type: String,
      default: () => null,
    },
  },
  data() {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
    }
    return {
      statusList,
      ipStackMap,
      idcMap,
      deploymentTypeMap,
      networkTypeMap,
      feeStateMap,
      feeRulesMap,
      feeModelMap,
      billingCycleMap,
      businessesMap,
      form: this.$form.createForm(this),
    }
  },
  computed: {
    title() {
      return this.model && this.model.id ? '更新设备' : '新增设备'
    },
  },
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v))
    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      console.log('新增/编辑主机', this.model)

      if (this.model) {
        this.model.sn = this.model.sn
        this.model.online = this.model.online
        this.model.ip_stack = this.model.ip_stack
        this.model.net_type = this.model.net_type
        this.form.setFieldsValue(pick(this.model, fields))
      }
    })
  },
}
</script>
