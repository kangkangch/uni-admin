// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "user_id": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "title": "用户ID",
    "label": "用户ID"
  },
  "phone": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "电话号码",
    "label": "电话号码"
  },
  "price": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "订单价格",
    "label": "订单价格"
  },
  "status": {
    "rules": [
      {
        "format": "bool"
      }
    ],
    "title": "订单状态",
    "defaultValue": false,
    "label": "订单状态"
  },
  "trade_no": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "交易号",
    "defaultValue": "",
    "label": "交易号"
  },
  "pay_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "付款时间",
    "defaultValue": "",
    "label": "付款时间"
  },
  "create_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "订单创建时间",
    "defaultValue": {
      "$env": "now"
    },
    "label": "订单创建时间"
  },
  "last_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "最后修改时间",
    "defaultValue": {
      "$env": "now"
    },
    "label": "最后修改时间"
  },
  "goods_id": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "商品ID",
    "label": "商品ID"
  },
  "goods_type": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
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
      }
    ],
    "title": "商品类型",
    "label": "商品类型"
  },
  "order_no": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "订单号",
    "defaultValue": "",
    "label": "订单号"
  },
  "to_ids": {
    "rules": [
      {
        "format": "array"
      }
    ],
    "title": "收货人",
    "label": "收货人"
  }
}

const enumConverter = {
  "goods_type_valuetotext": {
    "1": "买课程",
    "2": "买会员",
    "3": "续费会员",
    "4": "参加活动"
  }
}

function filterToWhere(filter, command) {
  let where = {}
  for (let field in filter) {
    let { type, value } = filter[field]
    switch (type) {
      case "search":
        if (typeof value === 'string' && value.length) {
          where[field] = new RegExp(value)
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = []
          for (let s of value) {
            selectValue.push(command.eq(s))
          }
          where[field] = command.or(selectValue)
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0]
          let lt = value[1]
          where[field] = command.and([command.gte(gt), command.lte(lt)])
        }
        break;
      case "date":
        if (value.length) {
          let [s, e] = value
          let startDate = new Date(s)
          let endDate = new Date(e)
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
      case "timestamp":
        if (value.length) {
          let [startDate, endDate] = value
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
    }
  }
  return where
}

export { validator, enumConverter, filterToWhere }
