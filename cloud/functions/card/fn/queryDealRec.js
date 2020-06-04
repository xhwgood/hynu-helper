const c = require('./crypto-card')
const cheerio = require('cheerio')
const axios = require('axios')
const strToDate = require('../strToDate')

const Time = c.getTime()

exports.queryDealRec = async (data, url) => {
  const { AccNum, RecNum } = data
  const BeginDate = data.BeginDate || 0
  const EndDate = data.EndDate || 0
  const Type = 0
  const ViceAccNum = -1
  const WalletNum = 0
  const Count = 15
  const Sign = c.cryptSign([
    AccNum,
    BeginDate,
    Count,
    EndDate,
    RecNum,
    Time,
    Type,
    ViceAccNum,
    WalletNum
  ])

  return axios
    .post(
      `${url}/QueryDealRec.aspx`,
      `Time=${Time}&Sign=${Sign}&AccNum=${AccNum}&BeginDate=${BeginDate}&EndDate=${EndDate}&Type=${Type}&ViceAccNum=${ViceAccNum}&WalletNum=${WalletNum}&RecNum=${RecNum}&Count=${Count}`
    )
    .then(result => {
      const $ = cheerio.load(result.data)
      let arr = []
      let code = 200
      let msg

      if ($('code').text() == 1) {
        $('row').each((i, elem) => {
          const $_c = cheerio.load(elem)
          let deal = $_c('MonDeal').text()
          let source = $_c('Source')['0'].next.data.trim().replace('商户-', '')
          // 给每条账单信息添加图标
          let icon = 'expense'
          if (deal.charAt(0) != '-') {
            deal = '+' + Number(deal)
            icon = 'charge'
          }
          if (source.includes('电控缴费')) {
            deal = String(Number(deal))
            icon = 'dianfei'
          } else if (source.includes('超市')) {
            icon = 'chaoshi'
          } else if (source.includes('医院')) {
            icon = 'yiyuan'
          } else if (source.includes('图书馆')) {
            source += '滞纳金'
            icon = 'library'
          }
          // 转换日期，如3月20日
          const date = $_c('Date').text()

          arr.push({
            date,
            time: $_c('Time').text(),
            deal,
            balance: $_c('MonCard').text(),
            source,
            icon,
            zhDate: strToDate(date)
          })
        })
      } else {
        msg = '没有更多记录'
        code = 400
        arr = []
      }

      const obj = {}
      arr.forEach(value => {
        const date = value.date.slice(0, 7)
        if (Object.keys(obj).includes(date)) {
          obj[`${date}`].push(value)
        } else {
          obj[`${date}`] = []
          obj[`${date}`].push(value)
        }
      })

      return (res = {
        code,
        obj,
        msg
      })
    })
    .catch(err => {
      console.log('网络错误', err)
      return (res = '网络错误或其他异常')
    })
}
