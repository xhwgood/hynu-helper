// @ts-check
const rp = require('request-promise')
const encode = require('./encodeInp')
const cheerio = require('cheerio')
/**
 * @param {{
 *  username: string
 *  password: string
 *  randomcode?: string
 * }} data 
 * @param {string} url 
 */
module.exports = async (data, url) => {
  const { username, password, randomcode } = data

  const account = encode(username)
  const passwd = encode(password)
  const encoded = account + '%%%' + passwd

  const options = {
    method: 'POST',
    url: `${url}/xk/LoginToXk`,
    form: {
      encoded,
      userAccount: username,
      userPassword: password,
    }
  }

  try {
    const res = await rp(options)
    const $ = cheerio.load(res)
    const msg = $('div #showMsg').text().trim() || '出现异常'

    return {
      code: 700,
      msg
    }
  } catch (err) {
    const { statusCode, response } = err
    if (statusCode !== 302) {
      return {
        code: 700,
        msg: '很抱歉，出现异常'
      }
    }
    const setCookie = response.headers['set-cookie']
    const cookie = setCookie[0].slice(0, 44)
    const serverId = setCookie[1].slice(0, 13)

    return {
      code: 200,
      cookie: cookie + serverId
    }
  }
}
