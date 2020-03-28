import Taro, { PureComponent } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.scss'

export default class Index extends PureComponent {
  render() {
    return (
      <View className='title'>
        <Image className='logo' src='http://cdn.xianghw.xyz/LOGO.png' />
        <View className='desc'>衡师精彩尽在我的衡师</View>
      </View>
    )
  }
}
