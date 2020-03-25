import Taro from '@tarojs/taro'
import { View, Navigator } from '@tarojs/components'
import { AtIcon, AtNoticebar } from 'taro-ui'
import ajax from '@utils/ajax'
import navigate from '@utils/navigate'
import Card from '@components/treasure/card'
import { list } from './tList.js'
import {
  set as setGlobalData,
  get as getGlobalData
} from '@utils/global_data.js'
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

  getWeather = () => {
    Taro.request({
      url:
        'https://api.map.baidu.com/telematics/v3/weather?location=%E8%A1%A1%E9%98%B3&output=json&ak=Vyio0ANufplCdBocgtgGrn3oLaOwYN09',
      success: res => {
        const {
          dayPictureUrl,
          weather,
          temperature
        } = res.data.results[0].weather_data[0]
        this.setState({ dayPictureUrl, weather, temperature })
      }
    })
  }

  componentDidShow() {
    // console.log('百宝箱页面：', getGlobalData('logged'))
    if (getGlobalData('logged')) {
      this.setState({ logged: 202 })
    }
    this.getWeather()
    // 预先发送一个请求，判断是否已经登录？
    const sessionid = Taro.getStorageSync('sid')
    // 显示最近的考试安排
    // const exam = Taro.getStorageSync('exam_arr')
    // this.setState({ exam })
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
              {item.text}
            </View>
          ))}
        </View>
        <Card />
      </View>
    )
  }
}
