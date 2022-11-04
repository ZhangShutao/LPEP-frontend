const Mock = require('mockjs')
const data = Mock.mock({
  'questionList|1-10': [{
    'content|1': '选择题题干xxxxx',
    'id|+1': 1,
    'option|1': '{ "A":"选项A", "B":"选项B", "C":"选项C", "D":"选项D" }',
    'answer|1': /[A-D]/,
    'type|1-2': 1
  }]
})

// 转换 JSON 格式
// const dataJson = JSON.stringify(data, null, 4)
// console.log(dataJson)
// console.log(data)
export default data
