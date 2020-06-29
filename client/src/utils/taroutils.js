import Taro from '@tarojs/taro'

// 无icon的toast
const noicon = (title, time = 1500, url) =>
  Taro.showToast({
    title,
    icon: 'none',
    duration: time,
    success: () => {
      if (url) {
        setTimeout(() => {
          Taro.navigateTo({ url })
        }, 300)
      }
    }
  })

// 先toast提示，后跳转页面
const navigate = (title, url) => noicon(title, 2000, url)

// 不显示cancel按钮的modal
const nocancel = msg =>
  Taro.showModal({
    content: msg,
    showCancel: false
  })

export { noicon, navigate, nocancel }
