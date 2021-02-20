import Taro, {
  Component,
  removeStorageSync,
  getStorageSync
} from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import {
  secondary_colorE,
  primary_color,
  secondary_color80,
  bgColor
} from '@styles/color'
import { showError, navigate } from '@utils/taroutils'
import {
  set as setGlobalData,
  globalData,
  get as getGlobalData
} from '@utils/global_data'
import '../my.scss'
import { AtIcon } from 'taro-ui'

export default class Set extends Component {
  config = {
    navigationBarBackgroundColor: '#A80000',
    navigationBarTitleText: '设置',
    navigationBarTextStyle: 'white'
  }

  constructor() {
    const card = getStorageSync('card') || {}
    const libUsername = getStorageSync('libUsername')

    this.state = {
      card,
      libUsername,
      logged: getGlobalData('logged')
    }
  }
  /**
   * 账号解绑
   * @param {string} name 要解绑的项
   */
  handleUnbind = name => {
    Taro.showModal({
      content:
        name == 'all' ? '确认清空缓存并解绑所有账号吗？' : '确认解绑吗？',
      success: res => {
        if (res.confirm) {
          switch (name) {
            case 'all':
              Taro.clearStorageSync()
              break
            case 'library':
              removeStorageSync('libPass')
              removeStorageSync('libUsername')
              break
            case 'card':
              removeStorageSync('card')
              removeStorageSync('qrCode')
              removeStorageSync('autoTransferForm')
              removeStorageSync('transfer_info_has_show')
              break

            default:
              break
          }
          // 清除全局数据，并重启至首页
          Object.keys(globalData).forEach(data => setGlobalData(data, null))
          Taro.reLaunch({
            url: PATH
          })
        }
      }
    })
  }

  componentDidShow() {
    this.setState({
      logged: getGlobalData('logged')
    })
  }

  render() {
    const primary = {
      background: primary_color,
      color: secondary_color80,
      borderBottom: `1px solid ${secondary_colorE}`
    }
    const { logged, libUsername, card } = this.state

    return (
      <View
        style={{ background: bgColor, height: '100vh', paddingTop: '30rpx' }}
        className='set'
      >
        <View className='nav bbox'>
          <Button
            className='nav-item btn fz32'
            style={primary}
            onClick={() => this.handleUnbind('all')}
          >
            清除缓存并解绑所有账号
          </Button>
        </View>
        <View className='title'>教务处</View>
        <View className='nav bbox'>
          <Button
            className='nav-item btn fz32'
            style={primary}
            onClick={() => {
              logged
                ? Taro.navigateTo('../changePass/changePass')
                : navigate('请先登录教务处', '../../login/login')
            }}
          >
            修改密码
            {logged ? (
              <AtIcon
                value='chevron-right'
                size='21'
                color={secondary_color80}
                className='right'
              />
            ) : (
              <Text>请先登录</Text>
            )}
          </Button>
        </View>
        <View className='title'>校园卡</View>
        <View className='nav bbox'>
          <Button
            className='nav-item btn fz32'
            style={primary}
            onClick={() => {
              card.AccName
                ? this.handleUnbind('card')
                : showError('未绑定校园卡')
            }}
          >
            账号解绑
            <Text>{card.AccName || '未绑定'}</Text>
          </Button>
        </View>
        <View className='title'>图书馆</View>
        <View className='nav bbox'>
          <Button
            className='nav-item btn fz32'
            style={primary}
            onClick={() => {
              libUsername
                ? this.handleUnbind('library')
                : showError('未绑定图书馆')
            }}
          >
            账号解绑
            <Text>{libUsername || '未绑定'}</Text>
          </Button>
        </View>
      </View>
    )
  }
}
