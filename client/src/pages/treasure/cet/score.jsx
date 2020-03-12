import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtDivider } from 'taro-ui'
import './score.scss'

export default class Score extends Component {
  config = {
    navigationBarTitleText: '查询结果'
  }

  state = {
    obj: {
      id: '192243017001482',
      kys: 'C+',
      kyz: 'S19443017110236',
      l: 107,
      n: '毛金平',
      r: 138,
      s: 350,
      t: 0,
      w: 105,
      x: '衡阳师范学院',
      z: '430171192202321'
    }
  }

  render() {
    const { obj } = this.state
    return (
      <View className="container">
        <View>2019年12月</View>
        <View>考试成绩查询结果</View>
        <View className="card">
          <View className="at-row">
            <View className="at-col at-col__offset-1">
              <View className="key">考生姓名</View>
              <View>{obj.n}</View>
            </View>
            <View className="at-col at-col-6">
              <View className="key">准考证号</View>
              <View>{obj.z}</View>
            </View>
          </View>
          <View className="at-row">
            <View className="at-col at-col__offset-1">
              <View className="key">考试类别</View>
              <View>英语六级</View>
            </View>
            <View className="at-col at-col-6">
              <View className="key">学校</View>
              <View>{obj.x}</View>
            </View>
          </View>
          <View className='line'></View>
          <View className='at-col at-col__offset-1'>
            <View className="key">笔试总分</View>
            <View className='big'>{obj.s}</View>
          </View>
          <View className='at-row'>
            <View></View>
          </View>
        </View>
      </View>
    )
  }
}
