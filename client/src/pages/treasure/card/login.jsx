import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtForm, AtInput } from 'taro-ui'
import Logo from '@components/logo'
import ajax from '@utils/ajax'
import crypto from '@utils/crypto'
import './login.scss'

export default class Login extends Taro.Component {
  config = {
    navigationBarBackgroundColor: '#A80000',
    navigationBarTitleText: '绑定校园卡',
    navigationBarTextStyle: 'white'
  }

  state = {
    username: '',
    oriPassword: ''
  }

  onSubmit = () => {
    const { username, oriPassword } = this.state
    Taro.setStorageSync('username', username)
    const Password = crypto(oriPassword)
    if (username && oriPassword) {
      const data = {
        func: 'login',
        data: {
          UserNumber: username,
          Password
        }
      }
      ajax('card', data).then(res => {
        Taro.setStorageSync('card', res)
        // Taro.getCurrentPages()[0].$component.setState({ card: res })
        Taro.navigateBack()
      })
    } else {
      Taro.showToast({
        title: '你还未输入学号及登录密码',
        icon: 'none'
      })
    }
  }

  changeName = e => {
    this.setState({ username: e })
  }
  changePass = e => {
    this.setState({ oriPassword: e })
  }

  render() {
    const { username, oriPassword } = this.state

    return (
      <View>
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
            title='登录密码'
            type='password'
            placeholder='请输入登录密码'
            maxLength='6'
            value={oriPassword}
            onChange={this.changePass}
          />
          <AtButton className='mtop' type='primary' formType='submit'>
            绑定校园卡
          </AtButton>
        </AtForm>
      </View>
    )
  }
}
