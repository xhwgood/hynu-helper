import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtForm, AtInput } from 'taro-ui'
import Logo from '@components/logo'
import PwdInput from '@components/pwd-input'
import ajax from '@utils/ajax'
import { noicon } from '@utils/taroutils'
import crypto from '@utils/crypto'
import { primary_color } from '@styles/color.js'
import './login.scss'

export default class Login extends Taro.Component {
  config = {
    navigationBarBackgroundColor: '#A80000',
    navigationBarTitleText: '绑定校园卡',
    navigationBarTextStyle: 'white'
  }

  state = {
    username: '',
    oriPassword: '',
    /** 按钮不可用 */
    disabled: false
  }
  // 绑定校园卡
  onSubmit = () => {
    const { username, oriPassword } = this.state
    Taro.setStorageSync('username', username)
    if (username && oriPassword) {
      if (/^[0-9]*$/.test(oriPassword) && oriPassword.length == 6) {
        this.setState({ disabled: true })
        const Password = crypto(oriPassword)
        const data = {
          func: 'login',
          data: {
            UserNumber: username,
            Password
          }
        }
        ajax('card', data)
          .then(res => {
            Taro.setStorageSync('card', res)
            Taro.navigateBack()
          })
          .finally(() => this.setState({ disabled: false }))
      } else {
        noicon('输入错误，密码为6位数字')
      }
    } else {
      noicon('你还未输入学号及查询密码')
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
    const { username, oriPassword, disabled } = this.state

    return (
      <View>
        <Logo />
        <AtForm
          onSubmit={this.onSubmit}
          customStyle={{ background: primary_color }}
        >
          <AtInput
            title='学号'
            placeholder='请输入学号'
            value={username}
            onChange={this.changeName}
          />
          <PwdInput
            placeholder='请输入查询密码'
            value={oriPassword}
            onChange={this.changePass}
            onConfirm={this.onSubmit}
            maxLength='6'
          />
          <AtButton disabled={disabled} type='primary' formType='submit'>
            绑定校园卡
          </AtButton>
        </AtForm>
        <View className='c9 fz30'>
          *密码在传输前已进行加密，请您放心。如果遗忘密码，建议找相关老师寻求帮助。
        </View>
      </View>
    )
  }
}
