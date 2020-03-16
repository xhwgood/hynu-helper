import Taro from '@tarojs/taro'

export default function ajax(name, data = {}) {
  return new Promise((resolve, reject) => {
    Taro.cloud
      .callFunction({
        name,
        data
      })
      .then(res => {
        console.log(res);

        Taro.hideLoading()
        const { code, msg } = res.result.data
        if (code == 200) {
          Taro.showToast({
            title: '获取成功',
            icon: 'none'
          })
        }
        if (msg) {
          Taro.showToast({
            title: msg,
            icon: 'none'
          })
        }
        resolve(res.result.data)
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
