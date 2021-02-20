const rp = require('request-promise')
const qs = require('qs')

exports.changePass = async (data, url) => {
  const { sessionid, oldpassword, password1, password2 } = data

  const config = {
    method: 'post',
    url: `${url}/yhxigl.do?method=changMyUserInfo`,
    headers: {
      'cookie': sessionid
    },
    data: qs.stringify({
      oldpassword,
      password1,
      password2
    })
  }

  return rp(config)
    .then(body => {
      const from = body.indexOf(`('`) + 2
      const end = body.indexOf(`'`, from)
      const msg = body.slice(from, end)

      return {
        code: 700,
        msg
      }
    })
    .catch(err => {
      console.log('网络错误', err)
      return (res = '抱歉，出现异常')
    })
}
