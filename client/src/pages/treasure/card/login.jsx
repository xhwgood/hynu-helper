import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtForm, AtInput } from 'taro-ui'
import Logo from '@components/logo'
import ajax from '@utils/ajax'
import noicon from '@utils/noicon'
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
  // 绑定校园卡
  onSubmit = () => {
    const { username, oriPassword } = this.state
    Taro.setStorageSync('username', username)
    const Password = crypto(oriPassword)
    if (username && oriPassword) {
      if (/^[0-9]*$/.test(oriPassword) && oriPassword.length == 6) {
        const data = {
          func: 'login',
          data: {
            UserNumber: username,
            Password
          }
        }
        ajax('card', data).then(res => {
          Taro.setStorageSync('card', res)
          Taro.navigateBack()
        })
      } else {
        noicon('输入错误，密码为6位数字')
      }
    } else {
      noicon('你还未输入学号及登录密码')
    }
  }

  changeName = e => this.setState({ username: e })
  changePass = e => this.setState({ oriPassword: e })

  onShareAppMessage() {
    return {
      title: SLOGAN,
      path: PATH,
      imageUrl: SHARE
    }
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
            maxLength='9'
            value={username}
            onChange={this.changeName}
          />
          <AtInput
            title='查询密码'
            type='password'
            placeholder='请输入查询密码'
            onConfirm={this.onSubmit}
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
