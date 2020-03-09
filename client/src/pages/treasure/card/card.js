import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './card.scss'

export default class Card extends Component {
  render () {
    return (
      <View className='card'>
        校园卡
      </View>
    )
  }
}
