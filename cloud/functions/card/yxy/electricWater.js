const axios = require('axios')

const headers = {
  'content-type': 'application/x-www-form-urlencoded'
}
/**
 * 电费充值
 * @param {object} param 请求数据
 * @param {string} url 校园卡接口
 */
exports.electric = async (
  {
    /** 校区 */
    areaId,
    // 楼栋
    buildingCode,
    // 楼层
    floorCode,
    // 寝室
    roomCode,
    // 账号 ID
    userId,
    // 充值金额
    money,
    // 账号 token
    submitToken,
    // 交易密码
    password
  },
  url
) =>
  axios
    .post(
      `${url}/app/electric/recharge`,
      `schoolCode=10546&areaId=${areaId}&buildingCode=${buildingCode}&floorCode=${floorCode}&roomCode=${roomCode}&userId=${userId}&money=${money}&submitToken=${submitToken}&source=app`,
      { headers }
    )
    .then(({ data: { success, data } }) => {
      if (success) {
        /** 获取返回 url 中的参数 */
        const tranNo = new URL(data).searchParams.get('tran_no')
        return axios
          .post(`https://pay.xiaofubao.com/pay/unified/doCardPay`, {
            tranNo,
            password
          })
          .then(res => {
            console.log(res.data)
          })
      } else {
        return {
          code: 700,
          msg: '出现异常'
        }
      }
    })
    .catch(err => {
      console.log('网络错误', err)
      return 400
    })
