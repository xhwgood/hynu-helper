import Taro, { PureComponent } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import logList from '../../pages/my/about/log-list'
import './index.scss'

export default class Index extends PureComponent {
  render() {
    return (
      <View className='title'>
        <View className='top'>
          <Image className='logo' src={`${CDN}/LOGO.png`} />
          <View className='version'>{logList[0].version}</View>
        </View>
        <View className='desc'>{SLOGAN}</View>
      </View>
    )
  }
}
