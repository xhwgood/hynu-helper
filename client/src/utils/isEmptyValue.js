/**
 * 判断值是否为空
 * @param {*} value 要判断的值
 * @param {boolean} ignoreUndefined 是否忽略 `undefined`
 */
function isEmptyReqValue(value, ignoreUndefined = false) {
  let isEmpty = false
  const type = Object.prototype.toString.call(value).slice(8, -1)

  switch (type) {
    case 'String':
      // 过滤全空字符串
      /^\s*$/.test(value) && (isEmpty = true)
      break
    case 'Null':
      isEmpty = true
      break
    case 'Undefined':
      return !ignoreUndefined
  }

  return isEmpty
}

export default isEmptyReqValue
