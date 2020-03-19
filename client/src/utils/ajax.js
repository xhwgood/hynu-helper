import Taro from '@tarojs/taro'

export default function ajax(name, data = {}) {
  return new Promise((resolve, reject) => {
    Taro.cloud
      .callFunction({
        name,
        data
      })
      .then(res => {
        Taro.hideLoading()
        const { code, msg } = res.result.data
        if (code == 200 || msg) {
          if (msg) {
            Taro.showToast({
              title: msg,
              icon: 'none'
            })
          } else {
            Taro.showToast({
              title: '获取成功',
              icon: 'none'
            })
          }
          resolve(res.result.data)
        } else {
          Taro.showToast({
            title: '获取失败',
            icon: 'none'
          })
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
}
