// @ts-check
const c = require('./crypto-card')
const cheerio = require('cheerio')
const axios = require('axios').default
const qs = require('qs')

const Time = c.getTime()

/**
 * 获取校园卡二维码
 * @param {{
 *  AccNum: string
 *  obj: object
 * }} data 
 * @param {string} url 
 * @param {string} baseUrl 
 */
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
        const $ = cheerio.load(item.data)
        // @ts-ignore
        if ($('code').text() == 0) {
          error = true
        }
        return $(apiArr[idx]).text()
      })
      // 获取随机码失败
      if (error) {
        return 400
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
      // TODO: 检查该对象
      if (qrData.code == 400) {
        return {
          code: 700,
          msg: '很抱歉，出现异常！请稍后再试'
        }
      } else {
        return {
          code: 200,
          data: qrData.data
        }
      }
    })
    .catch(err => {
      return {
        code: 700,
        msg: '很抱歉，出现异常！请稍后再试'
      }
    })
}
