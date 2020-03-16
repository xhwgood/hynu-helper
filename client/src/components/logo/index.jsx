import Taro, { PureComponent } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import logo from '@images/LOGO.jpg'
import './index.scss'

export default class Index extends PureComponent {
  render() {
    return (
      <View className='title'>
        {/* http://cdn.xianghw.xyz/LOGO.jpg */}
        <Image className='logo' src={logo} />
        <View className='desc'>为衡师人量身打造</View>
      </View>
    )
  }
}
