import Taro from '@tarojs/taro'

const navigate = (title, url) =>
  Taro.showToast({
    title,
    icon: 'none',
    duration: 2000,
    success: () => {
      setTimeout(() => {
        Taro.navigateTo({ url })
      }, 300)
    }
  })

export default navigate
