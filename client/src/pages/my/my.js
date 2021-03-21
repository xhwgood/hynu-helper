import Taro from '@tarojs/taro'
import {
  View,
  Text,
  Navigator,
  Button,
  OpenData,
  Swiper,
  SwiperItem,
  Image
} from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import logList from './about/log-list'
import {
  secondary_color80,
  primary_color,
  bgColor,
  secondary_colorE
} from '@styles/color'
import './my.scss'

export default class My extends Taro.Component {
  config = {
    navigationBarTitleText: '我的'
  }

  /** 背景图片数组 */
  imgs = ['gym.jpeg', 'snow-island.jpeg', 'snow1.jpeg']

  /**
   * 预览图片
   * @param {String} item
   */
  previewImg = item => {
    const urls = this.imgs.map(img => `${CDN}/${img}`)
    Taro.previewImage({
      current: `${CDN}/${item}`,
      urls
    })
  }

  onShareAppMessage() {
    return {
      title: SLOGAN,
      path: PATH,
      imageUrl: SHARE
    }
  }

  render() {
    const primary = {
      background: primary_color,
      color: secondary_color80,
      borderBottom: `1px solid ${secondary_colorE}`
    }
    /** 最新版本 */
    const { version } = logList[0]

    return (
      <View style={{ background: bgColor, height: '100vh' }}>
        <Swiper circular autoplay className='profile'>
          {this.imgs.map(item => (
            <SwiperItem key={item} onClick={this.previewImg.bind(this, item)}>
              <Image className='img' src={`${CDN}/${item}`} mode='aspectFill' />
            </SwiperItem>
          ))}
        </Swiper>
        <View className='open'>
          <View className='avatar-url'>
            <OpenData type='userAvatarUrl' />
          </View>
          <OpenData type='userNickName' className='nickname fz36' />
        </View>
        <View className='nav bbox'>
          <Navigator
            hoverClass='none'
            className='nav-item fz32'
            style={primary}
            url='./about/about'
          >
            <Text>关于我的衡师</Text>
            <Text>{version}</Text>
          </Navigator>
          <Button
            className='nav-item btn fz32'
            style={primary}
            openType='contact'
          >
            好不好用？吐槽一下
            <AtIcon
              value='message'
              style={primary}
              size='21'
              color={secondary_color80}
            />
          </Button>
          <Button
            className='nav-item btn fz32'
            style={primary}
            openType='share'
          >
            分享给好友
            <AtIcon value='share' size='22' color={secondary_color80} />
          </Button>
          <Navigator
            hoverClass='none'
            className='nav-item fz32'
            style={primary}
            url='./set/set'
          >
            <Text>设置（账号解绑）</Text>
            <AtIcon
              value='chevron-right'
              size='21'
              color={secondary_color80}
              className='right'
            />
          </Navigator>
          <Navigator
            hoverClass='none'
            className='nav-item fz32'
            style={primary}
            url='./faq/index'
          >
            <Text>常见问题解答</Text>
            <AtIcon
              value='chevron-right'
              size='21'
              color={secondary_color80}
              className='right'
            />
          </Navigator>
        </View>
      </View>
    )
  }
}
