const c = require('./crypto-card')
const cheerio = require('cheerio')
const axios = require('axios')
const qs = require('qs')

const Time = c.getTime()
exports.login = async (data, url) => {
  const { UserNumber, Password } = data
  const Sign = c.cryptSign([Password, Time, UserNumber])

  return axios
    .post(
      `${url}/LogIn.aspx`,
      qs.stringify({
        Time,
        Sign,
        UserNumber,
        Password
      })
    )
    .then(result => {
      const $ = cheerio.load(result.data)

      const code = $('code').text()
      let res = {
        code: 700,
        msg:
          $('Msg').text() == '签名验证失败'
            ? '密码错误或服务器出现异常'
            : $('Msg').text()
      }
      if (code == '1') {
        res = {
          ...res,
          code: 200,
          AccNum: $('AccNum').text(),
          AccName: $('AccName').text(),
          CardID: $('CardID').text(),
          CustomerID: $('CustomerID').text(),
          AgentID: $('AgentID').text(),
          LostDate: $('LostDate').text(),
          PerCode: $('PerCode').text()
        }
      }
      return res
    })
    .catch(err => {
      console.log('网络错误', err)
      return {
        code: 700,
        msg: '网络错误'
      }
    })
}
