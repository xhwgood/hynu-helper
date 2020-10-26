const axios = require('axios')

/** 易校园接口地址 */
const url = 'https://compus.xiaofubao.com'
/** 易校园账号数据 */
const yxyData =
  'schoolCode=10546&deviceId=yunma3474269b-8142-4652-8d1b-cb16f97f736b&testAccount=1&appVersion=160&platform=YUNMA_APP'

/** 获取验证码 */
exports.getVerification = async ({ phone }, yxyUrl) => {
  const config = {
    method: 'post',
    url: `${yxyUrl}/compus/user/sendLoginVerificationCode`,
    data: `mobilePhone=${phone}&sendCount=1&${yxyData}`
  }

  return axios(config)
    .then(({ data: { success, message, data } }) => {
      if (success) {
        if (data.userExists) {
          return (res = {
            msg: '验证码发送成功',
            code: 200
          })
        } else {
          return (res = {
            msg: '你的账号还未在易校园中注册，请注册后再来绑定',
            code: 700
          })
        }
      } else {
        return (res = {
          msg: '出现异常',
          code: 700
        })
      }
    })
    .catch(err => {
      console.log('网络错误', err)
      return 400
    })
}

/** 通过验证码登录 */
exports.verLogin = async ({ phone, verificationCode }, yxyUrl) => {
  const config = {
    method: 'post',
    url: `${yxyUrl}/login/doLoginByVerificationCode`,
    data: `mobilePhone=${phone}&verificationCode=${verificationCode}&clientId=5c4502012ee8e7286f973b9762f40814&osType=Android&osVersion=10&mobileType=M2003J15SC&oaid=baa43c73093fd66c&appAllVersion=1.6.9&appWgtVersion=1.6.9&${yxyData}`
  }

  return axios(config)
    .then(
      ({
        data: {
          success,
          message,
          data: { bindCardStatus, userIdcard, token }
        }
      }) => {
        let msg = message
        if (success) {
          if (bindCardStatus == 0) {
            msg = '该《易校园》账号尚未绑定校园卡，你可以尝试其他绑定方式'
          } else {
            return (res = {
              msg: '绑定成功',
              code: 200,
              AccNum: userIdcard,
              token
            })
          }
        }
        return (res = {
          msg,
          code: 700
        })
      }
    )
    .catch(err => {
      console.log('网络错误', err)
      return 400
    })
}
