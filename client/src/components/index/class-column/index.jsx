import Taro, { PureComponent } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { day } from '@utils/data'
import { activeBG } from '@styles/color'
import { list } from './color'
import './index.scss'
/**
 * 动态计算课程高度
 * @param {string} section
 */
const height = (section) => {
  /** 是否为半天的课程 */
  const isFour = ['0104', '0508'].includes(section)

  return (isFour ? 4 : section.length / 2 - 1) *
    122 +
    118 +
    'rpx'
}

export default class Index extends PureComponent {
  componentDidMount() {
    const { getWidth, idx } = this.props
    if (idx == 0) {
      const query = Taro.createSelectorQuery().in(this.$scope)
      query
        .select('.day')
        .boundingClientRect(rect => {
          if (rect) {
            getWidth(rect.width)
          }
        })
        .exec()
    }
  }

  render() {
    const { item = {}, idx, showDetail, allWeekIdx, setting } = this.props

    return (
      <View className='day' key={item.day}>
        <View
          className={idx == allWeekIdx ? 'active top' : 'top'}
          style={{ background: idx == allWeekIdx ? activeBG : '' }}
        >
          <View>{idx == allWeekIdx ? '今天' : day[idx % 7]}</View>
          <View className='date'>{item.day}</View>
        </View>
        {item.class &&
          item.class.map(
            v =>
              (!setting.hideNoThisWeek ||
                (setting.hideNoThisWeek && v.inThisWeek)) && (
                <View
                  className='item-class'
                  key={v.section + v.name}
                  style={{
                    height: height(v.section),
                    top: (v.section.slice(0, 2) - 1) * 128 + 108 + 'rpx',
                    backgroundColor:
                      allWeekIdx <= idx && v.inThisWeek
                        ? list[v.id]
                        : '#ebf3f9',
                    color:
                      allWeekIdx <= idx && v.inThisWeek ? '#fff' : '#8093a3',
                    zIndex: v.inThisWeek ? 1 : 0
                  }}
                  onClick={showDetail.bind(this, v, list[v.id])}
                >
                  <View className='name'>{v.name}</View>
                  <View className='place'>{v.place}</View>
                </View>
              )
          )}
      </View>
    )
  }
}
