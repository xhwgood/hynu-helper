const axios = require('axios')

exports.bindName = async data => {
  const { realName, incomeAccount } = data
  /** 易校园接口地址 */
  const url = 'https://compus.xiaofubao.com/compus/user'
  /** 易校园账号数据 */
  const yxyData =
    'id=2003262246597598&schoolCode=10546&token=492392b2e52b4f3d8ec404b4d2ee78ad&deviceId=yunma3474269b-8142-4652-8d1b-cb16f97f736b&testAccount=1&appVersion=160&platform=YUNMA_APP'
  /**
   * 解除绑定的请求配置
   */
  const unBindConfig = {
    method: 'post',
    url: `${url}/unBindCard`,
    data: yxyData
  }

  return axios
    .post(
      `${url}/bindCard`,
      `realName=${encodeURI(
        realName
      )}&incomeAccount=${incomeAccount}&accountType=2&${yxyData}`
    )
    .then(({ data: { success, message, data } }) => {
      if (success) {
        /** 绑定成功后需解除绑定 */
        axios(unBindConfig)
        return (res = {
          code: 200,
          msg: '绑定成功',
          AccNum: data.userIdcard
        })
      } else {
        const res = {
          code: 200,
          msg: '',
          AccNum: incomeAccount
        }
        // 修改《易校园》的提示
        switch (message) {
          case '校园卡已被他人绑定':
            res.msg =
              '你已在《易校园》中绑定，可以先在《易校园》解绑后再来尝试绑定，不会影响《易校园》的使用'
            break
          case '该e卡账户不存在':
            res.msg = '绑定失败，输入的信息有误'
            break

          default:
            res.msg = message
            break
        }
        return res
      }
    })
    .catch(err => {
      console.log('网络错误', err)
      return 400
    })
}
