import Taro from '@tarojs/taro'
import { View, Navigator } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import ajax from '@utils/ajax'
import navigate from '@utils/navigate'
import Card from '@components/treasure/card'
import { list } from './tList.js'
import './treasure.scss'

export default class Treasure extends Taro.Component {
  config = {
    navigationBarTitleText: '百宝箱'
  }

  state = {
    // 0：未登录，401：登录状态已过期，202：已登录教务处
    logged: 0
  }

  toFunc = item => {
    Taro.navigateTo({ url: `/pages/treasure/${item.icon}/${item.icon}` })
    // 变化当前导航条的颜色和标题
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: item.bgc,
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    Taro.setNavigationBarTitle({ title: String(item.text) })
  }

  myFunc = item => {
    const { logged } = this.state
    // 是否为教务处功能
    if (item.jwc) {
      if (logged != 0) {
        // ajax
        logged == 401
          ? navigate('登录状态已过期', '../login/login')
          : this.toFunc(item)
      } else {
        navigate('请先登录教务处', '../login/login')
      }
    } else {
      this.toFunc(item)
    }
  }

  componentDidShow() {
    // 预先发送一个请求，判断是否已经登录？
    const sessionid = Taro.getStorageSync('sid')
    if (sessionid) {
      const data = {
        func: 'getIDNum',
        data: {
          sessionid
        }
      }
      ajax('base', data).then(res => {
        // 将返回状态码保存至 state
        this.setState({ logged: res.code })
      })
    }
  }

  render() {
    return (
      <View>
        <View className='treasure'>
          {list.map(item => (
            <View
              className='list'
              style={{ background: item.bgc }}
              onClick={this.myFunc.bind(this, item)}
              key={String(item.bgc)}
            >
              <AtIcon
                prefixClass='icon'
                value={item.icon}
                size='23'
                color='#fff'
              />
              {item.text}
            </View>
          ))}
        </View>
        <Card />
      </View>
    )
  }
}
