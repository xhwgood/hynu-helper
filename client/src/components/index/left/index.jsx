import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classTime, markTime } from '@utils/data'
import './index.scss'

export default class Index extends Component {
  state = {
    timeMark: -1
  }

  componentWillMount() {
    this.getTime()
  }

  getTime = () => {
    const time = new Date()
    const nowMins = time.getHours() * 60 + time.getMinutes()
    // [510, 565, 630, 685, 870, 925, 990, 1045, 1170, 1225, 1270] 测试数据
    // const nowMins = 1170
    if (nowMins > markTime[10] || nowMins < markTime[0]) {
      // 如果不在白天上课时间内，则不进行计算
      return
    } else {
      for (let i = 0; i < 11; i++) {
        if (nowMins >= markTime[i] && nowMins < markTime[i + 1]) {
          this.setState({ timeMark: 8 })
          break
        }
      }
    }
  }

  render() {
    const { timeMark } = this.state
    return (
      <View className='left'>
        <View className='month'>
          <View>12</View>
          <View>月</View>
        </View>
        {classTime.map((item, idx) => (
          <View className={idx == timeMark ? 'active time-item' : 'time-item'} key={idx}>
            <View className='class-num'>{idx + 1}</View>
            <View>{item.begin}</View>
            <View>{item.end}</View>
          </View>
        ))}
      </View>
    )
  }
}
