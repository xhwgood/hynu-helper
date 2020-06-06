import Taro, { getStorageSync, setStorageSync } from '@tarojs/taro'
import { View, Text, Navigator, Button, OpenData } from '@tarojs/components'
import { AtIcon, AtModal } from 'taro-ui'
import { set as setGlobalData } from '@utils/global_data.js'
import logList from './about/log-list'
import noicon from '@utils/noicon'
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
  imgs = ['north.png', 'gym.jpeg', 'snow-island.jpeg', 'snow1.jpeg']

  // 显示/隐藏清除缓存的模态框
  closeModal = () => this.setState({ opened: false })
  openModal = () => this.setState({ opened: true })
  // 确认清除缓存
  handleConfirm = () => {
    Taro.clearStorage({
      success: () => {
        this.closeModal()
        // 登录状态改为假，并重新启动至百宝箱页面
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
    const idx = getStorageSync('imgIdx') || 2
    // 只给用户提醒一次，之后不再提醒，除非清除缓存
    if (!getStorageSync('noastImg')) {
      noicon('点击上方图片可以切换喔~', 2300)
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
    const { opened, idx } = this.state
    const version = logList[0].version

    return (
      <View>
        <View
          className='profile-header'
          style={{
            background: `url(${CDN}/${this.imgs[idx]})`,
            backgroundSize: 'cover'
          }}
          onClick={this.changeBG}
        >
          <View className='avatar-url'>
            <OpenData type='userAvatarUrl' />
          </View>
          <OpenData type='userNickName' className='nickname fz36' />
        </View>
        <View className='nav bbox'>
          <Navigator hoverClass='none' className='nav-item' url='./about/about'>
            <Text className='text'>关于我的衡师</Text>
            <Text className='version'>{version}</Text>
          </Navigator>
          <View className='nav-item' onClick={this.openModal}>
            <View className='content text'>清除缓存</View>
            <AtIcon value='trash' size='22' color='#808080' />
          </View>
          <Button className='nav-item btn text' openType='contact'>
            意见反馈
            <AtIcon value='message' size='21' color='#808080' />
          </Button>
          <Button className='nav-item btn text' openType='share'>
            分享给好友
            <AtIcon value='share' size='22' color='#808080' />
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
