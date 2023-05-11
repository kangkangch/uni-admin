<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="user_id" label="用户ID" required>
        <uni-easyinput placeholder="用户的ID" v-model="formData.user_id"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="phone" label="电话号码">
        <uni-easyinput placeholder="用户的电话号码" v-model="formData.phone"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="price" label="订单价格">
        <uni-easyinput placeholder="订单价格" type="number" v-model="formData.price"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="status" label="订单状态">
        <switch @change="binddata('status', $event.detail.value)" :checked="formData.status"></switch>
      </uni-forms-item>
      <uni-forms-item name="trade_no" label="交易号">
        <uni-easyinput placeholder="交易号" v-model="formData.trade_no"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="pay_time" label="付款时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.pay_time"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="create_time" label="订单创建时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.create_time"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="last_time" label="最后修改时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.last_time"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="goods_id" label="商品ID">
        <uni-easyinput placeholder="商品ID" v-model="formData.goods_id"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="goods_type" label="商品类型">
        <uni-data-checkbox v-model="formData.goods_type" :localdata="formOptions.goods_type_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="order_no" label="订单号">
        <uni-easyinput placeholder="订单号" v-model="formData.order_no"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="to_ids" label="收货人">
        <uni-data-checkbox :multiple="true" v-model="formData.to_ids"></uni-data-checkbox>
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
  import { validator } from '@/js_sdk/validator/order.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'order';

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
        "phone": "",
        "price": null,
        "status": false,
        "trade_no": "",
        "pay_time": "",
        "create_time": null,
        "last_time": null,
        "goods_id": "",
        "goods_type": null,
        "order_no": "",
        "to_ids": []
      }
      return {
        formData,
        formOptions: {
          "goods_type_localdata": [
            {
              "text": "买课程",
              "value": 1
            },
            {
              "text": "买会员",
              "value": 2
            },
            {
              "text": "续费会员",
              "value": 3
            },
            {
              "text": "参加活动",
              "value": 4
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
        db.collection(dbCollectionName).doc(id).field("user_id,phone,price,status,trade_no,pay_time,create_time,last_time,goods_id,goods_type,order_no,to_ids").get().then((res) => {
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
