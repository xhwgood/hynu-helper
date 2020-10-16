/**
 * 验证学号是否合法
 * @param {String} str
 */
const validXH = str => {
  return str.length == 8 || str.length == 9 || str.length == 12
}

export default validXH
