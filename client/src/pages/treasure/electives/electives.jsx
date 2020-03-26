import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './electives.scss'

export default class Arrange extends Component {
  config = {
    navigationBarBackgroundColor: '#f2a379',
    navigationBarTitleText: '选修课',
    navigationBarTextStyle: 'white'
  }

  render () {
    return (
      <View className='arrange'>
        选修课（暂未开放，预计27日正式上线）
      </View>
    )
  }
}
