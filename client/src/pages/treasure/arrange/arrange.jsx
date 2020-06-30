import Taro, { Component } from '@tarojs/taro'
import { View, Text, Navigator } from '@tarojs/components'
import './arrange.scss'

export default class Arrange extends Component {
  config = {
    navigationBarTitleText: '考试安排',
  }

  state = {
    exam_arr: []
  }

  componentDidShow() {
    const exam_arr = Taro.getStorageSync('exam_arr')
    this.setState({ exam_arr })
  }

  onShareAppMessage() {
    return {
      title: SLOGAN
    }
  }

  render() {
    const { exam_arr } = this.state

    return (
      <View>
        {exam_arr.length ? (
          exam_arr.map(item => (
            <View key={item.name} className='at-col'>
              <View className='name c6'>{item.name}</View>
              {item.date && (
                <View className='h'>
                  {item.date}
                  <Text className='ml'>{item.time}</Text>
                </View>
              )}
              {item.place && <View className='h grey'>{item.place}</View>}
              <View className='h grey'>{item.remind}</View>
            </View>
          ))
        ) : (
          <View className='none tac'>还没有考试安排，快去添加吧</View>
        )}
        {/* 添加考试安排 */}
        <Navigator className='add-btn' url='./add'>
          <View className='btn'>+</View>
        </Navigator>
      </View>
    )
  }
}
