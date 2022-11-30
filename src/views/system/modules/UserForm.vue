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
      <div v-if="model && model.id && model.avatar != ''" class="avatarBox">
        <!-- <a-upload
          modfileListel="avatar"
          list-type="picture"
          :max-count="1"
          name="logo"
          action="/upload.do"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          @change="handleChange"
        > -->
        <a-avatar :size="120" :src="model.avatar" />
        <!-- </a-upload>
        <div class="avatarEditBox">
          <div class="avatarEdit">编辑</div>
        </div> -->
      </div>
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="false" label="用户ID">
          <a-input v-decorator="['id']" disabled />
        </a-form-item>
        <a-form-item v-show="false" label="头像">
          <a-input v-decorator="['avatar']" disabled/>
        </a-form-item>
        <a-form-item label="用户名">
          <a-input v-decorator="['name', {rules: [{required: true, min: 1}]}]" />
        </a-form-item>
        <a-form-item label="登录账号">
          <a-input v-decorator="['username', {rules: [{required: true, min: 1}]}]" />
        </a-form-item>
        <a-form-item label="登录密码">
          <a-input v-if="model && model.id && !reset" type="password" v-decorator="['password']" disabled/>
          <a-input-password v-else v-decorator="['password']"/>
          <div v-if="!reset && model" class="reset-bar">
            <div class="reset-text" @click="resetPwd">重置密码</div>
          </div>
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-decorator="['email', {rules: [{ type: 'email', message: '请输入有效的邮箱!'}] }]"/>
        </a-form-item>
        <a-form-item label="电话">
          <a-input v-decorator="['telephone']"/>
        </a-form-item>
        <a-form-item label="角色">
          <a-select v-decorator="['role']">
            <a-select-option v-for="(item, index) in roleList" :key="index" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-decorator="['status', { initialValue: 1 }]">
            <a-select-option v-for="(item, index) in statusList" :key="index" :value="index">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['avatar', 'id', 'username', 'name', 'password', 'role', 'email', 'telephone', 'status']

function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

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
    roleList: {
      type: Array,
      default: () => []
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
      reset: false,
      statusList: ['禁用', '启用'],
      form: this.$form.createForm(this)
    }
  },
  computed: {
    title () {
      return this.model && this.model.id ? '编辑用户' : '新建用户'
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.reset = false
      }
    }
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      console.log('新增/编辑用户', this.model)
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  },
  methods: {
    resetPwd () {
      this.reset = true
      this.form.setFieldsValue(this.form.setFieldsValue({ password: '' }))
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('只能上传jpg,jpeg,png的图片')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片不能大于10M')
      }
      return isJpgOrPng && isLt2M
    },
    handleChange (info) {
      console.log(info.fileList)
      if (info.file.status === 'uploading') {
        return
      }
      // if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (base64Url) => {
          this.model.avatar = base64Url
          this.form.setFieldsValue({ avatar: base64Url })
        })
      // }
      // if (info.file.status === 'error') {
      //   this.$message.error('upload error')
      // }
    }
  }
}
</script>
<style>
  .avatarBox{
    position: relative;
    display: flex;
    justify-content: center;
    padding-bottom: 20px;
  }
  .avatarEditBox{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: end;
  }
  .avatarEdit{
    color: white;
    text-align: center;
    line-height: 30px;
    font-size: 16px;
    background-color: rgba(0, 0, 0, 0.6);
  }
  .reset-bar{
    display: flex;
    flex-direction: row;
    justify-content: end;
  }
  .reset-bar .reset-text{
    color: #1890ff;
    line-height: 20px;
    padding-left: 10px;
  }
</style>
