import Taro, { Component, setStorageSync, getStorageSync } from '@tarojs/taro'
import { View, Text, Navigator } from '@tarojs/components'
import { AtCard, AtIcon } from 'taro-ui'
import Item from '@components/treasure/library/item'
import ajax from '@utils/ajax'
import {
  set as setGlobalData,
  get as getGlobalData
} from '@utils/global_data.js'
import './library.scss'

export default class Library extends Component {
  config = {
    navigationBarBackgroundColor: '#a3c6c4',
    navigationBarTitleText: '图书馆',
    navigationBarTextStyle: 'white'
  }

  state = {
    // 图书证信息
    obj: {}
  }
  componentDidShow() {
    // 若有全局状态：图书馆数据
    if (getGlobalData('libObj')) {
      this.setState({ obj: getGlobalData('libObj') })
    } else {
      // 若没有，就重新登录
      const rdid = getStorageSync('libUsername')
      const password = getStorageSync('libPass')
      if (password) {
        const data = {
          func: 'login',
          data: {
            rdid,
            password
          }
        }
        ajax('library', data).then(res => {
          const { code, obj, libSid } = res
          // 登录成功
          if (code == 200) {
            this.setState({ obj })
            setGlobalData('libObj', obj)
            setGlobalData('libSid', libSid)
          }
        })
      }
    }
  }

  onShareAppMessage() {
    return {
      title: SLOGAN
    }
  }

  render() {
    const { canBorrow, validity, arrears, charge, current } = this.state.obj
    const type = typeof current

    return (
      <View>
        <View className='card-container'>
          <AtCard title='我的借阅信息' isFull>
            <View>已借/可借：{canBorrow}</View>
            <View>图书证有效期：{validity}</View>
            <View className='at-row'>
              <Text className='at-col'>欠款：{arrears}￥</Text>
              <Text className='at-col'>预付款：{charge}￥</Text>
            </View>
          </AtCard>
        </View>

        <Navigator
          url={validity ? './history' : './login'}
          className='bind c6 tac fz36'
        >
          {validity ? '查询历史借阅' : '绑定图书馆账号'}
          <AtIcon value='chevron-right' size='25' color='#808080' />
        </Navigator>

        <View className='his-title'>当前借阅：</View>
        {type == 'string' ? (
          <View className='bind'>{current}</View>
        ) : (
          <Item list={current} />
        )}
      </View>
    )
  }
}
