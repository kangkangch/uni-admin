<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="user_name" label="用户名">
        <uni-easyinput placeholder="用户名" v-model="formData.user_name"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="password" label="密码" required>
        <uni-easyinput placeholder="用户密码" v-model="formData.password"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="phone" label="电话" required>
        <uni-easyinput placeholder="用户电话号码" v-model="formData.phone"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="register_time" label="注册时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.register_time"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="area" label="所在地区">
        <uni-easyinput placeholder="" v-model="formData.area"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="role_id" label="角色id" required>
        <uni-data-checkbox v-model="formData.role_id" :localdata="formOptions.role_id_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="email" label="邮箱">
        <uni-easyinput placeholder="用户邮箱" v-model="formData.email"></uni-easyinput>
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" style="width: 100px;" @click="submit">提交</button>
        <navigator open-type="navigateBack" style="margin-left: 15px;">
          <button class="uni-button" style="width: 100px;">返回</button>
        </navigator>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '@/js_sdk/validator/user.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'user';

  function getValidator(fields) {
    let result = {}
    for (let key in validator) {
      if (fields.includes(key)) {
        result[key] = validator[key]
      }
    }
    return result
  }

  

  export default {
    data() {
      let formData = {
        "user_name": "",
        "password": "",
        "phone": "",
        "register_time": null,
        "area": "",
        "role_id": 1,
        "email": ""
      }
      return {
        formData,
        formOptions: {
          "role_id_localdata": [
            {
              "text": "学员",
              "value": 1
            },
            {
              "text": "会员",
              "value": 2
            }
          ]
        },
        rules: {
          ...getValidator(Object.keys(formData))
        }
      }
    },
    onLoad(e) {
      if (e.id) {
        const id = e.id
        this.formDataId = id
        this.getDetail(id)
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      
      /**
       * 验证表单并提交
       */
      submit() {
        uni.showLoading({
          mask: true
        })
        this.$refs.form.validate().then((res) => {
          return this.submitForm(res)
        }).catch(() => {
        }).finally(() => {
          uni.hideLoading()
        })
      },

      /**
       * 提交表单
       */
      submitForm(value) {
        // 使用 clientDB 提交数据
        return db.collection(dbCollectionName).doc(this.formDataId).update(value).then((res) => {
          uni.showToast({
            title: '修改成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      },

      /**
       * 获取表单数据
       * @param {Object} id
       */
      getDetail(id) {
        uni.showLoading({
          mask: true
        })
        db.collection(dbCollectionName).doc(id).field("user_name,password,phone,register_time,area,role_id,email").get().then((res) => {
          const data = res.result.data[0]
          if (data) {
            this.formData = data
            
          }
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        }).finally(() => {
          uni.hideLoading()
        })
      }
    }
  }
</script>
