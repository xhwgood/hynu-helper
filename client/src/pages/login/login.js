import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtForm, AtInput } from 'taro-ui'
import './login.scss'
import Logo from '@components/logo'
import Dialog from '@components/dialog'

export default class Login extends Taro.Component {
  config = {
    navigationBarTitleText: '绑定教务处帐号'
  }
  state = {
    username: '',
    password: '',
    randomcode: '',
    base64: '',
    opened: false
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

  onSubmit = () => {
    Taro.showLoading()
    const { username, password, randomcode } = this.state
    const sessionid = Taro.getStorageSync('sid')
    this.setState({ randomcode: '' })

    if (username && password && randomcode && sessionid) {
      Taro.cloud
        .callFunction({
          name: 'base',
          data: {
            func: 'login',
            data: {
              username,
              password,
              randomcode,
              sessionid
            }
          }
        })
        .then(res => {
          Taro.hideLoading()
          console.log(res)
          const msg = res.result.data || '网络出现异常或教务处无法访问'
          if (!msg.includes('成功')) {
            this.getRCode()
          }
          Taro.showToast({
            title: msg,
            icon: 'none'
          })
          const { getClass } = this.$router.params
          if (getClass) {
            this.getMyClass()
          }
          Taro.navigateBack()
        })
        .catch(err => {
          this.getRCode()

          this.setState({ password: '' })
          Taro.showToast({
            title: '出现未知错误！',
            icon: 'none'
          })
        })
    } else {
      Taro.showToast({
        title: '学号、密码及验证码都需填写',
        icon: 'none'
      })
    }
  }

  changeName = e => {
    this.setState({ username: e })
  }
  changePass = e => {
    this.setState({ password: e })
  }
  changeRCode = e => {
    this.setState({ randomcode: e })
  }

  getRCode = () => {
    Taro.cloud
      .callFunction({
        name: 'randomcode'
      })
      .then(res => {
        this.setState({ base64: res.result.base64 })
        const sessionid = res.result.sessionid
        Taro.setStorageSync('sid', sessionid)
      })
      .catch(err => console.error(err))
  }

  showHelp = () => {
    this.setState({ opened: true })
  }
  closeHelp = () => {
    this.setState({ opened: false })
  }

  componentWillMount() {
    const { office } = this.$router.params
    if (office) {
      this.setState({ office })
      this.getRCode()
    }
  }

  render() {
    const { opened, office, username, password, randomcode } = this.state

    return (
      <View>
        <Logo />
        <AtForm onSubmit={this.onSubmit} className="form">
          <AtInput
            title="学号"
            type="text"
            placeholder="请输入学号"
            maxLength="8"
            border={true}
            value={username}
            onChange={this.changeName}
          />
          <AtInput
            title={office ? '密码' : '登录密码'}
            type="password"
            placeholder={office ? '请输入密码' : '请输入登录密码'}
            border={true}
            value={password}
            onChange={this.changePass}
          />
          {office && (
            <AtInput
              clear
              title="验证码"
              type="text"
              placeholder="请输入验证码"
              maxLength="4"
              value={randomcode}
              onChange={this.changeRCode}
            >
              <Image onClick={this.getRCode} src={base64} />
            </AtInput>
          )}

          {opened && (
            <Dialog onCloseHelp={this.closeHelp}>
              <View className="help-text">
                <View className="text">
                  <View>看不清验证码？</View>
                  <View>　点击验证码图片即可切换</View>
                  <View>没有显示验证码？</View>
                  <View>　极有可能是教务处无法访问</View>
                </View>
              </View>
            </Dialog>
          )}

          {office && (
            <View className="help">
              <View onClick={this.showHelp}>帮助</View>
            </View>
          )}
          <AtButton className="submit" type="primary" formType="submit">
            {office ? '立即绑定' : '绑定校园卡'}
          </AtButton>
        </AtForm>
      </View>
    )
  }
}
