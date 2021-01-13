import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import Bottom from '../bottom'
import { bgColor7 } from '@styles/color.js'
import './index.scss'

export default class Index extends Component {
  static defaultProps = {
    item: {
      bottomShow: false
    }
  }

  render() {
    const { item, i, showBottom, element } = this.props

    return (
      <View className='border-b' style={{ background: bgColor7 }}>
        <View
          className='at-row at-row__align--center'
          onClick={showBottom.bind(this, item, i, element)}
        >
          <View className='at-col at-col-8'>
            {item.course}
            {item.makeup ? '（补考）' : ''}
          </View>
          <View className='at-col at-col-3 main'>{item.score}</View>
          <AtIcon
            value='chevron-left'
            className='at-col at-col-1'
            customStyle={{
              transform: item.bottomShow ? 'rotate(-90deg)' : '',
              transition: 'All 0.4s ease-in-out',
              transformOrigin: '13px 11px'
            }}
            size='22'
            color='#4e4e6a'
          />
        </View>
        {/* 成绩详情组件 */}
        {item.bottomShow && <Bottom detail={item} />}
      </View>
    )
  }
}
