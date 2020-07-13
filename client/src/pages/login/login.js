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
import { nocancel, noicon } from '@utils/taroutils'
import getTerm from '@utils/getTerm'
import { set as setGlobalData } from '@utils/global_data.js'
import { primary_color } from '@styles/color.js'
import './login.scss'

export default class Login extends Taro.Component {
  config = {
    navigationBarBackgroundColor: '#ff0302',
    navigationBarTitleText: '绑定教务处',
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
    resetStatus: false
  }
  // 获取课程
  getMyClass = () => {
    const {
      getClassData,
      dealClassCalendar
    } = Taro.getCurrentPages()[0].$component
    const data = getClassData()
    ajax('base', data).then(({ myClass }) => {
      removeStorageSync('allWeek')
      setStorageSync('myClass', myClass)
      dealClassCalendar(myClass)
    })
  }
  // 登录
  onSubmit = () => {
    let { username, password, randomcode } = this.state
    const sessionid = getStorageSync('sid')
    setStorageSync('username', username)
    // 若勾选了记住密码的选项
    if (getStorageSync('checked')) {
      setStorageSync('password', password)
    }
    if (username && password && randomcode && sessionid) {
      const data = {
        func: 'login',
        data: {
          username,
          password,
          randomcode,
          sessionid
        }
      }
      ajax('base', data).then(res => {
        if (res.code != 200) {
          this.getRCode()
        } else {
          setGlobalData('logged', true)
          setGlobalData('sid', sessionid)
          setGlobalData('username', username)
          const obj = getTerm(username.replace(/N/, ''))

          Taro.setStorage({
            key: 'myterm',
            data: obj
          })
          if (this.$router.params.getClass) {
            this.getMyClass()
          }
          // 重定向到之前想要进入的页面
          const page = getStorageSync('page')
          page
            ? Taro.redirectTo({
                url: `../treasure/${page}/${page}`
              })
            : Taro.navigateBack()
        }
      })
    } else {
      noicon('你还未输入学号、密码及验证码')
    }
  }
  // 输入框输入
  changeName = e => this.setState({ username: e })
  changePass = e => this.setState({ password: e })
  changeRCode = e => this.setState({ randomcode: e })
  changeID = e => this.setState({ idnumber: e })
  // 判断是否为南岳学院
  isNyxy = () => {
    const { username } = this.state
    if (username.charAt(0) == 'N') {
      this.getRCode(username)
    }
  }
  // 获取验证码
  getRCode = () => {
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
          noicon('教务处无法访问！请稍后再试')
        }
      })
  }
  // 记住密码
  checkboxChange = e => {
    if (e.detail.value.length) {
      setStorageSync('password', this.state.password)
      setStorageSync('checked', true)
    } else {
      removeStorageSync('password')
      removeStorageSync('checked')
    }
  }
  // 显示重置密码的表单
  showReset = () => this.setState({ resetStatus: true })
  // 重置密码
  onReset = () => {
    const { username, idnumber } = this.state

    if (username && idnumber) {
      if (idnumber.length == 18) {
        const data = {
          func: 'reset',
          data: {
            account: username,
            sfzjh: idnumber
          }
        }
        ajax('base', data, true).then(() =>
          nocancel('你的教务处密码已重置为身份证后6位！')
        )
      } else {
        noicon('身份证号格式错误！')
      }
    } else {
      noicon('你还未输入学号、身份证号')
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
      randomcode,
      resetStatus,
      idnumber,
      btnTxt,
      base64
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
              maxLength='8'
              value={username}
              onChange={this.changeName}
            />
            <AtInput
              title='身份证号'
              maxLength='18'
              type='idcard'
              placeholder='请输入身份证号'
              value={idnumber}
              onChange={this.changeID}
              onConfirm={this.onReset}
            />
            <AtButton className='btn' type='primary' formType='submit'>
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
            maxLength='9'
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
            maxLength='4'
            value={randomcode}
            onChange={this.changeRCode}
            onConfirm={this.onSubmit}
          >
            {base64 ? (
              <Image onClick={this.getRCode} src={base64} />
            ) : (
              <View onClick={this.getRCode} className='uline'>
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
          <AtButton className='btn' type='primary' formType='submit'>
            {btnTxt}
          </AtButton>
        </AtForm>
        <View className='help-text fz26 c9'>
          <View className='text'>
            <View className='uline forget' onClick={this.showReset}>
              遗忘密码？点击重置
            </View>
            <View>看不清验证码？</View>
            <View>　点击验证码图片即可切换</View>
            <View>没有显示验证码？</View>
            <View>　极有可能是教务处无法访问，你可以再次获取验证码</View>
          </View>
        </View>
      </View>
    )
  }
}
