// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "title": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "题目名称",
    "label": "题目名称"
  },
  "a": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "A",
    "label": "A"
  },
  "b": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "B",
    "label": "B"
  },
  "c": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "C",
    "label": "C"
  },
  "d": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "D",
    "label": "D"
  },
  "answer": {
    "rules": [
      {
        "required": true,
        "errorMessage": "请给题目设置正确答案"
      },
      {
        "format": "int"
      },
      {
        "range": [
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
      }
    ],
    "title": "答案",
    "label": "答案"
  },
  "parse": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "解析",
    "label": "解析"
  },
  "course_id": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "课程ID",
    "label": "课程ID"
  }
}

const enumConverter = {
  "answer_valuetotext": {
    "1": "答案A",
    "2": "答案B",
    "3": "答案C",
    "4": "答案D"
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
