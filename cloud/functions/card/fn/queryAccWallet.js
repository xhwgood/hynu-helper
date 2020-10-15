const c = require('./crypto-card')
const cheerio = require('cheerio')
const axios = require('axios')
const qs = require('qs')

const Time = c.getTime()

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

      return (res = {
        code: 200,
        balance: $('MonDBCurr').text()
      })
    })
    .catch(err => {
      console.log('网络错误', err)
      return 400
    })
}
