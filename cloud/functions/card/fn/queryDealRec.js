// @ts-check
const c = require('./crypto-card')
const cheerio = require('cheerio')
const axios = require('axios').default
const strToDate = require('../strToDate')
const qs = require('qs')

const Time = c.getTime()

/**
 * 查询最近账单详情
 * @param {{
 *  AccNum: string
 *  RecNum: number
 *  BeginDate?: string
 *  EndDate?: string
 * }} data 
 * @param {string} url 
 */
exports.queryDealRec = async (data, url) => {
  const { AccNum, RecNum } = data
  /** 起始日期 */
  const BeginDate = data.BeginDate || 0
  /** 结束日期 */
  const EndDate = data.EndDate || 0
  /** 筛选类型，0 代表所有 */
  const Type = 0
  const ViceAccNum = -1
  /** 钱包类型，写死 */
  const WalletNum = 0
  /** 每次请求 15 条 */
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
      qs.stringify({
        Time,
        Sign,
        AccNum,
        BeginDate,
        EndDate,
        Type,
        ViceAccNum,
        WalletNum,
        RecNum,
        Count
      })
    )
    .then(result => {
      const $ = cheerio.load(result.data)
      let arr = []
      let code = 204
      let msg
      /** 是否还有下一页 */
      let hasNext = false
      // @ts-ignore
      if ($('code').text() == 1) {
        const rows = $('row')
        if (rows.length >= Count) {
          hasNext = true
        }
        rows.each((i, elem) => {
          const $_c = cheerio.load(elem)
          let deal = $_c('MonDeal').text()
          const FeeName = $_c('FeeName').text()
          // console.log('FeeName:', FeeName)
          const { data } = $_c('Source')['0'].next
          let source
          if (data) {
            source = data.trim().replace('商户-', '')
          }
          if (!data || FeeName == '补助发放' || FeeName == '开户配卡') {
            source = FeeName
          }
          // 给每条账单信息添加图标
          let icon = 'expense'
          // 给建行莫名其妙扣掉的钱换上‘账单’的图标
          if (source == '中国建设银行') {
            icon = 'zd'
          }
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
            icon = 'library'
          } else if (source.includes('水果店')) {
            icon = 'shuiguo'
          } else if (
            source.includes('拉面') ||
            source.includes('面馆') ||
            source.includes('米粉')
          ) {
            icon = 'lamian'
          } else if (source.includes('烘焙')) {
            icon = 'hongbei'
          } else if (source.includes('汉堡')) {
            icon = 'hanbao'
          } else if (source.includes('豆浆') || source.includes('奶茶店')) {
            icon = 'doujiang'
          } else if (source.includes('灌汤包')) {
            icon = 'tangbao'
          }
          const date = $_c('Date').text()
          const item = {
            date,
            time: $_c('Time').text(),
            deal,
            balance: $_c('MonCard').text(),
            source,
            icon,
            zhDate: strToDate(date)
          }
          // 直接删掉默认要显示的图标，以节省用户流量
          if (item.icon == 'expense') {
            delete item.icon
          }
          arr.push(item)
        })
      } else {
        msg = '没有更多记录啦'
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
      if (arr.length == 0) {
        code = 400
      }
      return {
        code,
        obj,
        msg,
        hasNext
      }
    })
    .catch(err => {
      console.log('出现异常', err)
      return {
        code: 400,
        msg: '抱歉，出现异常'
      }
    })
}
