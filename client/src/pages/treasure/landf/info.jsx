import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './info.scss'

export default class Info extends Component {
  imageTap = (e) => {

  }

  render() {
    return (
      <View className='info'>
        <View className='user'>
          <Image className='avatar' src='https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJq2tnEo7HvKYK0kxImXYsB5hueKY5mt7HfzfrYjz8FILSu8Iv8THckaNibfiaWkMNlkQMExuzl7zrA/132' />
          <View className='user-info'>
            <View className='name'>
              <View className='detail'>项鸿伟</View>
              <View className='college'>计算机科学与技术学院</View>
            </View>
            <View className='detail'>现在</View>
          </View>
        </View>
        <View className='content'>
          <View>测试我丢了什么东西？</View>
          <View className='image-list'>
            <Image mode="aspectFill" src='https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJq2tnEo7HvKYK0kxImXYsB5hueKY5mt7HfzfrYjz8FILSu8Iv8THckaNibfiaWkMNlkQMExuzl7zrA/132' onClick={this.imageTap.bind(this, true)} />
          </View>
        </View>
        <View className='comment'>
          评论
        </View>
      </View>
    )
  }
}
