// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "name": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "课程名称",
    "label": "课程名称"
  },
  "intro": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "课程描述",
    "label": "课程描述"
  },
  "cover_path": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "封面路径",
    "label": "封面路径"
  },
  "price": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "课程价格",
    "label": "课程价格"
  },
  "vip_price": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "vip价格",
    "label": "vip价格"
  },
  "exam_id": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "考试id",
    "defaultValue": "none",
    "label": "考试id"
  },
  "begin_time": {
    "rules": [
      {
        "required": true,
        "errorMessage": "开始时间不能为空"
      },
      {
        "format": "string",
        "errorMessage": "开始时间格式错误"
      }
    ],
    "title": "开始时间",
    "defaultValue": {
      "$env": "now"
    },
    "label": "开始时间"
  },
  "end_time": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "结束时间",
    "defaultValue": {
      "$env": "now"
    },
    "label": "结束时间"
  }
}

const enumConverter = {}

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
