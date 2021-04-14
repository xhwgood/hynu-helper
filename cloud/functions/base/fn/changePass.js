// @ts-check
const rp = require('request-promise')
const qs = require('qs')
/**
 * @param {{
 *  sessionid: string
 *  oldpassword: string
 *  password1: string
 *  password2: string
 * }} data 
 * @param {string} url 
 */
exports.changePass = async (data, url) => {
  const { sessionid, oldpassword, password1, password2 } = data

  const config = {
    method: 'post',
    url: `${url}/yhxigl.do?method=changMyUserInfo`,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'cookie': sessionid
    },
    body: qs.stringify({
      oldpassword,
      password1,
      password2
    })
  }

  return rp(config)
    .then(body => {
      if (body.includes('500')) {
        return {
          code: 400,
          msg: '抱歉，出现异常'
        }
      }
      let code = 700
      const from = body.indexOf(`('`) + 2
      const end = body.indexOf(`'`, from)
      const msg = body.slice(from, end)
      if (msg.includes('修改密码成功')) {
        code = 205
      }

      return {
        code,
        msg
      }
    })
    .catch(err => {
      console.log('网络错误', err)
      return {
        code: 400,
        msg: '抱歉，出现异常'
      }
    })
}
