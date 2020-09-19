const c = require('./crypto-card')
const cheerio = require('cheerio')
const axios = require('axios')
const qs = require('qs')

const Time = c.getTime()

exports.getQRCode = async (data, url, baseUrl) => {
  const { obj, AccNum } = data
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
      let error
      const data = res.map((item, idx) => {
        $ = cheerio.load(item.data)
        if ($('code').text() == 0) {
          error = true
          console.log($('code').text())
        }
        return $(apiArr[idx]).text()
      })
      // 获取随机码失败
      if (error) {
        return (res = {
          code: 400,
          msg: '网络错误或其他异常'
        })
      }
      const qrData = await axios.post(
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
      if (qrData.code == 400) {
        return (res = {
          code: 400,
          msg: '很抱歉，出现异常！请稍后再试'
        })
      } else {
        return (res = {
          code: 200,
          data: qrData.data
        })
      }
    })
    .catch(err => {
      return (res = {
        code: 400,
        msg: '网络错误或其他异常'
      })
    })
}
