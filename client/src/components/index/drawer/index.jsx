// @ts-check
import Taro, { PureComponent } from '@tarojs/taro'
import {
  AtDrawer,
  AtList,
  AtListItem,
  AtRadio,
  AtAccordion,
  AtIcon
} from 'taro-ui'
import { View, Text, Picker } from '@tarojs/components'
import ajax from '@utils/ajax'
import { get as getGlobalData, set as setGlobalData } from '@utils/global_data'
import { navigate } from '@utils/taroutils'
import moment from '@utils/moment.min'
import { week as weekData } from '@utils/data'
import './index.scss'

export default class Index extends PureComponent {
  constructor() {
    const termList = Taro.getStorageSync('termList') || []
    const value = Taro.getStorageSync('value') || ''
    const firstIdx = Taro.getStorageSync('firstIdx') || 4

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
  /** 得到学期数组 */
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
      // 本学期值：“2019-2020-2”
      Taro.setStorageSync('value', value)
      this.setState({ value })
    }
    this.setState({ termList })
  }
  // 修改当前学期
  selectTerm = v => {
    const { closeDrawer, dealClassCalendar, getClassData } = this.props
    // 如果点击学期为当前学期，则直接返回不获取课程
    if (v == this.state.value) {
      return
    }
    const data = getClassData(v)
    if (getGlobalData('sid')) {
      ajax('base', data).then(res => {
        this.setState({ value: v })
        Taro.removeStorageSync('allWeek')
        const { myClass } = res
        Taro.setStorageSync('myClass', myClass)
        Taro.setStorage({
          key: 'value',
          data: v
        })
        setGlobalData('isGettedClassData', false)
        dealClassCalendar(myClass)
        closeDrawer()
      })
    } else {
      navigate('登录状态已过期，请重新登录', '../login/login')
    }
  }
  // 修改当前学期（手风琴动画）是否折叠
  openTerm = () =>
    this.setState(preState => ({
      open: !preState.open
    }))
  // 修改本学期第一天
  changeFirstDay = e => {
    const { value } = e.detail
    this.setState({ firstIdx: value })
    Taro.setStorageSync('firstIdx', value)
    this.calculateSchool(this.state.mondays[value])
    this.props.closeDrawer()
  }
  /**
   * 计算得到校历
   * @param {string} date
   */
  calculateSchool = date => {
    const numArr = date.match(/\d+/g)
    const week = []
    const year = new Date().getFullYear()
    weekData.forEach((v, i) => {
      week[i] = []
      // 周一为每周第一天
      for (let j = 1; j < 8; j++) {
        const n = moment(new Date(`${year}-${numArr[0]}-${numArr[1]}`)).weekday(
          i * 7
        )
        const t = n.day(j).format('MM/DD')
        week[i].push({ day: t })
      }
    })
    const allWeek = Taro.getStorageSync('allWeek')
    /** 一维数组 */
    const onedi = week.reduce((a, b) => a.concat(b))
    allWeek.forEach((item, i) => {
      item.day = onedi[i].day
    })
    Taro.setStorageSync('week', week)
    Taro.setStorageSync('allWeek', allWeek)
    const { getDay, dealClassCalendar } = this.props
    getDay(week)
    dealClassCalendar()
  }
  /** 计算2月/9月的所有星期一 */
  calculateFirst = () => {
    const newD = new Date()
    const newMonth = newD.getMonth()
    const newYear = newD.getFullYear()
    let d
    /** 下个月的第一天，用于兼容更多的假期 */
    let nextD
    // 2月~7月，都是下学期
    if (newMonth >= 1 && newMonth <= 6) {
      d = new Date(newYear, 1)
      nextD = new Date(newYear, 2)
    } else if (newMonth == 0) {
      // 如果是1月，就把年份-1，计算9月
      d = new Date(newYear - 1, 8)
      nextD = new Date(newYear - 1, 9)
    } else {
      // 其他月份都是上学期
      d = new Date(newYear, 8)
      nextD = new Date(newYear, 9)
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
      mondays.push(`${getTime.getMonth() + 1}月${getTime.getDate()}日（周一）`)
      d.setDate(d.getDate() + 7)
    }
    // 得到下个月的第一个周一
    while (nextD.getDay() !== 1) {
      nextD.setDate(nextD.getDate() + 1)
    }
    const nextGetTime = new Date(nextD.getTime())
    mondays.push(
      `${nextGetTime.getMonth() + 1}月${nextGetTime.getDate()}日（周一）`
    )
    this.setState({ mondays })
  }
  /** 添加课程 */
  addClass = () => {
    // 关闭抽屉，并跳转至添加课程表页面
    this.props.closeDrawer()
    Taro.navigateTo({
      url: './addClass/addClass'
    })
  }

  componentWillMount() {
    this.calculateFirst()
  }

  componentDidShow() {
    if (
      (getGlobalData('logged') || Taro.getStorageSync('myterm')) &&
      !this.state.termList.length
    ) {
      this.getTermList()
    }
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
              // TODO: 验证值
              value={firstIdx}
            >
              <View className='picker'>
                <Text>修改学期第一天</Text>
                <Text>
                  {mondays[firstIdx] &&
                    mondays[firstIdx].replace('（周一）', '')}
                </Text>
              </View>
            </Picker>
          </View>
          <View className='page-section' onClick={this.addClass}>
            <View className='picker'>
              <Text>添加课程</Text>
              <AtIcon
                value='chevron-right'
                size='21'
                color='#ccc'
                className='right'
              />
            </View>
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
