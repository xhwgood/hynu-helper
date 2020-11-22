import Taro, { Component } from '@tarojs/taro'
import { View, Text, Navigator } from '@tarojs/components'
import { secondary_color8 } from '@styles/color.js'
import { get as getGlobalData } from '@utils/global_data.js'
import { noicon } from '@utils/taroutils'
import './arrange.scss'

export default class Arrange extends Component {
  config = {
    navigationBarTitleText: '考试安排'
  }

  state = {
    exam_arr: []
  }
  /** 编辑该考试安排 */
  editArrange = arrange => {
    this.$preload('arrange', arrange)
    Taro.navigateTo({
      url: `./set`
    })
  }

  componentDidShow() {
    const exam_arr = Taro.getStorageSync('exam_arr')
    this.setState({ exam_arr })
    if (getGlobalData('refresh_exam_treasure')) {
      noicon('点击你添加的考试安排可进入编辑', 3000)
    }
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
        <View
          className='fz30'
          style={{ color: secondary_color8, marginLeft: '10rpx' }}
        >
          添加完成后，将在百宝箱页显示本学期的考试安排
        </View>
        {exam_arr.length ? (
          exam_arr.map(item => (
            <View
              key={item.name}
              className='at-col fz30'
              onClick={this.editArrange.bind(this, item)}
            >
              <View className='name c6'>{item.name}</View>
              <View className='h'>
                {item.date ? item.date : '未选择考试日期'}
                {item.date && <Text className='ml'>{item.time}</Text>}
              </View>
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
