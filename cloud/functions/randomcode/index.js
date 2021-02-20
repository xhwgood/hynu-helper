// 云函数入口文件
const axios = require('axios')

// 云函数入口函数
exports.main = async (e, context) => {
  let base64
  if (!e.url.includes('hysf')) {
    return {
      code: 404
    }
  }

  return await axios(e.url, {
    responseType: 'arraybuffer'
  })
    .then(body => {
      const getCookie = body.headers['set-cookie']
      let sessionid = getCookie[0].slice(0, 43)
      base64 =
        'data:image/jpg;base64,' + Buffer.from(body.data).toString('base64')
      // 若有第二个cookie，则是CET查准考证号的验证码
      if (getCookie[1]) {
        sessionid = sessionid + getCookie[1].slice(0, 42)
      }

      return {
        base64,
        sessionid
      }
    })
    .catch(err => console.log('出错了！', err))
}
