import Taro from '@tarojs/taro'
import { View, Text, Navigator, Button, OpenData } from '@tarojs/components'
import { AtIcon, AtModal } from 'taro-ui'
import './my.scss'
// import {
//   set as setGlobalData,
//   get as getGlobalData
// } from '@utils/global_data.js'

export default class My extends Taro.Component {
  config = {
    navigationBarTitleText: '我的'
  }

  state = {
    nickName: '',
    logged: false,
    opened: false
  }

  handleCancel = () => {
    this.setState({ opened: false })
  }
  openModal = () => {
    this.setState({ opened: true })
  }
  handleConfirm = () => {
    Taro.clearStorageSync()
    this.setState({ opened: false })
  }

  feedback = e => {
    console.log(e)
  }

  render() {
    const { opened } = this.state
    return (
      <View>
        <View className="profile-header">
          <View className="avatar-url">
            <OpenData type="userAvatarUrl"></OpenData>
          </View>
          <OpenData type="userNickName" className="nickname"></OpenData>
        </View>
        <View className="nav">
          {/* <View className="nav-item">
            <Navigator
              hover-className="none"
              className="content"
              url=""
            >
              <Text className="text">我的信息</Text>
            </Navigator>
          </View> */}
          <View className="nav-item">
            <Navigator
              hover-className="none"
              className="content"
              url="./about/about"
            >
              <Text className="text">关于</Text>
              <AtIcon
                value="chevron-right"
                size="25"
                color="#808080"
                className="right"
              />
            </Navigator>
          </View>
          <View className="nav-item" onClick={this.openModal}>
            <View hover-className="none" className="content">
              <Text className="text">清除缓存</Text>
            </View>
          </View>
          <Button
            className="nav-item btn"
            onClick={this.feedback}
            openType="feedback"
          >
            反馈
            <AtIcon value="chevron-right" size="25" color="#808080" />
          </Button>
        </View>

        <AtModal
          isOpened={opened}
          cancelText="取消"
          confirmText="确定"
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
          content="你确定要清除吗？"
        />
      </View>
    )
  }
}
