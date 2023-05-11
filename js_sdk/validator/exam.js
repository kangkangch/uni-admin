// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "course_id": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "课程id",
    "label": "课程id"
  },
  "name": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "考试名称",
    "label": "考试名称"
  },
  "number": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "题量",
    "defaultValue": 10,
    "label": "题量"
  },
  "score": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "总分",
    "defaultValue": 100,
    "label": "总分"
  },
  "pass": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "及格分",
    "defaultValue": 60,
    "label": "及格分"
  },
  "term": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "考试时长",
    "defaultValue": 20,
    "label": "考试时长"
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
