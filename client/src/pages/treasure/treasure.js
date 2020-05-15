import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtIcon, AtNoticebar } from 'taro-ui'
import ajax from '@utils/ajax'
import navigate from '@utils/navigate'
import noicon from '@utils/noicon'
import Card from '@components/treasure/card'
import { list } from './tList.js'
import { get as getGlobalData } from '@utils/global_data.js'
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
    exam: []
  }
  // 前往对应功能模块
  toFunc = text => Taro.navigateTo({ url: `/pages/treasure/${text}/${text}` })
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
      const sessionid = getGlobalData('sid')
      const username = getGlobalData('username')
      if (sessionid) {
        const data = {
          func: 'getIDNum',
          data: {
            sessionid,
            username
          }
        }
        // 判断 sessionid 是否过期
        ajax('base', data)
          .then(res => {
            // 未过期，将返回状态码保存至 state
            this.setState({ logged: res.code })
            this.toFunc(item.icon)
          })
          .catch(() =>
            // 已过期，将要跳转的页面保存至缓存
            Taro.setStorage({
              key: 'page',
              data: item.icon
            })
          )
      } else {
        Taro.setStorage({
          key: 'page',
          data: item.icon
        })
        navigate('请先绑定教务处', '../login/login')
      }
    } else {
      this.toFunc(item.icon)
    }
  }
  // 百度天气接口
  getWeather = () =>
    Taro.request({
      url:
        'https://api.map.baidu.com/telematics/v3/weather?location=%E8%A1%A1%E9%98%B3&output=json&ak=Vyio0ANufplCdBocgtgGrn3oLaOwYN09',
      success: res => {
        let {
          dayPictureUrl,
          weather,
          temperature
        } = res.data.results[0].weather_data[0]
        const tempArr = temperature.match(/\d+/g)
        temperature = `${tempArr[1]} ~ ${tempArr[0]}℃`
        this.setState({ dayPictureUrl, weather, temperature })
      }
    })

  componentWillMount() {
    this.getWeather()
    // 将 list 存储到云数据库中
    db.collection('hynu-t-list')
      .get()
      .then(res => this.setState({ funcIsOpen: res.data[0].isOpen }))
  }
  componentDidShow() {
    if (getGlobalData('logged')) {
      this.setState({ logged: 202 })
    }
    // 显示最近的考试安排
    const exam = Taro.getStorageSync('exam_arr')
    this.setState({ exam })
  }
  onShareAppMessage() {
    return {
      title: '衡师百宝箱'
    }
  }

  render() {
    const { dayPictureUrl, weather, temperature, exam, funcIsOpen } = this.state

    return (
      <View>
        <View className='at-row bbox'>
          衡师天气：
          <Image className='img' src={dayPictureUrl} />
          {weather}
          {temperature}
        </View>
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
