import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtFab } from 'taro-ui'
import './arrange.scss'

export default class Arrange extends Component {
  add = () => {
    Taro.navigateTo({
      url: './add'
    })
  }

  render() {
    return (
      <View className="arrange">
        考试安排
        <View className="add-btn" onClick={this.add}>
          <View className="btn">+</View>
        </View>
      </View>
    )
  }
}
