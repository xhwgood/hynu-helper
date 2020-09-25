// 云函数入口文件
const { login } = require('./fn/login')
const { queryAccWallet } = require('./fn/queryAccWallet')
const { queryAccInfo } = require('./fn/queryAccInfo')
const { queryDealRec } = require('./fn/queryDealRec')
const { bankTransfer } = require('./fn/bankTransfer')
const { queryMonthBill } = require('./fn/queryMonthBill')
const { getQRCode } = require('./fn/getQRCode')
// http://223.146.71.26:9111/BankTransfer.aspx
const url = 'http://223.146.71.26:9111'
const baseUrl = 'http://101.132.138.215:8089'

// 云函数入口函数
exports.main = async (e, context) => {
  const { func, data } = e
  let res

  switch (func) {
    // 登录并查询余额
    case 'login':
      const res1 = await login(data, url)
      const { AccNum, msg } = res1
      let res2
      let res3
      if (msg.includes('成功')) {
        res2 = await queryAccWallet({ AccNum }, url)
        res3 = await queryAccInfo({ AccNum }, url)
      } else {
        res1.code = 400
      }
      res = {
        ...res1,
        ...res2,
        ...res3
      }
      break
    // 查询余额
    case 'queryAccWallet':
      res = await queryAccWallet(data, url)
      break
    // 查询近期账单
    case 'queryDealRec':
      const dealRecRes = await queryDealRec(data, url)
      const arr = []
      const monthArr = Object.keys(dealRecRes.obj)
      // 查询所有上面详细记录包含的月账单
      const monthObj = {}
      monthArr.map(Month =>
        arr.push(queryMonthBill({ AccNum: data.AccNum, Month }, url))
      )
      await Promise.all(arr).then(res => {
        res.map(({ monthBill }, i) => {
          monthObj[`${monthArr[i]}`] = monthBill
        })
      })
      res = { ...dealRecRes, monthObj }
      break
    // 查询月账单
    case 'queryMonthBill':
      res = await queryMonthBill(data, url)
      break
    // 充值
    case 'bankTransfer':
      res = await bankTransfer(data, url)
      break
    /** 获取二维码图片：base64 */
    case 'getQRCode':
      res = await getQRCode(data, url, baseUrl)
      break

    default:
      break
  }
  return {
    data: res
  }
}
