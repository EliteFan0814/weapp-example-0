// 判断数据类型
const checkType = function (yourData, dataType) {
  const type = Object.prototype.toString.call(yourData).slice(8, -1)
  return type === dataType
}

export default { checkType }
