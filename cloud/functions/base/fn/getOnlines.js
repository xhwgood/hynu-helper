// @ts-check
const rp = require('request-promise')
/**
 * @param {*} data 
 * @param {string} url 
 */
exports.getOnlines = async (data, url) => {
  return rp(url)
    .then(body => {
      let code = 200
      const index = body
      const from = index.indexOf('用户数：')
      const end = index.indexOf('人', from)
      const number = index.slice(from + 6, end).toString().trim()

      return {
        code,
        number
      }
    })
    .catch(err => {
      console.log('网络错误', err)
      return {
        code: 400,
        msg: '抱歉，出现异常'
      }
    })
}
