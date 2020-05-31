// 云函数入口文件
const { login } = require('./fn/login')
const { getHistory } = require('./fn/getHistory')
const { renew } = require('./fn/renew')

const url = 'http://opac.hynu.cn:443/opac'

// 云函数入口函数
exports.main = async (e, context) => {
  const { func, data } = e
  let res

  switch (func) {
    case 'login':
      res = await login(data, url)
      break
    // 查询历史借阅
    case 'getHistory':
      res = await getHistory(data, url)
      break
    // 续借图书
    case 'renew':
      res = await renew(data, url)
      break

    default:
      break
  }
  return {
    data: res
  }
}
