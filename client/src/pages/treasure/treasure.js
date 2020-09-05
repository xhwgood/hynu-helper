import Taro, { getStorageSync } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtIcon, AtNoticebar } from 'taro-ui'
import ajax from '@utils/ajax'
import { navigate, noicon } from '@utils/taroutils'
import Card from '@components/treasure/card'
import { list } from './tList.js'
import {
  get as getGlobalData,
  set as setGlobalData
} from '@utils/global_data.js'
import './treasure.scss'

const db = Taro.cloud.database()

export default class Treasure extends Taro.Component {
  config = {
    navigationBarTitleText: '衡师百宝箱'
  }

  state = {
    // 0：未登录，401：登录状态已过期，202：已登录教务处
    logged: 0,
    // 云数据库保存的数据
    funcIsOpen: {},
    // 近期考试安排
    exam: [],
    announce: {}
  }
  // 前往对应功能模块
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
  }
  // 点击功能模块后判断
  myFunc = item => {
    const { logged, funcIsOpen } = this.state
    if (!funcIsOpen[item.icon]) {
      noicon('此功能尚未开放！')
      return
    }
    // 点击功能为教务处功能，且登录状态已过期
    if (item.jwc && logged != 202) {
      // 预先发送一个请求，判断是否已经登录
      const sessionid = getStorageSync('sid')
      const username = getStorageSync('username')
      if (username) {
        const data = {
          func: 'getIDNum',
          data: {
            sessionid
          }
        }
        // 判断 sessionid 是否过期
        ajax('base', data)
          .then(res => {
            setGlobalData('sid', sessionid)
            setGlobalData('username', username)
            // 未过期，将返回状态码保存至 state
            this.setState({ logged: res.code })
            this.toFunc(item)
          })
          .catch(() =>
            // 已过期，将要跳转的页面保存至缓存
            Taro.setStorage({
              key: 'page',
              data: item
            })
          )
      } else {
        Taro.setStorage({
          key: 'page',
          data: item
        })
        navigate('请先绑定教务处', '../login/login')
      }
    } else {
      this.toFunc(item)
    }
  }
  // 天气接口
  getWeather = () =>
    Taro.request({
      url:
        'https://www.tianqiapi.com/free/day?appid=55165392&appsecret=FhEkBX4j&city=衡阳',
      success: res => {
        let { tem, tem_day, tem_night, wea_img } = res.data
        if (wea_img == 'yu') {
          wea_img = 'zhenyu'
        } else if (wea_img == 'yun') {
          wea_img = 'duoyun'
        }
        const range = ` ${tem_night}℃~${tem_day}℃`
        this.setState({
          range,
          tem,
          wea_img
        })
      }
    })

  componentWillMount() {
    this.getWeather()
    // 将 list 存储到云数据库中
    db.collection('hynu-t-list')
      .get()
      .then(res => this.setState({ funcIsOpen: res.data[0].isOpen }))
      .catch(() => {
        // 兼容没有云数据库的情况
        this.setState({
          funcIsOpen: {
            arrange: true,
            baoxiu: true,
            design: true,
            electives: true,
            evaluate: true,
            library: true,
            score: true,
            stu: true
          }
        })
      })
    // 读取数据库中的公告
    db.collection('announce')
      .get()
      .then(({ data }) => {
        const announce = data.find(item => item.isShow == true)
        this.setState({ announce })
      })
      .catch(() => console.error('没有云数据库集合-announce'))
    const autoTransferForm = getStorageSync('autoTransferForm')
    const { limitMoney, limitBalance, autoIsOpen, pwd } = autoTransferForm
    if (autoIsOpen) {
      const card = getStorageSync('card')
      if (card.balance < limitBalance) {
        const data = {
          func: 'bankTransfer',
          data: {
            AccNum: card.AccNum,
            MonTrans: limitMoney,
            Password: pwd
          }
        }
        ajax('card', data).then(res =>
          nocancel(
            `检测到你的校园卡余额低于${limitBalance}元，已为你自动充值${limitMoney}元`
          )
        )
      }
    }
  }
  componentDidShow() {
    if (getGlobalData('logged')) {
      this.setState({ logged: 202 })
    }
    // 显示最近的考试安排
    const exam = getStorageSync('exam_arr')
    this.setState({ exam })
  }
  onShareAppMessage() {
    return {
      title: '衡师百宝箱'
    }
  }

  render() {
    const { tem, exam, funcIsOpen, announce, range, wea_img } = this.state

    return (
      <View>
        {tem && (
          <View className='at-row bbox'>
            衡师天气：
            {tem + '℃'}
            <Image
              className='img'
              mode='aspectFit'
              src={`http://api.map.baidu.com/images/weather/day/${wea_img}.png`}
            />
            {range}
          </View>
        )}
        {exam && (
          <AtNoticebar icon='clock'>
            {exam.map(item => {
              let str = item.name + item.date
              if (item.date) {
                str += item.time
              }
              return str
            })}
          </AtNoticebar>
        )}
        {announce.isShow && (
          <AtNoticebar icon='volume-plus'>{announce.content}</AtNoticebar>
        )}
        <View className='treasure'>
          {list.map(item => (
            <View
              className='list fz36'
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
              <View>
                {item.text}
                {!funcIsOpen[item.icon] && (
                  <Text className='close'>未开放</Text>
                )}
              </View>
              <AtIcon
                value='chevron-right'
                size='28'
                color='#fff'
                className='right'
              />
            </View>
          ))}
        </View>
        {/* 校园卡组件 */}
        <Card />
      </View>
    )
  }
}
