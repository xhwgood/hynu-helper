// @ts-check
const c = require('./crypto-card')
const cheerio = require('cheerio')
const axios = require('axios').default
const qs = require('qs')

const Time = c.getTime()

/**
 * 获取校园卡信息
 * @param {{
 *  AccNum: string
 * }} data 
 * @param {string} url 
 */
exports.queryAccInfo = async (data, url) => {
  const { AccNum } = data
  const Sign = c.cryptSign([AccNum, Time])

  return axios
    .post(
      `${url}/queryAccInfo.aspx`,
      qs.stringify({
        Time,
        Sign,
        AccNum
      })
    )
    .then(result => {
      const $ = cheerio.load(result.data)
      // @ts-ignore
      if ($('code').text() == 1) {
        return {
          code: 200,
          BankName: $('BankName').text(),
          BankCard: $('BankCard').text().slice(15)
        }
      } else {
        return {
          code: 700,
          msg: '绑定出现异常！请在`我的`页面进行反馈'
        }
      }
    })
    .catch(err => {
      console.log('网络错误', err)
      return 400
    })
}
