// @ts-check
import Taro, {
  setStorageSync,
  getStorageSync,
  removeStorageSync
} from '@tarojs/taro'
import { View, Checkbox, CheckboxGroup, Label, Image } from '@tarojs/components'
import { AtButton, AtForm, AtInput } from 'taro-ui'
import Logo from '@components/logo'
import PwdInput from '@components/pwd-input'
import ajax from '@utils/ajax'
import { nocancel, showError } from '@utils/taroutils'
import getTerm from '@utils/getTerm'
import { set as setGlobalData } from '@utils/global_data'
import { primary_color, secondary_color9 } from '@styles/color'
import validXH from '@utils/validXH'
import './login.scss'

export default class Login extends Taro.Component {
  config = {
    navigationBarBackgroundColor: '#a80000',
    navigationBarTitleText: '登录教务处',
    navigationBarTextStyle: 'white'
  }
  state = {
    username: '',
    password: '',
    autoLogin: false,
    /** 按钮不可用 */
    disabled: false
  }
  /**
   * 获取课程
   * @param {object} termObj 学期数据
   */
  getMyClass = (termObj) => {
    const {
      getClassData,
      dealClassCalendar
    } = Taro.getCurrentPages()[0].$component
    const data = getClassData()
    // 第一次登录的时候拿不到当前学期
    if (!data.data.xnxqh) {
      data.data.xnxqh = Object.keys(termObj)[Object.keys(termObj).length - 1]
    }
    ajax('base', data).then(({ myClass }) => {
      removeStorageSync('allWeek')
      setStorageSync('myClass', myClass)
      dealClassCalendar(myClass)
    })
  }
  /** 登录 */
  onSubmit = () => {
    let { username, password } = this.state
    setStorageSync('username', username)
    // 若勾选了
    if (getStorageSync('autoLogin')) {
      setStorageSync('password', password)
    }
    if (!validXH(username)) {
      return showError('学号输入有误')
    }
    if (username.includes('N') && username.length == 12) {
      return showError('仅支持本部本科生登录，研究生及南岳学院暂不支持')
    }
    if (password) {
      this.setState({ disabled: true })
      this.login(username, password)
    } else {
      nocancel('你还未输入密码')
    }
  }
  login = (username, password) => {
    const data = {
      func: 'login',
      data: {
        username,
        password
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
        setGlobalData('username', username)
        const obj = getTerm(username.replace(/N/, ''))
        Taro.setStorageSync('myterm', obj)

        if (this.$router.params.getClass) {
          // this.getMyClass(obj)
        }
        const page = getStorageSync('page')
        // 重定向到之前想要进入的页面
        if (page) {
          Taro.redirectTo({
            url: `../treasure/${page.icon}/${page.icon}`
          })
          Taro.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: page.bgc,
            animation: {
              duration: 400,
              timingFunc: 'easeIn'
            }
          })
        } else {
          Taro.navigateBack()
        }
      })
      .finally(() => this.setState({ disabled: false }))
  }

  /** 输入框输入 */
  changeName = (e) => this.setState({ username: e })
  changePass = (e) => this.setState({ password: e })
  /**
   * 记住密码
   * @param {import ('@tarojs/components/types/common').CommonEventFunction<{
   *  value: string[];
   * }>} e
   */
  checkboxChange = (e) => {
    // TODO:
    if (e.detail.value.length) {
      setStorageSync('password', this.state.password)
      setStorageSync('autoLogin', true)
    } else {
      removeStorageSync('password')
      removeStorageSync('autoLogin')
    }
  }

  componentWillMount() {
    const username = getStorageSync('username')
    const password = getStorageSync('password')
    const autoLogin = getStorageSync('autoLogin')
    let btnTxt = '立即绑定'
    if (username) {
      btnTxt = '登录'
    }
    this.setState({ username, password, autoLogin, btnTxt })
  }
  componentWillUnmount() {
    Taro.removeStorage({ key: 'page' })
  }

  onShareAppMessage() {
    return {
      title: SLOGAN,
      path: PATH,
      imageUrl: SHARE
    }
  }

  render() {
    const {
      autoLogin,
      username,
      password,
      btnTxt,
      disabled
    } = this.state

    return (
      <View className='container'>
        <Logo />

        <AtForm
          onSubmit={this.onSubmit}
          className='form'
          customStyle={{ background: primary_color }}
        >
          <AtInput
            title='学号'
            placeholder='请输入学号'
            clear
            value={username}
            onChange={this.changeName}
          />
          <PwdInput
            placeholder='请输入密码'
            value={password}
            onChange={this.changePass}
          />
          <CheckboxGroup onChange={this.checkboxChange}>
            <Label>
              <Checkbox className='mtop' value='remember' checked={autoLogin} />
              下次自动登录
            </Label>
          </CheckboxGroup>
          <AtButton
            disabled={disabled}
            className='btn'
            type='primary'
            formType='submit'
          >
            {btnTxt}
          </AtButton>
        </AtForm>
        <View className='help-text fz26' style={{ color: secondary_color9 }}>
          <View className='text'>
            <View className='fz32'>
              目前《我的衡师》仅支持本部本科生登录，研究生及南岳学院暂不支持
            </View>
          </View>
        </View>
      </View>
    )
  }
}
