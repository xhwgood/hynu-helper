import Taro, { PureComponent } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { bgColor } from '@styles/color.js'
import './index.scss'

export default class Index extends PureComponent {
  static defaultProps = {
    detail: {}
  }

  render() {
    const {
      endper,
      endterm,
      midper,
      midterm,
      peaceper,
      peacetime,
      credit,
      hour
    } = this.props.detail

    return (
      <View className='bottom' style={{ background: bgColor }}>
        <View className='at-row'>
          <View className='at-col'>学时：{hour}</View>
          <View className='at-col'>学分：{credit}</View>
        </View>
        <View className='at-row'>
          {endterm && <View className='at-col'>期末成绩：{endterm}</View>}
          {endper && <View className='at-col'>期末成绩比例：{endper}</View>}
        </View>
        <View className='at-row'>
          {peacetime && <View className='at-col'>平时成绩：{peacetime}</View>}
          {peaceper && <View className='at-col'>平时成绩比例：{peaceper}</View>}
        </View>
        <View className='at-row'>
          {midterm && <View className='at-col'>期中成绩：{midterm}</View>}
          {midper && <View className='at-col'>期中成绩比例：{midper}</View>}
        </View>
      </View>
    )
  }
}
