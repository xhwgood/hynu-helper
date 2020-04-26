import Taro from '@tarojs/taro'
// 无icon的toast
const noicon = title =>
  Taro.showToast({
    title,
    icon: 'none'
  })

export default noicon
