import Taro, { Component, getStorageSync, setStorageSync } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { day, schoolWeek as schoolWeekData } from '@utils/data'
import Left from '@components/index/left'
import Top from '@components/index/top'
import Drawer from '@components/index/drawer'
import Modal from '@components/index/modal'
import ChangeWeek from '@components/index/change-week'
import { list } from './color'
import moment from '@utils/moment.min.js'
import { get as getGlobalData } from '@utils/global_data.js'
import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '课程表'
  }
  constructor(props) {
    super(props)
    let hideLeft = getStorageSync('hideLeft')
    if (typeof hideLeft != 'boolean') {
      hideLeft = true
    }
    // 更改为标准版课表（待开发）
    // let showStandard = getStorageSync('showStandard')
    let hideNoThisWeek = getStorageSync('hideNoThisWeek')
    if (typeof hideNoThisWeek != 'boolean') {
      hideNoThisWeek = false
    }
    this.state = {
      allWeek: [],
      // 课程滚动位置
      scrollLeft: 0,
      // 0~140，今天在全学期的索引
      allWeekIdx: 0,
      // 抽屉是否显示
      show: false,
      setting: {
        hideLeft,
        hideNoThisWeek
      },
      // 课程详情模态框
      isOpened: false,
      detail: {},
      // 查看其它星期课程
      showWeek: false,
      // 用户是否左右滑动/查看其它周课程
      weekIsChange: false
    }
  }
  // 一天的宽度
  singleWidth = 0
  // 获取课程的请求参数，提取至课程表页
  getClassData = xnxqh => {
    const sessionid = getGlobalData('sid')
    if (!xnxqh) {
      const myterm = getStorageSync('myterm')
      xnxqh = Object.keys(myterm)[Object.keys(myterm).length - 1]
    }
    return {
      func: 'changeClass',
      data: {
        sessionid,
        xnxqh
      }
    }
  }

  // 处理课程表数据结构、将校历转为一维数组
  dealClassCalendar = myClass => {
    // 每节课增加一个id属性，若课程名和老师相同便视为相同课程，id就相同
    let tempIdx = 0
    const testClass = myClass
    if (testClass && testClass[0]) {
      testClass[0].id = 0
      // j = 1，即跳过第一节课，从第二节课开始比较
      for (let j = 1; j < testClass.length; j++) {
        tempIdx += 1
        for (let i = 0; i < j; i++) {
          if (
            testClass[j].name != testClass[i].name ||
            testClass[j].teacher != testClass[i].teacher
          ) {
            testClass[j].id = tempIdx
          } else {
            testClass[j].id = testClass[i].id
            tempIdx--
            // 若和前面的有一节课相同则不再与后面的课程比较
            break
          }
        }
      }
    }
    let allWeek = getStorageSync('allWeek')
    if (!allWeek) {
      const schoolWeek = getStorageSync('week') || schoolWeekData
      // 把所有课程放进 userWeek 数组
      const userWeek = JSON.parse(JSON.stringify(schoolWeek))
      userWeek.forEach((elem, idx) => {
        testClass &&
          testClass.forEach(classElem => {
            const thisWeekClass = { ...classElem }
            if (classElem.week.includes(idx + 1)) {
              thisWeekClass.inThisWeek = true
            }
            const haveClass = elem[thisWeekClass.day - 1].class
            haveClass
              ? haveClass.push(thisWeekClass)
              : (elem[thisWeekClass.day - 1].class = [thisWeekClass])
          })
      })
      // 二维数组转一维
      allWeek = userWeek.reduce((a, b) => a.concat(b))
      // 放入缓存
      setStorageSync('allWeek', allWeek)
    }
    // 此时断定星期已经改变，所以设为 false
    this.setState({
      allWeek,
      weekIsChange: false
    })
  }
  // 计算今天周几、是本学期第几周
  getDay = (week, first) => {
    Taro.showLoading({ title: '正在渲染课表' })
    const today = moment().format('MM/DD')
    // const today = '04/01' // 测试用日期

    // 计算数据和今天周几、是本学期第几周
    for (let i = 0; i < 20; i++) {
      for (let k = 0; k < 7; k++) {
        if (week[i][k].day === today) {
          this.week = i
          const now = {
            week: i,
            day: k
          }
          this.setState(
            {
              now: { ...now },
              allWeekIdx: i * 7 + k
            },
            () => !first && this.scrollToNow()
          )
          Taro.hideLoading()
          return
        } else {
          // 寒假/暑假
          this.week = -1
          this.setState({ allWeekIdx: -1 })
          Taro.hideLoading()
        }
      }
    }
  }
  // 得到一天的宽度
  getWidth = () => {
    Taro.createSelectorQuery()
      .select('.day')
      .boundingClientRect(rect => {
        this.singleWidth = rect.width
        this.scrollToNow()
      })
      .exec()
  }
  // 课程表滚动到今天
  scrollToNow = () => {
    let scrollLeft
    const { allWeekIdx } = this.state
    if (!allWeekIdx) {
      // 本学期第一天或在假期
      scrollLeft = 0
    } else if (allWeekIdx > 133) {
      // 若是期末，则滚动距离不再变化
      scrollLeft = this.singleWidth * 134
    } else {
      scrollLeft = this.singleWidth * (allWeekIdx - 1)
    }
    this.setState({ scrollLeft })
    // 将滚动距离放入缓存，加速下次查看
    setStorageSync('indexScrollLeft', scrollLeft)
  }
  // 左右滑动
  scroll = e => {
    const { scrollLeft } = e.detail
    if (this.state.scrollLeft != scrollLeft) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        const nowScroll = Math.round(scrollLeft / this.singleWidth / 7)
        this.updown(nowScroll)
      }, 350)
    }
  }
  // 如果滑到最右边，就显示第20周
  scrollToLower = () => {
    const { now } = this.state
    if (now && now.week >= 0) {
      setTimeout(() => this.setState({ now: { ...now, week: 19 } }), 600)
    }
  }

  // 周指示联动
  updown = nowWeek => {
    const { now } = this.state
    // 如果不是寒暑假
    if (now) {
      let weekIsChange = false
      // 如果不是本周，则已经改变
      if (this.week != nowWeek) {
        weekIsChange = true
      }
      this.setState({
        now: { ...now, week: nowWeek },
        weekIsChange
      })
    }
  }
  // 设置抽屉是否显示
  showDrawer = () => this.setState({ show: true })
  closeDrawer = () => this.setState({ show: false })
  // 更改设置
  handleSetting = (set, e) => {
    const { value } = e.detail
    this.setState({
      setting: { ...this.state.setting, [set]: value }
    })
    setStorageSync(set, value)
    // 仅在打开“隐藏非本周课程”开关时进行提示
    if (set == 'hideNoThisWeek' && value) {
      Taro.showModal({
        content: '打开此开关后，原本背景颜色为灰色的课程都将隐藏',
        showCancel: false,
        success: () => this.closeDrawer()
      })
    } else {
      // 延迟一下关闭抽屉，让用户看清开关的变化
      setTimeout(() => this.closeDrawer())
    }
  }
  // 查看其它周的模态框是否显示
  showChangeWeek = () => this.setState({ showWeek: true })
  closeChangeWeek = () => this.setState({ showWeek: false })
  // 查看其它周课程
  changeWeek = item => {
    const scrollLeft = this.singleWidth * item * 7
    this.updown(item)
    this.setState({
      scrollLeft,
      showWeek: false
    })
  }

  // 显示课表详情
  showDetail = detail => {
    let { section } = detail
    const len = section.length
    // 最后一个字符
    const end = section.charAt(len - 1)
    // 020304  080910
    if (len == 2) {
      section = Number(section)
    } else {
      section = `${section.charAt(1)}-${end}`
    }
    detail.section = section
    this.setState({
      detail,
      isOpened: true
    })
  }
  handleClose = () => this.setState({ isOpened: false })

  componentWillMount() {
    const week = getStorageSync('week')
    week ? this.getDay(week, true) : this.getDay(schoolWeekData, true)
    this.setState({ scrollLeft: getStorageSync('indexScrollLeft') })
    this.dealClassCalendar()
  }
  componentDidMount() {
    this.getWidth()
  }

  onShareAppMessage() {
    return {
      title: '我的课程表'
    }
  }

  render() {
    const {
      show,
      now,
      allWeek,
      allWeekIdx,
      setting,
      detail,
      isOpened,
      showWeek,
      scrollLeft,
      weekIsChange
    } = this.state

    return (
      <View>
        {/* 顶部指示 */}
        <Top
          now={now}
          showDrawer={this.showDrawer}
          dealClassCalendar={this.dealClassCalendar}
          getClassData={this.getClassData}
          weekIsChange={weekIsChange}
          showChangeWeek={this.showChangeWeek}
        />
        {/* </View> */}
        {/* 改变星期的模态框 */}
        <ChangeWeek
          showWeek={showWeek}
          closeChangeWeek={this.closeChangeWeek}
          changeWeek={this.changeWeek}
          propsWeek={this.week}
        />
        <Drawer
          setting={setting}
          show={show}
          handleSetting={this.handleSetting}
          dealClassCalendar={this.dealClassCalendar}
          getDay={this.getDay}
          scrollToNow={this.scrollToNow}
          getClassData={this.getClassData}
          closeDrawer={this.closeDrawer}
        />
        <View className='class'>
          {/* 左边：上课节数及时间 */}
          {setting.hideLeft && <Left />}
          {/* 右边：可以滚动的全学期视图 */}
          <ScrollView
            className='week break'
            scrollX
            onScroll={this.scroll}
            onScrollToLower={this.scrollToLower}
            scrollWithAnimation
            scrollLeft={scrollLeft}
            enableFlex
          >
            {allWeek.map((item, idx) => (
              <View className='day' key={item.day}>
                <View className={idx == allWeekIdx ? 'active top' : 'top'}>
                  <View>{idx == allWeekIdx ? '今天' : day[idx % 7]}</View>
                  <View className='date'>{item.day}</View>
                </View>
                {item.class &&
                  item.class.map(
                    v =>
                      (!setting.hideNoThisWeek ||
                        (setting.hideNoThisWeek && v.inThisWeek)) && (
                        <View
                          className='item-class'
                          key={v.section + v.name}
                          style={{
                            height:
                              (v.section.length / 2 - 1) * 122 + 118 + 'rpx',
                            top:
                              (v.section.slice(0, 2) - 1) * 128 + 108 + 'rpx',
                            backgroundColor:
                              allWeekIdx <= idx && v.inThisWeek
                                ? list[v.id]
                                : '#ebf3f9',
                            color:
                              allWeekIdx <= idx && v.inThisWeek
                                ? '#fff'
                                : '#8093a3',
                            zIndex: v.inThisWeek ? '1' : '0'
                          }}
                          onClick={this.showDetail.bind(this, v)}
                        >
                          <View className='name'>{v.name}</View>
                          <View className='place'>{v.place}</View>
                        </View>
                      )
                  )}
              </View>
            ))}
          </ScrollView>
        </View>
        <Modal
          detail={detail}
          isOpened={isOpened}
          handleClose={this.handleClose}
        />
      </View>
    )
  }
}
