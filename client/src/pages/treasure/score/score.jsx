import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './score.scss'

export default class Score extends Component {
  render () {
    return (
      <View className='score'>
        查成绩
      </View>
    )
  }
}
