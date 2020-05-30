import Taro from '@tarojs/taro'
// 无icon的toast
const noicon = (title, time = 1500) =>
  Taro.showToast({
    title,
    icon: 'none',
    duration: time
  })

export default noicon
