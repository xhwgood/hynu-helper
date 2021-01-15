import Taro from '@tarojs/taro'

/**
 * 无`icon`的`toast`
 * @param {string} title 要显示的消息
 * @param {number} time 显示的时间（毫秒），默认 1500毫秒
 * @param {string} url 显示完毕后要跳转的链接，不传则不跳转
 */
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

/**
 * 先`toast`提示，后跳转页面
 * @param {string} title 要显示的消息
 * @param {string} url 显示完毕后要跳转的链接，不传则不跳转
 */
const navigate = (title, url) => noicon(title, 2000, url)

/**
 * 不显示`cancel`按钮的`modal`
 * @param {string} msg 要显示的消息内容
 */
const nocancel = msg =>
  Taro.showModal({
    content: msg,
    showCancel: false
  })

/**
 * 显示`error icon` 的 `toast`
 * @param {string} title 要显示的消息
 */
const showError = (title) => {
  if (Taro.canIUse('showToast.icon.error')) {
    Taro.showToast({
      title,
      icon: 'error'
    })
  } else {
    noicon(title)
  }
}

export { noicon, navigate, nocancel, showError }
