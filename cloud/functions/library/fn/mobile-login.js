const rp = require('request-promise')
const crypto = require('crypto')

exports.mobileLogin = async (data, url) => {
  const { rdid, password } = data
  const rdPasswd = crypto.createHash('md5').update(password).digest('hex')
  const options = {
    method: 'POST',
    url: `${url}/m/reader/doLogin`,
    form: {
      password: '',
      rdPasswd,
      rdid,
      returnUrl: ''
    }
  }

  return rp(options)
    .then(res => {
      return (res = {
        code: 601
      })
    })
    .catch(err => {
      if (err.statusCode == 302) {
        const Cookie = err.response.headers['set-cookie'][0].slice(0, 43)

        return (res = {
          code: 200,
          mobileLibSid: Cookie
        })
      }
    })
}
