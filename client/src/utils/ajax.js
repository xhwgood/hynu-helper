import Taro from '@tarojs/taro'

const ajax = (name, data = {}) =>
  new Promise((resolve, reject) => {
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
              : Taro.showToast({
                  title: '获取成功',
                  icon: 'none'
                })
            resolve(res.result.data)
            break
          // 401：登录状态已过期，202：已登录教务处
          case 401:
          case 202:
            resolve(res.result.data)
            break

          default:
            Taro.showToast({
              title: '获取失败',
              icon: 'none'
            })
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
