// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "user_name": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "用户名",
    "label": "用户名"
  },
  "password": {
    "rules": [
      {
        "required": true,
        "errorMessage": "{title}不能为空"
      },
      {
        "format": "string",
        "errorMessage": "{title}不能为空"
      }
    ],
    "title": "密码",
    "label": "密码"
  },
  "phone": {
    "rules": [
      {
        "required": true,
        "errorMessage": "{title}不能为空"
      },
      {
        "format": "string",
        "errorMessage": "{title}不能为空"
      }
    ],
    "title": "电话",
    "label": "电话"
  },
  "register_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "注册时间",
    "defaultValue": {
      "$env": "now"
    },
    "label": "注册时间"
  },
  "area": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "所在地区",
    "label": "所在地区"
  },
  "role_id": {
    "rules": [
      {
        "required": true,
        "errorMessage": "{title}不能为空"
      },
      {
        "format": "int",
        "errorMessage": "{title}不能为空"
      },
      {
        "range": [
          {
            "text": "学员",
            "value": 1
          },
          {
            "text": "会员",
            "value": 2
          }
        ],
        "errorMessage": "{title}不能为空"
      }
    ],
    "title": "角色id",
    "defaultValue": 1,
    "label": "角色id"
  },
  "email": {
    "rules": [
      {
        "format": "string"
      },
      {
        "format": "email",
        "errorMessage": "{title}格式无效"
      }
    ],
    "title": "邮箱",
    "label": "邮箱"
  }
}

const enumConverter = {
  "role_id_valuetotext": {
    "1": "学员",
    "2": "会员"
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
