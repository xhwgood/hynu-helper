const c = require('./crypto-card')
const cheerio = require('cheerio')
const axios = require('axios')
const qs = require('qs')

exports.getQRCode = async (data, url, baseUrl) => {
  const { obj, AccNum } = data
  const Time = c.getTime()
  const Sign = c.cryptSign([AccNum, Time])
  /** 获取二维码图片前需要获取两个值 */
  const apiArr = ['OrderNum', 'RandomNum']

  const requestArr = apiArr.map(item =>
    axios.post(
      `${url}/Get${item}.aspx`,
      qs.stringify({
        AccNum,
        Sign,
        Time
      })
    )
  )
  /** 并发获取两个值 */
  return Promise.all(requestArr)
    .then(async res => {
      const data = res.map((item, idx) => {
        $ = cheerio.load(item.data)
        return $(apiArr[idx]).text()
      })

      const qrData = await axios
        .post(
          `${baseUrl}/getqr`,
          {
            ...obj,
            randomNum: data[1],
            orderNumb: data[0],
            height: '219',
            width: '219'
          },
          { headers: { 'Content-Type': 'application/json' } }
        )
        .catch(err => {
          console.log(err);
          return (res = {
            code: 400,
            msg: '网络错误或其他异常'
          })
        })
      return (res = {
        code: 200,
        data: qrData.data
      })
    })
    .catch(err => {
      return (res = {
        code: 400,
        msg: '网络错误或其他异常'
      })
    })
}
