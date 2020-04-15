import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon, AtNoticebar } from 'taro-ui'
import ajax from '@utils/ajax'
import navigate from '@utils/navigate'
import noicon from '@utils/noicon'
import Card from '@components/treasure/card'
import { list } from './tList.js'
import { get as getGlobalData } from '@utils/global_data.js'
import './treasure.scss'
const db = wx.cloud.database()

export default class Treasure extends Taro.Component {
  config = {
    navigationBarTitleText: '衡师百宝箱'
  }

  state = {
    // 0：未登录，401：登录状态已过期，202：已登录教务处
    logged: 0,
    list: []
  }

  toFunc = text => Taro.navigateTo({ url: `/pages/treasure/${text}/${text}` })

  myFunc = item => {
    if (item.close) {
      noicon('此功能尚未开放！')
      return
    }
    const { logged } = this.state
    // 点击功能为教务处功能，且登录状态已过期
    if (item.jwc && logged != 202) {
      // 预先发送一个请求，判断是否已经登录
      const sessionid = Taro.getStorageSync('sid')
      const username = Taro.getStorageSync('username')
      if (sessionid) {
        const data = {
          func: 'getIDNum',
          data: {
            sessionid,
            username
          }
        }
        ajax('base', data)
          .then(res => {
            // 将返回状态码保存至 state
            this.setState({ logged: res.code })
            this.toFunc(item.icon)
          })
          .catch(err =>
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

  getWeather = () => {
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
  }

  componentWillMount() {
    this.getWeather()
    // 将 list 存储到云数据库中
    // db.collection('hynu-t-list')
    //   .get()
    //   .then(res => {
    //     this.setState({ list: res.data })
    //   })
  }
  componentDidShow() {
    if (getGlobalData('logged')) {
      this.setState({ logged: 202 })
    }
    // 显示最近的考试安排
    // const exam = Taro.getStorageSync('exam_arr')
    // this.setState({ exam })
  }

  onShareAppMessage() {
    return {
      title: '衡师百宝箱'
    }
  }

  render() {
    const { dayPictureUrl, weather, temperature, exam } = this.state

    return (
      <View>
        <View className='at-row'>
          衡师天气：
          <Image className='img' src={dayPictureUrl} />
          {weather}
          {temperature}
        </View>
        {/* {exam && (
          <AtNoticebar marquee>
            这是 NoticeBar 通告栏，这是 NoticeBar 通告栏，这是 NoticeBar 通告栏
          </AtNoticebar>
        )} */}
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
              <View>
                {item.text}
                {item.close && <Text className='close'>未开放</Text>}
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
        <Card />
      </View>
    )
  }
}
