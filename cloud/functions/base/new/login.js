// @ts-check
const rp = require('request-promise')
/**
 * @param {{
 *  username: string
 *  password: string
 *  randomcode?: string
 * }} data 
 * @param {string} url 
 */
exports.login = async (data, url) => {
  const { username, password, randomcode } = data

  const options = {
    method: 'POST',
    uri: `${url}/Logon.do?method=logon`,
    form: {
      USERNAME: username,
      PASSWORD: password,
      encoded: ''
    }
  }

  try {
    await rp(options)
  } catch (err) {
    const { statusCode, response } = err
    if (statusCode !== 302) {
      return {
        code: 700,
        msg: '很抱歉，出现异常'
      }
    }
    const setCookie = response.headers['set-cookie']
    // const Cookie = setCookie[0]
    // const serverId = setCookie[1]
    const headers = {
      Cookie
    }
  }
}
