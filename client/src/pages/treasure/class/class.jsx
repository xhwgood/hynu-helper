import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import './class.scss'

export default class Class extends Component {
  config = {
    navigationBarBackgroundColor: '#254b62',
    navigationBarTitleText: '寻课',
    navigationBarTextStyle: 'white'
  }

  state = {
    current: 1
  }

  handleClick = v => this.setState({ current: v })

  onShareAppMessage() {
    return {
      title: '衡师精彩尽在《我的衡师》'
    }
  }

  render() {
    const tabList = [
      { title: '按行政班级' },
      { title: '按教师' },
      { title: '按教室' }
    ]
    const { current } = this.state
    return (
      <AtTabs current={current} tabList={tabList} onClick={this.handleClick}>
        <AtTabsPane current={current} index={0}>
          <View className='tabs'>按行政班级</View>
        </AtTabsPane>
        <AtTabsPane current={current} index={1}>
          <View className='tabs'>按教师</View>
        </AtTabsPane>
        <AtTabsPane current={current} index={2}>
          <View className='tabs'>按教室</View>
        </AtTabsPane>
      </AtTabs>
    )
  }
}
