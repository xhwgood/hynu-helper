import Taro from '@tarojs/taro'
import { View, Text, Navigator, Button, OpenData } from '@tarojs/components'
import { AtIcon, AtModal } from 'taro-ui'
import './my.scss'
import {
  set as setGlobalData,
  get as getGlobalData
} from '@utils/global_data.js'

export default class My extends Taro.Component {
  config = {
    navigationBarTitleText: '我的'
  }

  state = {
    nickName: '',
    logged: false,
    opened: false
  }

  goInfo = () => {
    if (this.state.logged) {
      Taro.navigateTo({ url: '/pages/login/login?office=1' })
    } else {
      Taro.showToast({ title: '请先点击上放按钮进行授权', icon: 'none' })
    }
  }
  handleCancel = () => {
    this.setState({ opened: false })
  }
  openModal = () => {
    this.setState({ opened: true })
  }
  clearStorage = () => {
    Taro.clearStorageSync()
  }

  render() {
    return (
      <View>
        <View className="profile-header">
          <View className="avatar-url">
            <OpenData type="userAvatarUrl"></OpenData>
          </View>
          <OpenData type="userNickName" className="nickname"></OpenData>
        </View>
        <View className="nav">
          <View className="nav-item">
            <Navigator
              hover-className="none"
              className="content"
              url="../profile-play/profile-play"
            >
              <Text className="text">我的信息</Text>
            </Navigator>
          </View>
          <View className="nav-item">
            <Navigator
              hover-className="none"
              className="content"
              url="../profile-blog/profile-blog"
            >
              <Text className="text">反馈</Text>
            </Navigator>
          </View>
          <View className="nav-item">
            <Navigator
              hover-className="none"
              className="content"
              url="./about/about"
            >
              <Text className="text">关于</Text>
            </Navigator>
          </View>
          <View className="nav-item">
            <View hover-className="none" className="content">
              <Text className="text">清除缓存</Text>
            </View>
          </View>
        </View>

        {/* <AtModal
          isOpened={opened}
          cancelText="取消"
          confirmText="确定"
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
          content="你确定要解除绑定吗？"
        /> */}
      </View>
    )
  }
}
