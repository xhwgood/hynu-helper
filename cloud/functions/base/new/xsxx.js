// @ts-check
const rp = require('request-promise')
/**
 * @param {{
 *  cookie: string
 * }} data
 * @param {string} url 
 */
module.exports = async ({ cookie }, url) => {
  const options = {
    uri: `${url}/grxx/xsxx`,
    headers: {
      cookie
    }
  }

  try {
    const res = await rp(options)
    // cookie 过期
    if (res.includes('登录')) {
      return {
        code: 404
      }
    }

    return {
      code: 200
    }
  } catch (err) {
    return {
      code: 700,
      msg: '很抱歉，出现异常'
    }
  }
}
