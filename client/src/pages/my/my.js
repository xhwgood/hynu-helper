import Taro from '@tarojs/taro'
import { View, Text, Navigator, Button, OpenData } from '@tarojs/components'
import { AtIcon, AtModal } from 'taro-ui'
import './my.scss'

export default class My extends Taro.Component {
  config = {
    navigationBarTitleText: '我的'
  }

  state = {
    opened: false
  }

  handleCancel = () => this.setState({ opened: false })
  openModal = () => this.setState({ opened: true })

  handleConfirm = () => {
    Taro.clearStorage({
      success: () => {
        Taro.reLaunch({
          url: '../treasure/treasure'
        })
      }
    })
    this.handleCancel()
  }

  onShareAppMessage() {
    return {
      title: SLOGAN,
      path: PATH,
      imageUrl: SHARE
    }
  }

  render() {
    const { opened } = this.state

    return (
      <View>
        <View className='profile-header'>
          <View className='avatar-url'>
            <OpenData type='userAvatarUrl' />
          </View>
          <OpenData type='userNickName' className='nickname' />
        </View>
        <View className='nav bbox'>
          <View className='nav-item bbox'>
            <Navigator
              hover-className='none'
              className='content'
              url='./about/about'
            >
              <Text className='text'>关于</Text>
              <AtIcon
                value='chevron-right'
                size='25'
                color='#808080'
                className='right'
              />
            </Navigator>
          </View>
          <View className='nav-item'>
            <Navigator
              hover-className='none'
              className='content'
              url='./log/log'
            >
              <Text className='text'>更新日志</Text>
              <AtIcon
                value='chevron-right'
                size='25'
                color='#808080'
                className='right'
              />
            </Navigator>
          </View>
          <Button className='nav-item btn' openType='contact'>
            意见反馈
            <AtIcon value='chevron-right' size='25' color='#808080' />
          </Button>
          <View className='nav-item' onClick={this.openModal}>
            <View hover-className='none' className='content'>
              <Text className='text'>清除缓存</Text>
            </View>
          </View>
          <Button className='nav-item btn' openType='share'>
            分享给好友
          </Button>
        </View>

        <AtModal
          isOpened={opened}
          cancelText='取消'
          confirmText='确定'
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
          content='将会清除所有缓存数据及已经绑定的账号！在出现异常情况时建议使用'
        />
      </View>
    )
  }
}
