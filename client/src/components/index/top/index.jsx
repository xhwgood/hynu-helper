import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { day } from '@utils/data'
import ajax from '@utils/ajax'
import { navigate, showError } from '@utils/taroutils'
import {
  set as setGlobalData,
  get as getGlobalData
} from '@utils/global_data.js'
import { primary_color, major_color } from '@styles/color.js'
import './index.scss'

export default class Index extends PureComponent {
  constructor(props) {
    super(props)
    let text = '绑定教务处'
    if (Taro.getStorageSync('sid')) {
      text = '获取最新'
    }
    this.state = {
      text
    }
  }
  static defaultProps = {
    now: {},
    logged: false
  }
  // 获取本学期课程
  getClass = () => {
    if (this.state.text == '获取最新' && getGlobalData('sid')) {
      if (getGlobalData('isGettedClassData')) {
        showError('已成功获取，请勿重复操作~')
      } else {
        const data = this.props.getClassData()
        ajax('base', data).then(res => {
          const { myClass } = res
          if (myClass) {
            Taro.removeStorageSync('allWeek')
            Taro.setStorageSync('myClass', myClass)
            this.props.dealClassCalendar(myClass)
            setGlobalData('isGettedClassData', true)
          } else {
            navigate('登录状态已过期', '../login/login?getClass=1')
          }
        })
      }
    } else {
      Taro.navigateTo({
        url: '../login/login?getClass=1'
      })
    }
  }

  componentDidShow() {
    if (getGlobalData('logged')) {
      this.setState({ text: '获取最新' })
    }
  }

  render() {
    const { now, showDrawer, showChangeWeek, weekIsChange } = this.props
    const { text } = this.state

    return (
      <View className='top' style={{ background: primary_color }}>
        {/* 左 */}
        <View className='set' onClick={showDrawer}>
          <AtIcon value='settings' size='19' color={major_color} />
          <Text className='txt'>设置</Text>
        </View>
        {/* 中 */}
        <View className='main' onClick={showChangeWeek}>
          {now.week >= 0 ? (
            weekIsChange ? (
              <Text style='color: #ed5736'>第{now.week + 1}周</Text>
            ) : (
              `第${now.week + 1}周 ${day[now.day]}`
            )
          ) : (
            '现在是假期~'
          )}
          <AtIcon
            value='chevron-down'
            size='19'
            color={weekIsChange ? '#ed5736' : major_color}
          />
        </View>
        {/* 右 */}
        <View className='right' onClick={this.getClass}>
          {text}
        </View>
      </View>
    )
  }
}
