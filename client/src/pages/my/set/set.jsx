import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import {
  secondary_colorE,
  primary_color,
  secondary_color80,
  bgColor
} from '@styles/color.js'
import './set.scss'

export default class Set extends Component {
  config = {
    navigationBarBackgroundColor: '#A80000',
    navigationBarTitleText: '设置',
    navigationBarTextStyle: 'white'
  }

  state = {}

  render() {
    const primary = {
      background: primary_color,
      color: secondary_color80,
      borderBottom: `1px solid ${secondary_colorE}`
    }

    return (
      <View
        style={{ background: bgColor, height: '100vh', paddingTop: '30rpx' }}
      >
        <View className='big-item'>
          <View>教务处</View>
          <View className='nav'>
            <View className='fz32' style={primary}>
              账号解绑
            </View>
            <View className='fz32' style={primary}>
              密码修改
            </View>
          </View>
        </View>
        <View className='big-item'>
          <View>图书馆</View>
          <View className='nav'>
            <View className='fz32' style={primary}>
              账号解绑
            </View>
          </View>
        </View>
        <View className='big-item'>
          <View>校园卡</View>
          <View className='nav'>
            <View className='fz32' style={primary}>
              账号解绑
            </View>
          </View>
        </View>
      </View>
    )
  }
}
