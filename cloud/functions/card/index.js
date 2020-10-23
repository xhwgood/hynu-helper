// 云函数入口文件
const { login } = require('./fn/login')
const { queryAccWallet } = require('./fn/queryAccWallet')
const { queryAccInfo } = require('./fn/queryAccInfo')
const { queryDealRec } = require('./fn/queryDealRec')
const { bankTransfer } = require('./fn/bankTransfer')
const { queryMonthBill } = require('./fn/queryMonthBill')
const { getQRCode } = require('./fn/getQRCode')
const { bindName } = require('./yxy/bindName')
const { verLogin, getVerification } = require('./yxy/verificationLogin')

const url = 'http://223.146.71.26:9111'
const baseUrl = 'http://101.132.138.215:8089'
/** 返回错误提示 */
const errorRes = {
  code: 400,
  msg: '网络错误或其他异常'
}

// 云函数入口函数
exports.main = async (e, context) => {
  const { func, data } = e
  let res

  switch (func) {
    // 登录并查询信息
    case 'login':
    case 'bindName':
      /** 绑定成功后的返回信息 */
      let loginRes
      if (func == 'bindName') {
        loginRes = await bindName(data)
      } else {
        loginRes = await login(data, url)
      }
      const { AccNum, msg } = loginRes
      /** 再获取银行卡信息 */
      let accInfoRes
      if (msg.includes('成功')) {
        accInfoRes = await queryAccInfo({ AccNum }, url)
      } else {
        loginRes.code = 700
      }
      res = {
        ...loginRes,
        ...accInfoRes,
        balance: 0.01
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
    /** 获取验证码 */
    case 'getVerification':
      res = await getVerification(data)
      break
    /** 通过验证码登录《易校园》 */
    case 'verLogin':
      res = await verLogin(data)
      break

    default:
      break
  }
  return {
    data: res == 400 ? errorRes : res
  }
}
