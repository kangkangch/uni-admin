<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="course_id" label="课程id">
        <uni-easyinput placeholder="对应的课程id" v-model="formData.course_id"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="name" label="考试名称">
        <uni-easyinput placeholder="考试名称" v-model="formData.name"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="number" label="题量">
        <uni-easyinput placeholder="考试题量" type="number" v-model="formData.number"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="score" label="总分">
        <uni-easyinput placeholder="考试总分" type="number" v-model="formData.score"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="pass" label="及格分">
        <uni-easyinput placeholder="考试及格分" type="number" v-model="formData.pass"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="term" label="考试时长">
        <uni-easyinput placeholder="考试时间限制" type="number" v-model="formData.term"></uni-easyinput>
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
  import { validator } from '@/js_sdk/validator/exam.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'exam';

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
        "course_id": "",
        "name": "",
        "number": 10,
        "score": 100,
        "pass": 60,
        "term": 20
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
        db.collection(dbCollectionName).doc(id).field("course_id,name,number,score,pass,term").get().then((res) => {
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
