import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
// import { AtFab } from 'taro-ui'
import './arrange.scss'

export default class Arrange extends Component {
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

  render() {
    const { exam_arr } = this.state

    return (
      <View className='arrange'>
        {exam_arr.length ? (
          exam_arr.map(item=>(
            <View></View>
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
