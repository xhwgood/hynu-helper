// @ts-check
import Taro from '@tarojs/taro'

let isNew = false
Taro.getSystemInfo({
  success: ({ SDKVersion }) => {
    const arr = SDKVersion.split('.')
    // 大于V3的话肯定支持，后面就无需判断
    // 否则在V2.14.1以上才行
    if (Number(arr[0]) >= 3) {
      isNew = true
    } else if (Number(arr[0]) == 2 && Number(arr[1]) >= 14 && Number(arr[2]) >= 1) {
      isNew = true
    }
  }
})

/**
 * 无 `icon` 的 `toast`
 * @param {string} title 提示的内容
 * @param duration 提示的延迟时间（毫秒），默认 2000毫秒
 * @param url 显示完毕后要跳转的链接，不传则不跳转
 */
const noicon = (title, duration = 2000, url = '') =>
  Taro.showToast({
    title,
    icon: 'none',
    duration,
    success: () => {
      if (url) {
        setTimeout(() => {
          Taro.navigateTo({ url })
        }, 300)
      }
    }
  })

/**
 * 先 `toast` 提示，后跳转页面
 * @param {string} title 要显示的消息
 * @param {string} url 显示完毕后要跳转的链接，不传则不跳转
 */
const navigate = (title, url) => noicon(title, 2300, url)

/**
 * 不显示 `cancel` 按钮的 `modal`
 * @param {string} msg 要显示的消息内容
 */
const nocancel = msg =>
  Taro.showModal({
    content: msg,
    showCancel: false
  })

/**
 * 显示 `error icon` 的 `toast`
 * @param {string} title 提示的内容
 * @param {number} duration 提示的延迟时间（毫秒），默认 2000毫秒
 */
const showError = (title, duration = 2000) => {
  // 此 API 暂未更新新图标
  // Taro.canIUse('showToast.icon.error')
  isNew ? Taro.showToast({
    title,
    icon: 'error',
    duration
  }) : noicon(title, duration)
}

export { noicon, navigate, nocancel, showError }
