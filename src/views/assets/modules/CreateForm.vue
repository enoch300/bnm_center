<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <div class="table-page-search-wrapper">
        <a-form :form="form" layout="inline">
          <a-form-item v-show="false" label="id" >
            <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
          </a-form-item>
          <a-row :gutter="40">
            <a-col :span="12" v-show="model && model.id">
              <a-form-item label="节点名">
                <a-input v-decorator="['hostname']" disabled />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="节点ID">
                <a-input v-decorator="['machineId', {rules: [{required: true}]}]" :disabled="model && model.id != ''"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="是否IDC" class="creat-form-item">
                <a-select v-decorator="['idc', {rules: [{required: true}]}]">
                  <a-select-option v-for="(item, index) in idcMap" :key="index" :value="index">
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="业务部署">
                <a-select mode="multiple" v-decorator="['businessName', {rules: [{required: true}]}]">
                  <a-select-option v-for="(item, index) in businessesMap" :key="index" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="部署方式">
                <a-select v-decorator="['deploymentType', {rules: [{required: true}]}]">
                  <a-select-option v-for="(item, index) in deploymentTypeMap" :key="index" :value="index">
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="网络类型">
                <a-select v-decorator="['networkType', {rules: [{required: true}]}]">
                  <a-select-option v-for="(item, index) in networkTypeMap" :key="index" :value="index">
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="上报带宽">
                <a-input type="number" suffix="G" v-decorator="['reportBandwidth', {rules: [{required: true}]}]" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="计费规则">
                <a-select v-decorator="['billingRules', {rules: [{required: true}]}]">
                  <a-select-option v-for="(item, index) in feeRulesMap" :key="index" :value="index">
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="价格模式">
                <a-select v-decorator="['billingModel', {rules: [{required: true}]}]">
                  <a-select-option v-for="(item, index) in feeModelMap" :key="index" :value="index">
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="结算周期">
                <a-select v-decorator="['billingCycle', {rules: [{required: true}]}]">
                  <a-select-option v-for="(item, index) in billingCycleMap" :key="index" :value="index">
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="供应商">
                <a-input v-decorator="['supplier', {rules: [{required: true}]}]" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="对接人">
                <a-input v-decorator="['owner', {rules: [{required: true}]}]" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="客户ID">
                <a-input type="number" v-decorator="['customerId', { rules: [{required: true}]}]" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="备注">
                <a-textarea v-decorator="['comment']" :auto-size="{ minRows: 2, maxRows: 5 }"/>
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
  import { idcMap, deploymentTypeMap, networkTypeMap, feeStateMap,
    feeRulesMap, feeModelMap, billingCycleMap, businessesMap } from './hostColumns'
  // 表单数据项
  const fields = ['id', 'hostname', 'machineId', 'idc', 'businessName', 'deploymentType',
  'networkType', 'reportBandwidth', 'billingRules', 'billingModel', 'billingCycle', 'supplier',
  'owner', 'customerId', 'comment']

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
      },
      hostname: {
        type: String,
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
        idcMap,
        deploymentTypeMap,
        networkTypeMap,
        feeStateMap,
        feeRulesMap,
        feeModelMap,
        billingCycleMap,
        businessesMap,
        form: this.$form.createForm(this)
      }
    },
    computed: {
      title () {
        return this.model && this.model.id ? '配置主机' : '新建主机'
      }
    },
    created () {
      // 防止表单未注册
      fields.forEach(v => this.form.getFieldDecorator(v))
      // 当 model 发生改变时，为表单设置值
      this.$watch('model', () => {
        console.log('新增/编辑主机', this.model)
        if (this.model) {
          this.model.billingRules = this.model.billing.rule
          this.model.billingModel = this.model.billing.model
          this.model.billingCycle = this.model.billing.cycle
          const businessName = []
          this.model.businesses.forEach((item, index) => {
            businessName.push(item.id)
          })
          this.model.businessName = businessName
          this.form.setFieldsValue(pick(this.model, fields))
        }
      })
    }
  }
</script>
