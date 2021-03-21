import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
// import { secondary_color6 } from '@styles/color'
import '../index.scss'

const showStyle = {}

export default class Tip extends Component {
  state = {
    tipIsShow: false
  }

  render() {
    const { tipIsShow } = this.state

    return (
      <View className='wrapper'>
        <View
          className='tips fz36'
          style={{
            transform: tipIsShow ? 'scale(1)' : 'scale(0)',
            right: tipIsShow ? '40rpx' : '-130rpx',
            bottom: tipIsShow ? '210rpx' : '110rpx',
            transition: 'All 0.5s ease'
          }}
        >
          数据获取自校园卡APP，消费时间可能和真实时间不符，仅供参考！若没有最新记录可下拉刷新
          <View className='triangle'></View>
        </View>
        <View
          className='add-btn'
          onClick={() =>
            this.setState(pre => ({
              tipIsShow: !pre.tipIsShow
            }))
          }
        >
          <View>?</View>
        </View>
      </View>
    )
  }
}
