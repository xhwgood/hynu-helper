import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { list } from './color'
import './index.scss'

export default class SClass extends Component {
  static defaultProps = {
    showDetail: () => {},
    item: {
      section: ''
    }
  }

  render() {
    const { allWeekIdx, showDetail, item, idx } = this.props
    const { section, name, place, inThisWeek, id } = item

    return (
      <View
        className='item-class'
        style={{
          height: (section.length / 2 - 1) * 114 + 112 + 'rpx',
          top: (section.charAt(1) - 1) * 121 + 100 + 'rpx',
          backgroundColor:
            allWeekIdx < idx + 2 && inThisWeek ? list[id] : '#ebf3f9',
          color: allWeekIdx < idx + 2 && inThisWeek ? '#fff' : '#8093a3',
          zIndex: inThisWeek ? '1' : '0'
        }}
        onClick={showDetail.bind(this, item)}
      >
        <View className='name'>{name}</View>
        <View className='place'>{place}</View>
      </View>
    )
  }
}
