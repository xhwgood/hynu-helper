import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Info from './info'
import './landf.scss'

export default class Landf extends Component {
  write = () => {
    Taro.navigateTo({ url: './write' })
  }

  render() {
    return (
      <View className='landf'>
        <Info />
        <View className='write' onClick={this.write}>
          <View className='btn'>+</View>
        </View>
      </View>
    )
  }
}
