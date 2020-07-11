import Taro, { PureComponent } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import logList from '../../pages/my/about/log-list'
import './index.scss'

export default class Index extends PureComponent {
  toAbout = () => {
    const current = Taro.getCurrentPages()
    const url = 'pages/my/about/about'
    if (current[current.length - 1].route !== url) {
      Taro.navigateTo({ url: `/${url}` })
    }
  }

  render() {
    return (
      <View className='title'>
        <View className='top' onClick={this.toAbout}>
          <Image className='logo' src={`${CDN}/LOGO-SLOGAN.png`} />
          <View className='version'>{logList[0].version}</View>
        </View>
      </View>
    )
  }
}
