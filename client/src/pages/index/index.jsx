import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import './index.scss'
import { schoolWeek, day } from '@utils/data'
import Left from '@components/index/left'
import Top from '@components/index/top'
import Drawer from '@components/index/drawer'
import { list } from './color'
import moment from 'moment'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '课程表'
  }

  state = {
    allWeek: [],
    // 课程滚动位置
    scrollLeft: 0,
    allWeekIdx: 0,
    show: false,
    setting: {
      hideLeft: Taro.getStorageSync('hideLeft') || false,
      showStandard: Taro.getStorageSync('showStandard') || false,
      hideNoThisWeek: Taro.getStorageSync('hideNoThisWeek') || false
    }
  }

  componentWillMount() {
    this.setState({ scrollLeft: Taro.getStorageSync('indexScrollLeft') })
    this.getDay()
    this.dealClassCalendar()
  }
  componentDidMount() {
    this.scrollToNow()
  }

  getMyClass = () => {
    Taro.showLoading()
    const sessionid = Taro.getStorageSync('sid')
    Taro.cloud
      .callFunction({
        name: 'base',
        data: {
          func: 'getClass',
          data: {
            sessionid
          }
        }
      })
      .then(res => {
        Taro.hideLoading()
        Taro.setStorageSync('myClass', res.result.data.myClass)
        const msg = res.result.data.msg || '网络出现异常或教务处无法访问'
        Taro.showToast({
          title: msg,
          icon: 'none'
        })
      })
      .catch(err => {
        Taro.showToast({
          title: '出现未知错误！',
          icon: 'none'
        })
      })
  }

  // 处理课程表数据结构、将校历转为一维数组
  dealClassCalendar = () => {
    Taro.showLoading()
    // 每节课增加一个id属性，若课程名和老师相同便视为相同课程，id就相同
    let tempIdx = 0
    const testClass = Taro.getStorageSync('myClass')
    if (testClass) {
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
    let allWeek = Taro.getStorageSync('allWeek')
    if (testClass || !allWeek) {
      // 把所有课程放进 userWeek 数组
      const userWeek = schoolWeek
      userWeek.forEach((elem, idx) => {
        testClass.forEach(classElem => {
          const thisWeekClass = { ...classElem }
          if (classElem.week.includes(idx + 1)) {
            thisWeekClass.inThisWeek = true
          }
          const haveClass = elem[thisWeekClass.day - 1].class
          if (haveClass) {
            haveClass.push(thisWeekClass)
          } else {
            elem[thisWeekClass.day - 1].class = [thisWeekClass]
          }
        })
      })
      // 转为一维数组
      const allWeek = userWeek.reduce((a, b) => a.concat(b))
      this.setState({ allWeek })
      // 放入缓存
      Taro.setStorageSync('allWeek', allWeek)
      Taro.removeStorage('myClass')
    } else {
      this.setState({ allWeek })
    }

    Taro.hideLoading()
  }
  // 计算今天周几、是本学期第几周
  getDay = () => {
    // Taro.showLoading({ title: '正在渲染日期' })
    // const today = moment().format('MM/DD')
    const today = '11/30' // 测试用日期

    // 计算数据和今天周几、是本学期第几周
    for (let i = 0; i < 20; i++) {
      for (let k = 0; k < 7; k++) {
        if (schoolWeek[i][k].day === today) {
          const now = {
            week: i,
            day: k
          }
          this.setState({
            now,
            allWeekIdx: i * 7 + k
          })
          Taro.hideLoading()
          return
        } else {
          this.setState({ allWeekIdx: -1 })
          Taro.hideLoading()
        }
      }
    }
  }
  // 课程表滚动到今天
  scrollToNow = () => {
    let scrollLeft
    Taro.createSelectorQuery()
      .select('.day')
      .boundingClientRect(rect => {
        const singleWidth = rect.width
        const { allWeekIdx } = this.state
        if (!allWeekIdx) {
          // 本学期第一天或在假期
          scrollLeft = 0
        } else if (allWeekIdx > 133) {
          // 若是期末，则滚动距离不再变化
          scrollLeft = singleWidth * 134
        } else {
          scrollLeft = singleWidth * (allWeekIdx - 1)
        }
        this.setState({ scrollLeft })
        // 将滚动距离放入缓存，加速下次查看
        Taro.setStorageSync('indexScrollLeft', scrollLeft)
      })
      .exec()
  }
  showDrawer = () => {
    this.setState({ show: true })
  }
  handleSetting = (set, e) => {
    this.setState(preState => {
      preState.setting[set] = e.detail.value
    })
    Taro.setStorageSync(set, e.detail.value)
    setTimeout(() => {
      this.setState({ show: false })
    }, 400)
  }

  render() {
    const { show, now, allWeek, allWeekIdx, setting } = this.state
    return (
      <View className="index">
        {/* 顶部显示 */}
        <Top
          now={now}
          showDrawer={this.showDrawer}
          getMyClass={this.getMyClass}
        />
        <Drawer
          setting={setting}
          show={show}
          handleSetting={this.handleSetting}
        />
        <View className="class">
          {/* 左边为上课节数及时间 */}
          {setting.hideLeft && <Left />}
          {/* 右边为可以滚动的全学期视图 */}
          <ScrollView
            className="week"
            scrollX
            scrollWithAnimation
            scrollLeft={scrollLeft}
            enableFlex
          >
            {allWeek.map((item, idx) => (
              <View className="day" key={idx}>
                <View className={idx == allWeekIdx ? 'active top' : 'top'}>
                  <View>{idx == allWeekIdx ? '今天' : day[idx % 7]}</View>
                  <View className="date">{item.day}</View>
                </View>
                {item.class &&
                  item.class.map(
                    (v, i) =>
                      (!setting.hideNoThisWeek ||
                        (setting.hideNoThisWeek && v.inThisWeek)) && (
                        <View
                          className="item-class"
                          key={i}
                          style={{
                            height:
                              (v.section.length / 2 - 1) * 114 + 112 + 'rpx',
                            top: (v.section.charAt(1) - 1) * 121 + 100 + 'rpx',
                            backgroundColor:
                              allWeekIdx > idx
                                ? '#ebf3f9'
                                : v.inThisWeek
                                ? list[v.id]
                                : '#ebf3f9',
                            color:
                              allWeekIdx > idx
                                ? '#8093a3'
                                : v.inThisWeek
                                ? '#fff'
                                : '#8093a3'
                          }}
                        >
                          <View className="name">{v.name}</View>
                          <View className="place">{v.place}</View>
                        </View>
                      )
                  )}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    )
  }
}
