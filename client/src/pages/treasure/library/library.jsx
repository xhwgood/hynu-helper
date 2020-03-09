import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './library.scss'

export default class Library extends Component {
  render () {
    return (
      <View className='library'>
        图书馆
      </View>
    )
  }
}
