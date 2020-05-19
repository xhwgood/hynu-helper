import Taro from '@tarojs/taro'
// 不显示cancel按钮的modal
const nocancel = msg =>
  Taro.showModal({
    content: msg,
    showCancel: false
  })

export default nocancel
