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
    randomcode: '',
    base64: '',
    idnumber: '',
    checked: false,
    // 重置密码的表单
    resetStatus: false,
    onlineNum: undefined,
    /** 按钮不可用 */
    disabled: false
  }
  /** 验证码节流 */
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
    let { username, password, randomcode } = this.state
    const sessionid = getStorageSync('sid')
    setStorageSync('username', username)
    // 若勾选了记住密码的选项
    if (getStorageSync('checked')) {
      setStorageSync('password', password)
    }
    if (!validXH(username)) {
      return showError('学号输入有误')
    }
    if (password && randomcode && sessionid) {
      this.setState({ disabled: true })
      const data = {
        func: 'login',
        data: {
          username,
          password,
          randomcode,
          sessionid
        }
      }
      ajax('base', data)
        .then(res => {
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
  changeName = e => this.setState({ username: e })
  changePass = e => this.setState({ password: e })
  changeRCode = e => this.setState({ randomcode: e })
  changeID = e => this.setState({ idnumber: e })
  /** 判断是否为南岳学院 */
  isNyxy = () => {
    const { username } = this.state
    if (username.charAt(0) == 'N') {
      this.getRCode(true)
    }
  }
  /**
   * 获取验证码
   * @param {boolean} isImmediate 是否立即获取（若是南岳学院账号，会自动重新获取验证码，做一下兼容）
   */
  getRCode = isImmediate => {
    if (isImmediate) {
      this.timer = null
    }
    if (!this.timer) {
      let url = 'http://59.51.24.46/hysf/verifycode.servlet'
      if (this.state.username.charAt(0) == 'N') {
        url = 'http://59.51.24.41/verifycode.servlet'
      }

      Taro.cloud
        .callFunction({
          name: 'randomcode',
          data: {
            url
          }
        })
        .then(({ result }) => {
          if (result) {
            const { base64, sessionid } = result
            this.setState({ base64 })
            setStorageSync('sid', sessionid)
          } else {
            nocancel('教务处无法访问！请稍后再试')
          }
        })
        .then(
          () => {
            this.timer = setTimeout(() => {
              this.timer = null
            }, 700)
          })
    } else {
      showError('不可频繁操作喔')
    }
  }
  /** 记住密码 */
  checkboxChange = e => {
    if (e.detail.value.length) {
      setStorageSync('password', this.state.password)
      setStorageSync('checked', true)
    } else {
      removeStorageSync('password')
      removeStorageSync('checked')
    }
  }
  /** 显示重置密码的表单 */
  showReset = () => this.setState({ resetStatus: true })
  /** 重置密码 */
  onReset = () => {
    const { username, idnumber } = this.state

    if (username && idnumber) {
      if (idnumber.length == 18) {
        this.setState({ disabled: true })
        const data = {
          func: 'reset',
          data: {
            account: username,
            sfzjh: idnumber
          }
        }
        ajax('base', data, true)
          .then(() => nocancel('你的教务处密码已重置为身份证后6位！'))
          .then(() => this.setState({ disabled: false }))
      } else {
        nocancel('身份证号格式错误！')
      }
    } else {
      nocancel('你还未输入学号、身份证号')
    }
  }
  /** 查询教务处在线人数 */
  getOnlines = () => {
    const data = {
      func: 'getOnlines',
      data: {}
    }
    ajax('base', data, true).then(res =>
      this.setState({ onlineNum: res.number })
    )
  }

  componentWillMount() {
    const username = getStorageSync('username')
    const password = getStorageSync('password')
    const checked = getStorageSync('checked')
    let btnTxt = '立即绑定'
    if (username) {
      btnTxt = '登录'
    }
    this.getOnlines()
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
      randomcode,
      resetStatus,
      idnumber,
      btnTxt,
      base64,
      onlineNum,
      disabled
    } = this.state

    return (
      <View className='container'>
        <Logo />
        {/* 重置密码表单 */}
        {resetStatus && (
          <AtForm
            onSubmit={this.onReset}
            className='form'
            customStyle={{ background: primary_color }}
          >
            <AtInput
              title='学号'
              placeholder='请输入学号'
              type='digit'
              value={username}
              onChange={this.changeName}
            />
            <AtInput
              title='身份证号'
              maxLength={18}
              type='idcard'
              placeholder='请输入身份证号'
              value={idnumber}
              onChange={this.changeID}
              onConfirm={this.onReset}
            />
            <AtButton
              disabled={disabled}
              className='btn'
              type='primary'
              formType='submit'
            >
              立即重置
            </AtButton>
          </AtForm>
        )}

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
          <AtInput
            clear
            title='验证码'
            placeholder='请输入验证码'
            maxLength={4}
            value={randomcode}
            onChange={this.changeRCode}
            onConfirm={this.onSubmit}
          >
            {base64 ? (
              <Image onClick={() => this.getRCode()} src={base64} />
            ) : (
              <View onClick={() => this.getRCode()} className='uline'>
                再次获取
              </View>
            )}
          </AtInput>
          <CheckboxGroup onChange={this.checkboxChange}>
            <Label>
              <Checkbox className='mtop' value='remember' checked={checked} />
              记住密码
            </Label>
          </CheckboxGroup>
          <View className='onlines' style={{ color: secondary_color9 }}>
            当前教务处在线人数：{onlineNum}人
          </View>
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
            <View className='uline forget' onClick={this.showReset}>
              遗忘密码？点我重置
            </View>
            <View className='fz32'>
              验证码字母均为小写字母，请勿输入大写
            </View>
            <View>看不清验证码？</View>
            <View>　点击验证码图片即可切换</View>
            <View>没有显示验证码？</View>
            <View>　极有可能是教务处无法访问，你可以尝试再次获取</View>
          </View>
        </View>
      </View>
    )
  }
}
