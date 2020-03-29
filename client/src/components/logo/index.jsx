import Taro, { PureComponent } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import slogan from '@utils/slogan.js'
import './index.scss'

export default class Index extends PureComponent {
  render() {
    return (
      <View className='title'>
        <Image className='logo' src='http://cdn.xianghw.xyz/LOGO.png' />
        <View className='desc'>{slogan}</View>
      </View>
    )
  }
}
