import Taro, { PureComponent } from '@tarojs/taro'
import { AtDrawer, AtList, AtListItem, AtRadio, AtAccordion } from 'taro-ui'
import { View, Text, Picker } from '@tarojs/components'
import ajax from '@utils/ajax'
import { get as getGlobalData } from '@utils/global_data.js'
import navigate from '@utils/navigate'
import './index.scss'

export default class Index extends PureComponent {
  constructor(props) {
    super(props)
    const termList = Taro.getStorageSync('termList') || []
    const value = Taro.getStorageSync('value') || ''
    const firstIdx = Taro.getStorageSync('firstIdx') || 2

    this.state = {
      open: true,
      termList,
      value,
      mondays: [],
      firstIdx
    }
  }

  static defaultProps = {
    setting: {},
    handleSetting: () => {}
  }

  getTermList = () => {
    const myterm = Taro.getStorageSync('myterm')
    const termList = []
    let value
    if (myterm) {
      const keys = Object.keys(myterm)
      const values = Object.values(myterm)
      for (let i = keys.length - 1; i >= 0; i--) {
        termList.push({
          value: keys[i],
          label: values[i]
        })
      }
      value = keys[keys.length - 1]
    }
    Taro.setStorageSync('termList', termList)
    if (!Taro.getStorageSync('value')) {
      Taro.setStorageSync('value', value)
      this.setState({ value })
    }
    this.setState({ termList })
  }

  selectTerm = v => {
    if (v == this.state.value) {
      return
    }
    const sessionid = Taro.getStorageSync('sid')
    // const xsid = Taro.getStorageSync('xsid')
    const data = {
      func: 'changeClass',
      data: {
        sessionid,
        xnxqh: v
      }
    }
    ajax('base', data).then(res => {
      if (res.code == 401) {
        navigate('登录状态已过期，需重新登录', '../login/login')
      } else {
        this.setState({ value: v })
        Taro.removeStorageSync('allWeek')
        const { myClass } = res
        Taro.setStorageSync('myClass', myClass)
        Taro.setStorage({
          key: 'value',
          data: v
        })
        this.props.dealClassCalendar(myClass)
      }
      this.props.closeDrawer()
    })
  }

  openTerm = () =>
    this.setState(preState => ({
      open: !preState.open
    }))

  changeFirstDay = e => {
    this.setState({ firstIdx: e.detail.value })
    Taro.setStorageSync('firstIdx', e.detail.value)
    this.props.calculateSchool(this.state.mondays[e.detail.value])
    this.props.closeDrawer()
  }

  calculateFirst = () => {
    const newD = new Date()
    const newMonth = newD.getMonth()
    const newYear = newD.getFullYear()
    let d
    if (newMonth >= 1 && newMonth <= 6) {
      d = new Date(newYear, 1)
    } else if (newMonth == 0) {
      d = new Date(newYear - 1, 8)
    } else {
      d = new Date(newYear, 8)
    }
    const month = d.getMonth()
    const mondays = []

    d.setDate(1)
    // 得到本月第一个周一
    while (d.getDay() !== 1) {
      d.setDate(d.getDate() + 1)
    }
    // 得到所有其他的周一
    while (d.getMonth() === month) {
      const getTime = new Date(d.getTime())
      mondays.push(`${getTime.getMonth() + 1}月${getTime.getDate()}日`)
      d.setDate(d.getDate() + 7)
    }
    this.setState({ mondays })
  }

  componentDidShow() {
    if (getGlobalData('logged') || Taro.getStorageSync('myterm')) {
      this.getTermList()
    }
    this.calculateFirst()
  }

  render() {
    const { show, handleSetting, setting, closeDrawer } = this.props
    const { termList, value, open, mondays, firstIdx } = this.state

    return (
      <AtDrawer mask show={show} width='520rpx' onClose={closeDrawer}>
        <AtList>
          <AtListItem
            title='显示左侧节次信息'
            isSwitch
            hasBorder
            switchIsCheck={setting.hideLeft}
            onSwitchChange={handleSetting.bind(this, 'hideLeft')}
          />
          <AtListItem
            title='隐藏非本周课程'
            isSwitch
            hasBorder
            switchIsCheck={setting.hideNoThisWeek}
            onSwitchChange={handleSetting.bind(this, 'hideNoThisWeek')}
          />
          <View className='page-section'>
            <Picker
              mode='selector'
              range={mondays}
              onChange={this.changeFirstDay}
            >
              <View className='picker'>
                <Text>本学期第一天</Text>
                <Text>{mondays[firstIdx]}</Text>
              </View>
            </Picker>
          </View>
          <AtAccordion open={open} onClick={this.openTerm} title='修改当前学期'>
            {termList.length ? (
              <AtRadio
                options={termList}
                value={value}
                onClick={this.selectTerm}
              />
            ) : (
              <AtListItem className='list' disabled title='尚未绑定教务处' />
            )}
          </AtAccordion>
        </AtList>
      </AtDrawer>
    )
  }
}
