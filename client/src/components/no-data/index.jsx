import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { secondary_color9, secondary_color6 } from '@styles/color.js'
import './index.scss'

export default class Index extends Component {
  render() {
    const { txt, children } = this.props

    return (
      <View className={`no-data tac ${txt ? 'height' : ''}`}>
        <AtIcon
          prefixClass='icon'
          value='empty'
          size='40'
          color={secondary_color9}
        />
        <Text style={{ color: secondary_color6 }}>
          {txt || '啊哦，没有查询到你的数据'}
        </Text>
        {children}
      </View>
    )
  }
}
