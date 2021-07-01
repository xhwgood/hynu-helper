// @ts-check
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { faq } from './faq'
import { secondary_color3, bgColorFE, secondary_color6 } from '@styles/color'
import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarBackgroundColor: '#FF0302',
    navigationBarTitleText: '常见问题解答',
    navigationBarTextStyle: 'white'
  }

  render() {
    return (
      <View className='faq' style={{ background: bgColorFE, minHeight: '100vh' }}>
        <View className='title fz36'>这里列出了经常被同学们问到的问题，如果你还有疑问，请返回上一页点击吐槽</View>
        {faq.map((item, idx) => (
          <View className='item'>
            <View className='question' style={{ color: secondary_color3 }}>
              {idx + 1}、{item.question}
            </View>
            <View className='answer fz30' style={{ color: secondary_color6 }}>
              {item.answer}
            </View>
          </View>
        ))}
      </View>
    )
  }
}
