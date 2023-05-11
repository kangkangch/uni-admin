<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="user_id" label="用户id">
        <uni-easyinput placeholder="" v-model="formData.user_id"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="create_time" label="申请日期">
        <uni-easyinput placeholder="成为会员的日期" v-model="formData.create_time"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="update_time" label="续费日期">
        <uni-easyinput placeholder="续费会员的日期" v-model="formData.update_time"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="end_time" label="到期日期">
        <uni-easyinput placeholder="" v-model="formData.end_time"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="bind_num" label="挂靠人数">
        <uni-easyinput placeholder="" type="number" v-model="formData.bind_num"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="package_id" label="等级包id">
        <uni-easyinput placeholder="" v-model="formData.package_id"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="max_bind" label="最大挂靠数">
        <uni-easyinput placeholder="" type="number" v-model="formData.max_bind"></uni-easyinput>
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
  import { validator } from '@/js_sdk/validator/member.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'member';

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
        "user_id": "",
        "create_time": "",
        "update_time": "",
        "end_time": "",
        "bind_num": 0,
        "package_id": "",
        "max_bind": 5
      }
      return {
        formData,
        formOptions: {},
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
        db.collection(dbCollectionName).doc(id).field("user_id,create_time,update_time,end_time,bind_num,package_id,max_bind").get().then((res) => {
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
