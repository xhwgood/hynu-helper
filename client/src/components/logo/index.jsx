import Taro, { PureComponent } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.scss'

export default class Index extends PureComponent {
  render() {
    return (
      <View className='title'>
        <Image className='logo' src='http://cdn.xianghw.xyz/LOGO.jpg' />
        <View className='desc'>为衡师人量身打造</View>
      </View>
    )
  }
}
