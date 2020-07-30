const c = require('./crypto-card')
const cheerio = require('cheerio')
const axios = require('axios')

exports.login = async (data, url) => {
  const { UserNumber, Password } = data
  const Time = c.getTime()
  const Sign = c.cryptSign([Password, Time, UserNumber])

  return axios
    .post(
      `${url}/LogIn.aspx`,
      `Time=${Time}&Sign=${Sign}&UserNumber=${UserNumber}&Password=${Password}`
    )
    .then(result => {
      const $ = cheerio.load(result.data)
      const code = $('code').text()
      const res = {
        code,
        msg: $('Msg').text()
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
          LostDate: $('LostDate').text()
        }
      }

      return res
    })
    .catch(err => {
      console.log('网络错误', err)
      return (res = '网络错误或其他异常')
    })
}
