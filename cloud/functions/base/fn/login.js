const rp = require('request-promise')

exports.login = async (data, url) => {
  const { username, password, randomcode, sessionid } = data

  const headers = {
    Cookie: sessionid
  }
  const options = {
    method: 'POST',
    uri: `${url}/Logon.do?method=logon`,
    headers,
    form: {
      USERNAME: username,
      PASSWORD: password,
      RANDOMCODE: randomcode
    }
  }
  const optionsSSO = {
    method: 'POST',
    uri: `${url}/Logon.do?method=logonBySSO`,
    headers
  }

  return rp(options)
    .then(body => {
      if (body.includes('main.jsp')) {
        return rp(optionsSSO)
          .then(() => ({
            code: 200
          }))
          .catch(err => {
            console.log('单点登录失败！', err)
          })
      } else {
        let msg = '学号、密码或验证码错误'
        if (body.includes('有效期')) {
          msg = '未在选修课开放时间内不可登录'
        }
        return {
          code: 700,
          msg
        }
      }
    })
    .catch(err => {
      console.log('网络错误', err)
      return {
        code: 700,
        msg: '抱歉，出现异常'
      }
    })
}
