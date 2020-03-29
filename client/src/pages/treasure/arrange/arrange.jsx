import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import slogan from '@utils/slogan.js'
import './arrange.scss'

export default class Arrange extends Component {
  config = {
    navigationBarBackgroundColor: '#769fcd',
    navigationBarTitleText: '考试安排',
    navigationBarTextStyle: 'white'
  }

  constructor(props) {
    super(props)
    const exam_arr = Taro.getStorageSync('exam_arr')
    this.state = {
      exam_arr
    }
  }

  add = () => {
    Taro.navigateTo({
      url: './add'
    })
  }

  onShareAppMessage() {
    return {
      title: slogan
    }
  }

  render() {
    const { exam_arr } = this.state

    return (
      <View className='arrange'>
        {exam_arr.length ? (
          exam_arr.map(item => (
            <View key={item.name} className='at-col'>
              <View className='name'>{item.name}</View>
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
          <View className='none'>还没有考试安排，快去添加吧</View>
        )}
        <View className='add-btn' onClick={this.add}>
          <View className='btn'>+</View>
        </View>
      </View>
    )
  }
}
