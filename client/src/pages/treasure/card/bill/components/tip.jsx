import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { secondary_color6 } from '@styles/color'
import '../index.scss'

export default class Tip extends Component {
  state = {
    tipIsShow: false
  }

  render() {
    const { tipIsShow } = this.state

    return (
      <View className='wrapper'>
        {tipIsShow && (
          <View className='tips' style={{ color: secondary_color6 }}>
            数据获取自校园卡APP，每笔记录消费时间可能和真实时间不符，仅供参考！若没有最新记录可下拉刷新
          </View>
        )}
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
