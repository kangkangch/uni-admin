<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="title" label="题目名称">
        <uni-easyinput placeholder="题目的名称" v-model="formData.title"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="a" label="A">
        <uni-easyinput placeholder="选项A" v-model="formData.a"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="b" label="B">
        <uni-easyinput placeholder="选项B" v-model="formData.b"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="c" label="C">
        <uni-easyinput placeholder="选项C" v-model="formData.c"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="d" label="D">
        <uni-easyinput placeholder="选项D" v-model="formData.d"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="answer" label="答案" required>
        <uni-data-checkbox v-model="formData.answer" :localdata="formOptions.answer_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="parse" label="解析">
        <uni-easyinput placeholder="解析" v-model="formData.parse"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="course_id" label="课程ID">
        <uni-easyinput placeholder="课程ID" v-model="formData.course_id"></uni-easyinput>
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
  import { validator } from '@/js_sdk/validator/question.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'question';

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
        "title": "",
        "a": "",
        "b": "",
        "c": "",
        "d": "",
        "answer": null,
        "parse": "",
        "course_id": ""
      }
      return {
        formData,
        formOptions: {
          "answer_localdata": [
            {
              "text": "答案A",
              "value": 1
            },
            {
              "text": "答案B",
              "value": 2
            },
            {
              "text": "答案C",
              "value": 3
            },
            {
              "text": "答案D",
              "value": 4
            }
          ]
        },
        rules: {
          ...getValidator(Object.keys(formData))
        }
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
        return db.collection(dbCollectionName).add(value).then((res) => {
          uni.showToast({
            title: '新增成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      }
    }
  }
</script>
