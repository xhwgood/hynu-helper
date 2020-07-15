import Taro, { getStorageSync, setStorageSync } from '@tarojs/taro'
import { View, Text, Navigator, Button, OpenData } from '@tarojs/components'
import { AtIcon, AtModal } from 'taro-ui'
import { set as setGlobalData } from '@utils/global_data.js'
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
  imgs = ['semi-library.jpeg', 'gym.jpeg', 'snow-island.jpeg', 'snow1.jpeg']

  // 显示/隐藏清除缓存的模态框
  closeModal = () => this.setState({ opened: false })
  openModal = () => this.setState({ opened: true })
  // 确认清除缓存
  handleConfirm = () => {
    Taro.clearStorage({
      success: () => {
        this.closeModal()
        // 清除全局数据，并重新启动至百宝箱页面
        setGlobalData('logged', false)
        setGlobalData('all_score', null)
        Taro.reLaunch({
          url: '../treasure/treasure'
        })
      }
    })
  }
  // 切换头像背景图片
  changeBG = () => {
    let { idx } = this.state
    if (idx == 3) {
      idx = 0
    } else {
      idx++
    }
    this.setState({ idx })
    setStorageSync('imgIdx', idx)
  }

  componentWillMount() {
    const idx = getStorageSync('imgIdx') || 0
    // 只给用户提醒一次，之后不再提醒，除非清除缓存
    if (!getStorageSync('noastImg')) {
      noicon('点击上方图片可以切换喔~', 2600)
      setStorageSync('noastImg', true)
    }
    this.setState({ idx })
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
    const { opened, idx } = this.state
    const version = logList[0].version

    return (
      <View style={{ background: bgColor, height: '100vh' }}>
        <View
          className='profile-header'
          style={{
            background: `url(${CDN}/${this.imgs[idx]})`,
            backgroundSize: 'cover',
            color: primary_color
          }}
          onClick={this.changeBG}
        >
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
            <View className='content fz32'>清除缓存</View>
            <AtIcon value='trash' size='22' color={secondary_color80} />
          </View>
          <Button
            className='nav-item btn fz32'
            style={primary}
            openType='contact'
          >
            意见反馈
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
