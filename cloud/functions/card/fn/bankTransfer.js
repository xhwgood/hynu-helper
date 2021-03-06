// @ts-check
const c = require('./crypto-card')
const cheerio = require('cheerio')
const axios = require('axios').default
const qs = require('qs')

const Time = c.getTime()
/**
 * 银行卡充值
 * @param {{
 *  AccNum: string
 *  MonTrans: string
 *  Password: string
 * }} data 
 * @param {string} url 
 */
exports.bankTransfer = async (data, url) => {
  let { AccNum, MonTrans, Password } = data
  const Sign = c.cryptSign([AccNum, MonTrans, Password, Time])

  return axios
    .post(
      `${url}/BankTransfer.aspx`,
      qs.stringify({
        Time,
        Sign,
        AccNum,
        MonTrans,
        Password
      })
    )
    .then(result => {
      const $ = cheerio.load(result.data)
      let code = 202
      let msg = $('msg').text()
      // @ts-ignore
      if ($('code').text() != 1) {
        code = 400
      } else {
        msg = '充值成功，可能有一些延迟'
      }
      return {
        code,
        msg
      }
    })
    .catch(err => {
      console.log('网络错误', err)
      return 400
    })
}
