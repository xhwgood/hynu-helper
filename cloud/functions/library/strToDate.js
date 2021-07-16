// @ts-check
/**
 * 将日期转为格式化后的日期（2019-09-09转为2019年9月9日）
 * @param {string} str 日期字符串
 */
const strToDate = str => {
  const arr = str.split('-')
  return `${arr[0]}年${Number(arr[1])}月${Number(arr[2])}日`
}

module.exports = strToDate
