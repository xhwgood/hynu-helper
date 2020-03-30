import Taro from '@tarojs/taro'
import { View, Checkbox, CheckboxGroup, Label } from '@tarojs/components'
import { AtButton, AtForm, AtInput } from 'taro-ui'
import Logo from '@components/logo'
import ajax from '@utils/ajax'
import getTerm from '@utils/getTerm'
import { set as setGlobalData } from '@utils/global_data.js'
import { slogan, path } from '@utils/slogan.js'
import './login.scss'

export default class Login extends Taro.Component {
  config = {
    navigationBarTitleText: '绑定教务处'
  }
  state = {
    username: '',
    password: '',
    randomcode: '',
    base64: '',
    idnumber: '',
    checked: false,
    resetStatus: false
  }

  getMyClass = () => {
    const sessionid = Taro.getStorageSync('sid')
    const data = {
      func: 'getClass',
      data: {
        sessionid
      }
    }
    ajax('base', data).then(res => {
      Taro.removeStorageSync('allWeek')
      const { myClass } = res
      Taro.setStorageSync('myClass', myClass)
      // Taro.setStorageSync('xsid', xsid)
      Taro.getCurrentPages()[0].$component.dealClassCalendar(myClass)
    })
  }

  onSubmit = () => {
    const { username, password, randomcode } = this.state
    const sessionid = Taro.getStorageSync('sid')
    Taro.setStorageSync('username', username)
    if (Taro.getStorageSync('checked')) {
      Taro.setStorageSync('password', password)
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
          const obj = getTerm(username)
          Taro.setStorage({
            key: 'myterm',
            data: obj
          })
          const { getClass } = this.$router.params
          if (getClass) {
            this.getMyClass()
          }
          // 重定向到之前想要进入的页面
          const page = Taro.getStorageSync('page')
          if (page) {
            Taro.redirectTo({
              url: `../treasure/${page}/${page}`
            })
          } else {
            Taro.navigateBack()
          }
        }
      })
    } else {
      Taro.showToast({
        title: '你还未输入学号、密码及验证码',
        icon: 'none'
      })
    }
  }

  changeName = e => this.setState({ username: e })
  changePass = e => this.setState({ password: e })
  changeRCode = e => this.setState({ randomcode: e })
  changeID = e => this.setState({ idnumber: e })

  getRCode = () => {
    Taro.cloud
      .callFunction({
        name: 'randomcode',
        data: {
          url: 'http://59.51.24.46/hysf/verifycode.servlet'
        }
      })
      .then(res => {
        if (res.result) {
          const { base64, sessionid } = res.result
          this.setState({ base64 })
          Taro.setStorageSync('sid', sessionid)
        } else {
          Taro.showToast({
            title: '教务处无法访问！请稍后再试',
            icon: 'none'
          })
        }
      })
      .catch(err => console.error(err))
  }

  checkboxChange = e => {
    if (e.detail.value.length) {
      Taro.setStorageSync('password', this.state.password)
      Taro.setStorageSync('checked', true)
    } else {
      Taro.removeStorageSync('password')
      Taro.removeStorageSync('checked')
    }
  }

  showReset = () => this.setState({ resetStatus: true })

  onReset = () => {
    const { username, idnumber } = this.state
    this.setState({ randomcode: '' })

    if (username && idnumber) {
      const data = {
        func: 'reset',
        data: {
          account: username,
          sfzjh: idnumber
        }
      }
      ajax('base', data).then()
    } else {
      Taro.showToast({
        title: '你还未输入学号、身份证号',
        icon: 'none'
      })
    }
  }

  componentWillMount() {
    const username = Taro.getStorageSync('username')
    const password = Taro.getStorageSync('password')
    const checked = Taro.getStorageSync('checked')
    this.setState({ username, password, checked })
    this.getRCode()
  }
  componentWillUnmount() {
    Taro.removeStorage({ key: 'page' })
  }

  onShareAppMessage() {
    return {
      title: slogan,
      path,
      imageUrl: 'http://cdn.xianghw.xyz/loogo_share.png'
    }
  }

  render() {
    const {
      checked,
      username,
      password,
      randomcode,
      resetStatus,
      idnumber
    } = this.state

    return (
      <View className='container'>
        <Logo />
        <AtForm onSubmit={this.onSubmit} className='form'>
          <AtInput
            title='学号'
            placeholder='请输入学号'
            maxLength='8'
            value={username}
            onChange={this.changeName}
          />
          <AtInput
            title='密码'
            type='password'
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
          >
            {base64 ? (
              <Image onClick={this.getRCode} src={base64} />
            ) : (
              <View onClick={this.getRCode} className='line'>
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
          <AtButton className='mtop' type='primary' formType='submit'>
            立即绑定
          </AtButton>
        </AtForm>
        <View className='help-text'>
          <View className='text'>
            <View className='line forget' onClick={this.showReset}>
              密码忘记了不用慌，点我重置
            </View>
            <View>看不清验证码？</View>
            <View>　点击验证码图片即可切换</View>
            <View>没有显示验证码？</View>
            <View>　极有可能是教务处无法访问，你可以再次获取验证码</View>
          </View>
        </View>
        {resetStatus && (
          <AtForm onSubmit={this.onReset} className='form'>
            <AtInput
              title='学号'
              placeholder='请输入学号'
              maxLength='8'
              value={username}
              onChange={this.changeName}
            />
            <AtInput
              title='身份证号'
              maxLength='18'
              placeholder='请输入身份证号'
              value={idnumber}
              onChange={this.changeID}
            />
            <AtButton type='primary' formType='submit'>
              立即重置
            </AtButton>
          </AtForm>
        )}
      </View>
    )
  }
}
