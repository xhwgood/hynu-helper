import Taro, { PureComponent } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classTime, markTime } from '@utils/data'
import { time_color, activeBG } from '@styles/color.js'
import './index.scss'

export default class Index extends PureComponent {
  state = {
    timeMark: -1
  }

  componentWillMount() {
    this.getTime()
    const month = new Date().getMonth()
    this.setState({ month })
  }
  // 得到当前时间，高亮相应的上课节次
  getTime = () => {
    const time = new Date()
    const nowMins = time.getHours() * 60 + time.getMinutes()
    // [510, 565, 630, 685, 870, 925, 990, 1045, 1170, 1225, 1270] 测试数据
    // const nowMins = 1170
    if (nowMins > markTime[10] || nowMins < markTime[0]) {
      // 如果不在白天上课时间内，则不进行计算
      return
    } else {
      for (let i = 0; i < markTime.length; i++) {
        if (nowMins >= markTime[i] && nowMins < markTime[i + 1]) {
          this.setState({ timeMark: i })
          break
        }
      }
    }
  }

  render() {
    const { timeMark, month } = this.state

    return (
      <View className='left'>
        <View className='month'>{month + 1}月</View>
        <View className='container'>
          {classTime.map((item, idx) => (
            <View
              className={idx == timeMark ? 'active time-item' : 'time-item'}
              style={{
                background: idx == timeMark ? activeBG : '',
                color: time_color
              }}
              key={idx}
            >
              <View className='class-num'>{idx + 1}</View>
              <View>{item.begin}</View>
              <View>{item.end}</View>
            </View>
          ))}
        </View>
      </View>
    )
  }
}
