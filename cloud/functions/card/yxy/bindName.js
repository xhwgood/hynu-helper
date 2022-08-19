// @ts-check
const axios = require('axios').default
const cloud = require('wx-server-sdk')
const { yxyDataList } = require('./yxyDataList')

cloud.init()

exports.bindName = async ({ realName, incomeAccount }, yxyUrl) => {
  const log = cloud.logger()

  /** 易校园接口地址 */
  const url = `${yxyUrl}/compus/user`
  /** 从账号数组中随机获取索引 */
  const idx = Math.floor(Math.random() * yxyDataList.length)
  /** 测试用数据 */
  // const idx = 2
  const yxyData = yxyDataList[idx]
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
        log.info({
          type: '成功',
          idx
        })
        return {
          code: 200,
          msg: '绑定成功',
          AccNum: data.userIdcard
        }
      } else {
        log.error({
          type: '失败',
          idx, message, data
        })
        const res = {
          code: 200,
          AccNum: incomeAccount
        }
        // 修改《易校园》的提示
        switch (message) {
          case '校园卡已被他人绑定':
            res.msg = `该卡已被易校园账号${data.bindPhone || ''}绑定，可以先解除绑定后再尝试，不会影响《易校园》的使用`
            break
          case '该e卡账户不存在':
            res.msg = '绑定失败，输入的信息有误'
            break
          case '登录已过期，请重新登录[user no find]':
            res.msg = '请再次尝试绑定，或在“我的”页进行吐槽'
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
