import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import './repair.scss'

export default class Repair extends Component {
  config = {
    navigationBarTitleText: '宿舍报修',
  }

  state = {}

  componentWillMount() {}
  render() {
    return <View>宿舍报修</View>
  }
}
