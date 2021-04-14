// 云函数入口文件
const { login } = require('./fn/login')
const { getHistory } = require('./fn/getHistory')
const { renew } = require('./fn/renew')
const { mobileLogin } = require('./fn/mobile-login')

/**
 * @param {{
 *  func: string
 *  data: object
 * }} e
 */
exports.main = async (e, context) => {
  const url = 'http://opac.hynu.cn:443/opac'
  const { func, data } = e

  let res
  let resMobile

  switch (func) {
    case 'login':
      res = await login(data, url)
      break
    // 查询历史借阅
    case 'getHistory':
      res = await getHistory(data, url)
      break
    // 先获取移动端图书馆的sessionid
    case 'mobilelogin':
      resMobile = await mobileLogin(data, url)
      data.Cookie = resMobile.mobileLibSid
    // 续借图书
    case 'renew':
      res = await renew(data, url)
      // 将获取的移动端sid返回，以便多次续借
      if (resMobile) {
        res.mobileLibSid = resMobile.mobileLibSid
      }
      break

    default:
      break
  }
  return {
    data: res
  }
}
