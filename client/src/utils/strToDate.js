/**
 * 将 `2020-12-31` 转为 `2020年12月31日`
 * @param {string} str 字符串化的日期
 */
const strToDate = str => {
  if (str) {
    const arr = str.split('-')
    return `${arr[0]}年${Number(arr[1])}月${Number(arr[2])}日`
  }
}

export default strToDate
