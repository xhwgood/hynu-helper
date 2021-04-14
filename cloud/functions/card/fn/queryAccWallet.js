// @ts-check
const c = require('./crypto-card')
const cheerio = require('cheerio')
const axios = require('axios').default
const qs = require('qs')

const Time = c.getTime()

/**
 * 查询校园卡余额
 * @param {{
 *  AccNum: string
 * }} data 
 * @param {string} url 
 */
exports.queryAccWallet = async (data, url) => {
  const { AccNum } = data
  const Sign = c.cryptSign([AccNum, Time])

  return axios
    .post(
      `${url}/QueryAccWallet.aspx`,
      qs.stringify({
        Time,
        Sign,
        AccNum
      })
    )
    .then(result => {
      const $ = cheerio.load(result.data)

      return {
        code: 200,
        balance: $('MonDBCurr').text()
      }
    })
    .catch(err => {
      console.log('网络错误', err)
      return 400
    })
}
