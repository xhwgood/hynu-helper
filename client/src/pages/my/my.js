import Taro, { getStorageSync, setStorageSync } from '@tarojs/taro'
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
import { AtIcon, AtModal } from 'taro-ui'
import { set as setGlobalData, globalData } from '@utils/global_data.js'
import logList from './about/log-list'
import { noicon } from '@utils/taroutils'
import {
  secondary_color80,
  primary_color,
  bgColor,
  secondary_colorE
} from '@styles/color.js'
import './my.scss'

export default class My extends Taro.Component {
  config = {
    navigationBarTitleText: '我的'
  }

  state = {
    // 清除缓存的模态框显隐
    opened: false
  }
  // 背景图片数组
  imgs = ['gym.jpeg', 'snow-island.jpeg', 'snow1.jpeg']

  // 显示/隐藏清除缓存的模态框
  closeModal = () => this.setState({ opened: false })
  openModal = () => this.setState({ opened: true })
  // 确认清除缓存
  handleConfirm = () =>
    Taro.clearStorage({
      success: () => {
        this.closeModal()
        // 清除全局数据，并重启至首页
        Object.keys(globalData).forEach(data => setGlobalData(data, null))
        Taro.reLaunch({
          url: PATH
        })
      }
    })

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

  componentWillMount() {
    // 只给用户提醒一次，之后不再提醒，除非清除缓存
    if (!getStorageSync('noastImg-new')) {
      noicon('上方图片可以左右切换噢~', 2600)
      setStorageSync('noastImg-new', true)
    }
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
    const { opened } = this.state
    const version = logList[0].version

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
          <View className='nav-item' style={primary} onClick={this.openModal}>
            <View className='content fz32'>清除缓存/账号解绑</View>
            <AtIcon value='trash' size='22' color={secondary_color80} />
          </View>
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
        </View>
        {/* 清除缓存模态框 */}
        <AtModal
          isOpened={opened}
          cancelText='取消'
          confirmText='确定'
          onCancel={this.closeModal}
          onConfirm={this.handleConfirm}
          content='将会清除所有缓存数据及已经绑定的账号！在出现异常情况时建议使用'
        />
      </View>
    )
  }
}
