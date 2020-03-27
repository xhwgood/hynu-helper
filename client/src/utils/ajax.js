import Taro from '@tarojs/taro'
// @name：云函数名称
// @data：云函数接收的数据
// @notoast：保持静默，不弹出消息
// 状态码：
// 200：成功
// 202：已登录教务处
// 401：登录状态已过期
// 404：操作异常（未找到响应功能或页面），显示返回的 msg
const ajax = (name, data = {}, notoast) =>
  new Promise((resolve, reject) => {
    Taro.showLoading({
      title: '等一下下'
    })
    Taro.cloud
      .callFunction({
        name,
        data
      })
      .then(res => {
        Taro.hideLoading()
        const { code, msg } = res.result.data
        switch (code) {
          case 200:
            msg
              ? Taro.showToast({
                  title: msg,
                  icon: 'none'
                })
              : notoast
              ? ''
              : Taro.showToast({
                  title: '获取成功',
                  icon: 'none'
                })
            resolve(res.result.data)
            break
          case 401:
          case 202:
            resolve(res.result.data)
            break
          case 404:
            Taro.showToast({
              title: msg,
              icon: 'none'
            })
            reject(res.result.data)
            break

          default:
            msg
              ? Taro.showToast({
                  title: msg,
                  icon: 'none'
                })
              : Taro.showToast({
                  title: '获取成功',
                  icon: 'none'
                })
            resolve(res.result.data)
            break
        }
      })
      .catch(err => {
        Taro.hideLoading()
        Taro.showToast({
          title: '出现未知错误！',
          icon: 'none'
        })
        console.error(err)
      })
  })

export default ajax
