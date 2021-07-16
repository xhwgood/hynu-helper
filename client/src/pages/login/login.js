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
    idnumber: '',
    checked: false,
    // 重置密码的表单
    resetStatus: false,
    /** 按钮不可用 */
    disabled: false
  }
  /**
   * 验证码节流
   * @type {number}
   */
  timer = undefined
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
    const sessionid = getStorageSync('sid')
    setStorageSync('username', username)
    // 若勾选了记住密码的选项
    if (getStorageSync('checked')) {
      setStorageSync('password', password)
    }
    if (!validXH(username)) {
      return showError('学号输入有误')
    }
    if (password && sessionid) {
      this.setState({ disabled: true })
      const data = {
        func: 'login',
        data: {
          username,
          password,
          sessionid
        }
      }
      ajax('base', data)
        .then((/** @type {{ code: number; }} */ res) => {
          if (res.code != 200) {
            this.getRCode()
          } else {
            setGlobalData('logged', true)
            setGlobalData('sid', sessionid)
            setGlobalData('username', username)
            const obj = getTerm(username.replace(/N/, ''))
            Taro.setStorageSync('myterm', obj)

            if (this.$router.params.getClass) {
              this.getMyClass(obj)
            }
            // 重定向到之前想要进入的页面
            const page = getStorageSync('page')
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
          }
        })
        .catch(() => {
          this.getRCode()
        })
        .finally(() => this.setState({ disabled: false }))
    } else {
      nocancel('你还未输入密码及验证码')
    }
  }
  /** 输入框输入 */
  changeName = (e) => this.setState({ username: e })
  changePass = (e) => this.setState({ password: e })
  /** 判断是否为南岳学院 */
  isNyxy = () => {
    const { username } = this.state
    if (username.charAt(0) == 'N') {
      this.getRCode(true)
    }
  }
  /**
   * 获取验证码
   * @param isImmediate 是否立即获取（若是南岳学院账号，会自动重新获取验证码，做一下兼容）
   */
  getRCode = (isImmediate = false) => {
    // if (isImmediate) {
    //   this.timer = null
    // }
    // if (!this.timer) {
    //   let url = 'http://59.51.24.46/hysf/verifycode.servlet'
    //   if (this.state.username.charAt(0) == 'N') {
    //     url = 'http://59.51.24.41/verifycode.servlet'
    //   }

    //   Taro.cloud
    //     .callFunction({
    //       name: 'randomcode',
    //       data: {
    //         url
    //       }
    //     })
    //     .then(({ result }) => {
    //       if (result) {
    //         const { base64, sessionid } = result
    //         this.setState({ base64 })
    //         setStorageSync('sid', sessionid)
    //       } else {
    //         nocancel('教务处无法访问！请稍后再试')
    //       }
    //     })
    //     .then(
    //       () => {
    //         this.timer = setTimeout(() => {
    //           this.timer = null
    //         }, 700)
    //       })
    // } else {
    //   showError('不可频繁操作喔')
    // }
  }
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
      setStorageSync('checked', true)
    } else {
      removeStorageSync('password')
      removeStorageSync('checked')
    }
  }

  componentWillMount() {
    const username = getStorageSync('username')
    const password = getStorageSync('password')
    const checked = getStorageSync('checked')
    let btnTxt = '立即绑定'
    if (username) {
      btnTxt = '登录'
    }
    this.setState({ username, password, checked, btnTxt }, () =>
      this.getRCode()
    )
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
      checked,
      username,
      password,
      resetStatus,
      idnumber,
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
            onBlur={this.isNyxy}
            onChange={this.changeName}
          />
          <PwdInput
            placeholder='请输入密码'
            value={password}
            onChange={this.changePass}
          />
          <CheckboxGroup onChange={this.checkboxChange}>
            <Label>
              <Checkbox className='mtop' value='remember' checked={checked} />
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
        {/* <View className='help-text fz26' style={{ color: secondary_color9 }}>
          <View className='text'>
            <View className='uline forget' onClick={this.showReset}>
              遗忘密码？点我重置
            </View>
          </View>
        </View> */}
      </View>
    )
  }
}
