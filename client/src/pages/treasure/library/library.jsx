import Taro, { Component, getStorageSync } from '@tarojs/taro'
import { View, Text, Navigator } from '@tarojs/components'
import { AtCard, AtIcon } from 'taro-ui'
import List from '@components/treasure/library/list'
import ajax from '@utils/ajax'
import {
  set as setGlobalData,
  get as getGlobalData
} from '@utils/global_data'
import NoData from '@components/no-data'
import './library.scss'

export default class Library extends Component {
  config = {
    navigationBarTitleText: '图书馆'
  }

  state = {
    /** 图书证信息 */
    obj: {}
  }
  /**
   * 续借图书后更新还书日期
   * @param {string} id 图书ID
   * @param {string} date 还书日期 "2021-06-08"
   */
  updateReturnTime = (id, date) => {
    const { current } = this.state.obj
    const idx = current.findIndex(item => item.barcodeList == id)
    current[idx].returnTime = date
    this.setState({
      obj: {
        ...this.state.obj,
        current
      }
    })
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
        ajax('library', data).then(({ code, obj, libSid }) => {
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
    const currentType = typeof current

    return (
      <View className='library-container'>
        <View className='card-container'>
          <AtCard title='我的信息' isFull>
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
          hoverClass='none'
          className='bind c6 tac fz36'
        >
          {validity ? '查询历史借阅' : '绑定图书馆账号'}
          <AtIcon value='chevron-right' size='24' color='#808080' />
        </Navigator>

        <View className='his-title'>当前借阅：</View>
        {currentType == 'string' ? (
          <NoData txt={current} />
        ) : (
          <List list={current} updateReturnTime={this.updateReturnTime} />
        )}
      </View>
    )
  }
}
