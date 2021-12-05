/**
 * @typedef {{
 *   icon: string
 *   text: string
 *   bgc: string
 *   jwc: boolean
 * }} Item
 */

import Taro, {
  getStorageSync,
  setStorageSync,
  setScreenBrightness
} from '@tarojs/taro'
import getTerm from '../../utils/getTerm'
import { View, Image, Text, Button } from '@tarojs/components'
import {
  AtIcon,
  AtNoticebar,
  AtModal,
  AtModalContent,
  AtModalAction
} from 'taro-ui'
import ajax from '../../utils/ajax'
import { navigate, showError, nocancel } from '../../utils/taroutils'
import Card from '../../components/treasure/card'
import { list } from './tList'
import {
  get as getGlobalData,
  set as setGlobalData
} from '@utils/global_data'
import { secondary_color4, bgColor7 } from '@styles/color'
import './treasure.scss'

const db = Taro.cloud.database()

export default class Treasure extends Taro.Component {
  config = {
    navigationBarTitleText: '衡师百宝箱'
  }
  constructor() {
    const myClass = getStorageSync('myClass')
    const myClass_name = myClass ? myClass.map(({ name }) => name) : undefined
    this.state = {
      /** 0：未登录，401：登录状态已过期，202：已登录教务处 */
      logged: 0,
      /** 云数据库保存的数据 */
      funcIsOpen: {},
      /** 近期考试安排 */
      exam: [],
      announce: {},
      /** 二维码图片是否显示 */
      qrCodeIsShow: false,
      /** 二维码图片base64 */
      qrCode: getStorageSync('qrCode'),
      brightness: 0,
      myClass_name,
      randomIsDisabled: false
    }
  }
  /**
   * 前往对应功能模块
   * @param {Item} item 点击的功能项
   */
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
  /**
   * 点击功能模块后判断
   * @param {Item} item 点击的功能项
   */
  myFunc = item => {
    const { logged, funcIsOpen } = this.state
    if (!funcIsOpen[item.icon]) {
      showError('此功能尚未开放')
      return
    }
    // 点击功能为教务处功能，且登录状态已过期
    if (item.jwc && logged != 202) {
      // 预先发送一个请求，判断是否已经登录
      const cookie = getStorageSync('cookie')
      if (cookie) {
        const xsxxData = {
          func: 'xsxx',
          data: {
            cookie
          }
        }
        // 判断 cookie 是否过期
        ajax('base', xsxxData).then(() => {
          this.toFunc(item)
          this.setState({ logged: 202 })
        }).catch(({ code }) => {
          const autoLogin = getStorageSync('autoLogin')
          if (code !== 700) {
            if (autoLogin) {
              this.login(item)
            } else {
              Taro.setStorage({
                key: 'page',
                data: item
              })
              navigate('登录状态已过期', '../login/login')
            }
          }
        })
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
  login = (item) => {
    const username = getStorageSync('username')
    const data = {
      func: 'login',
      data: {
        username,
        password: getStorageSync('password')
      }
    }
    ajax('base', data)
      .then((/** @type {{ code: number; cookie: string; }} */ { cookie }) => {
        Taro.setStorage({
          key: 'cookie',
          data: cookie
        })
        setGlobalData('logged', true)
        setGlobalData('cookie', cookie)
        const obj = getTerm(username.replace(/N/, ''))
        Taro.setStorageSync('myterm', obj)
        this.setState({ logged: 202 })

        this.toFunc(item)
      })
      .catch(() => {
        Taro.navigateTo({ url: `../login/login` })
      })
      .finally(() => this.setState({ disabled: false }))
  }
  /** 虚拟校园卡 */
  getRandomNum = () => {
    let { card, qrCode, randomIsDisabled } = this.state
    if (randomIsDisabled) return

    // 第一次绑定时返回到百宝箱页，state 中还没有数据，就从缓存中取
    if (!card) {
      card = Taro.getStorageSync('card')
    }
    /** 获取当前屏幕亮度，以便关闭时恢复至此亮度 */
    Taro.getScreenBrightness({
      success: res => this.setState({ brightness: res.value })
    })
    /** 如果本地没有图片 */
    if (!qrCode) {
      // 没有姓名，无法生成二维码，直接返回报错
      if (!card.AccName) {
        return nocancel('很抱歉，未获取到相关数据，无法使用虚拟卡功能，你可以解绑后使用密码绑定后再尝试获取')
      }

      const data = {
        func: 'getQRCode',
        data: {
          obj: {
            accNum: card.AccNum,
            accName: card.AccName,
            cardID: card.CardID,
            customerID: card.CustomerID,
            agentID: card.AgentID,
            perCode: card.PerCode
          },
          AccNum: card.AccNum
        }
      }
      ajax('card', data, true).then(res => {
        /** 将亮度调至最高 */
        setScreenBrightness({
          value: 1
        })
        this.setState({
          qrCode: res.data,
          qrCodeIsShow: true
        })
        /** 二维码图片应该是永久有效的，存储至用户本地，之后无须再获取 */
        setStorageSync(`qrCode`, res.data)
      }).catch(() => {
        // 出现异常后，限制 10 秒钟后才能再次调用
        this.setState({ randomIsDisabled: true })
        setTimeout(() => {
          this.setState({ randomIsDisabled: false })
        }, 10000)
      })
    } else {
      /** 将亮度调至最高 */
      setScreenBrightness({
        value: 1
      })
      this.setState({ qrCodeIsShow: true })
    }
  }
  /** 关闭二维码 modal */
  closeQRCode = () => {
    this.setState({ qrCodeIsShow: false })
    /** 关闭虚拟卡模态框后，将亮度恢复到之前的亮度 */
    setScreenBrightness({
      value: this.state.brightness
    })
  }
  /** 显示最近的考试安排 */
  showExam = () => {
    const { myClass_name } = this.state
    /**
     * @type {{
     *  name: string
     * }[]}
     */
    const exam_arr = getStorageSync('exam_arr')
    if (myClass_name && exam_arr) {
      const exam = exam_arr.filter(({ name }) =>
        this.state.myClass_name.includes(name)
      )
      // TODO: 检测添加的考试安排中是不是有今天考试的，有就进行提示
      this.setState({ exam })
    }
  }

  componentWillMount() {
    db.collection('hynu-data')
      .get()
      .then(({ data }) => {
        const { isOpen, announce } = data[0]
        this.setState({ funcIsOpen: isOpen })
        if (announce.isShow) {
          this.setState({ announce })
        }
      })
      .catch(() => {
        console.error('没有数据库集合，所有功能模块入口开启')
        // 测试数据（兼容没有云数据库的情况）
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
    // 判断用户是否开启自动充值功能，若开启就自动充值
    const autoTransferForm = getStorageSync('autoTransferForm')
    const card = getStorageSync('card')
    const { limitMoney, limitBalance, autoIsOpen, pwd } = autoTransferForm
    this.setState({ card })
    if (autoIsOpen && card.balance < Number(limitBalance)) {
      const autoTransferData = {
        func: 'bankTransfer',
        data: {
          AccNum: card.AccNum,
          MonTrans: limitMoney,
          Password: pwd
        }
      }
      ajax('card', autoTransferData).then(({ msg }) =>
        nocancel(
          msg.includes('成功')
            ? `检测到你的校园卡余额低于${limitBalance}元，已为你自动充值${limitMoney}元`
            : msg
        )
      )
    }
    this.showExam()
  }
  componentDidShow() {
    if (getGlobalData('logged')) {
      this.setState({ logged: 202 })
    }
    if (getGlobalData('refresh_exam_treasure')) {
      this.showExam()
      setGlobalData('refresh_exam_treasure', false)
    }
  }
  onShareAppMessage() {
    return {
      title: '衡师百宝箱'
    }
  }

  render() {
    const {
      tem,
      exam,
      funcIsOpen,
      announce,
      range,
      wea_img,
      qrCodeIsShow,
      qrCode
    } = this.state

    return (
      <View className='treasure-container'>
        {exam && exam.length && (
          <AtNoticebar icon='clock'>
            {/* 只显示当前学期的考试安排 */}
            考试提示：
            {exam.map(item => {
              let str = item.name + item.date + ' '
              if (item.date) {
                str += item.time
              }
              return str
            })}
          </AtNoticebar>
        )}
        {announce && announce.isShow && (
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
        <Card getRandomNum={this.getRandomNum} />
        {/* 虚拟卡二维码 */}
        <AtModal isOpened={!!(qrCode && qrCodeIsShow)} onClose={this.closeQRCode}>
          <AtModalContent>
            <Image src={qrCode} className='img-qr' />
            <Text style={{ background: bgColor7, color: secondary_color4 }}>
              此二维码虚拟卡可用于宿舍门禁开锁，食堂扫描支付等（请勿泄露）。
            </Text>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.closeQRCode}>关闭</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
