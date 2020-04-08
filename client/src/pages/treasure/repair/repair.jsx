import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import './repair.scss'

export default class Repair extends Component {
  config = {
    navigationBarBackgroundColor: '#254b62',
    navigationBarTitleText: '宿舍报修',
    navigationBarTextStyle: 'white'
  }

  state = {}

  componentWillMount() {}
  render() {
    return <View>宿舍报修</View>
  }
}
