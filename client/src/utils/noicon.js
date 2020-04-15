import Taro from '@tarojs/taro'

const noicon = title =>
  Taro.showToast({
    title,
    icon: 'none'
  })

export default noicon
