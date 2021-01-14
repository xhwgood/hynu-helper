import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtForm, AtInput, AtRadio } from 'taro-ui'
import Logo from '@components/logo'
import PwdInput from '@components/pwd-input'
import YxyLogin from '@components/treasure/card/login'
import ajax from '@utils/ajax'
import { showError } from '@utils/taroutils'
import crypto from '@utils/crypto'
import validXH from '@utils/validXH'
import { primary_color } from '@styles/color.js'
import './login.scss'

export default class Login extends Taro.Component {
  config = {
    navigationBarBackgroundColor: '#A80000',
    navigationBarTitleText: '绑定校园卡',
    navigationBarTextStyle: 'white'
  }

  state = {
    /** 学号 */
    username: '',
    /** 查询密码 */
    oriPassword: '',
    /** 按钮不可用 */
    disabled: false,
    /** 绑定类型 */
    bindType: 'pwd',
    /** 姓名 */
    name: '',
    /** 手机号 */
    phone: '',
    /** 验证码 */
    verification: ''
  }
  // 绑定校园卡
  onSubmit = () => {
    const {
      username,
      oriPassword,
      bindType,
      name,
      phone,
      verification
    } = this.state
    Taro.setStorageSync('username', username)
    let data
    if (bindType == 'pwd') {
      if (!validXH(username)) {
        return showError('学号输入有误')
      }
      if (
        oriPassword &&
        /^[0-9]*$/.test(oriPassword) &&
        oriPassword.length == 6
      ) {
        this.setState({ disabled: true })
        const Password = crypto(oriPassword)
        data = {
          func: 'login',
          data: {
            UserNumber: username,
            Password
          }
        }
      } else {
        return showError('密码输入有误，应为6位数字')
      }
    } else if (bindType == 'name') {
      if (!validXH(username)) {
        return showError('学号输入有误')
      }
      if (!name.length) {
        return showError('你还未输入姓名')
      }
      this.setState({ disabled: true })
      /** 通过姓名绑定 */
      data = {
        func: 'bindName',
        data: {
          incomeAccount: username,
          realName: name
        }
      }
    } else {
      // 通过手机号验证码绑定
      if (phone.length != 11) {
        return showError('手机号格式错误')
      }
      if (verification.length != 6) {
        return showError('验证码输入错误')
      }
      data = {
        func: 'verLogin',
        data: {
          phone,
          verificationCode: verification
        }
      }
    }
    ajax('card', data)
      .then(res => {
        Taro.setStorageSync('card', res)
        Taro.navigateBack()
      })
      .finally(() => this.setState({ disabled: false }))
  }
  /**
   * 改变绑定方式
   * @param {String} bindType 绑定类型
   */
  changeBindType = bindType => this.setState({ bindType })

  changeName = e => this.setState({ username: e })
  changePass = e => this.setState({ oriPassword: e })
  changePhone = phone => this.setState({ phone })
  changeVerification = verification => this.setState({ verification })

  onShareAppMessage() {
    return {
      title: SLOGAN,
      path: PATH,
      imageUrl: SHARE
    }
  }

  render() {
    const {
      username,
      oriPassword,
      disabled,
      bindType,
      name,
      phone,
      verification
    } = this.state

    return (
      <View className='login-card'>
        <Logo />
        <AtRadio
          options={[
            { label: '通过查询密码绑定', value: 'pwd' },
            {
              label: '通过姓名绑定',
              value: 'name'
            }
            // {
            //   label: '通过《易校园》账号绑定',
            //   value: 'yxy',
            //   desc: '你的《易校园》账号绑定校园卡后才能使用该方式噢'
            // }
          ]}
          className='mb10'
          value={bindType}
          onClick={this.changeBindType}
        />
        <AtForm
          onSubmit={this.onSubmit}
          customStyle={{ background: primary_color }}
        >
          {bindType != 'yxy' ? (
            <View>
              <AtInput
                title='学号'
                placeholder='请输入学号'
                value={username}
                clear
                onChange={this.changeName}
              />
              {bindType == 'pwd' ? (
                <PwdInput
                  placeholder='请输入查询密码'
                  value={oriPassword}
                  onChange={this.changePass}
                  onConfirm={this.onSubmit}
                  maxLength='6'
                />
              ) : (
                <AtInput
                  title='姓名'
                  placeholder='请输入姓名'
                  value={name}
                  onChange={name => this.setState({ name })}
                  onConfirm={this.onSubmit}
                />
              )}
            </View>
          ) : (
            <YxyLogin
              onSubmit={this.onSubmit}
              phone={phone}
              verification={verification}
              setPhone={this.changePhone}
              setVerification={this.changeVerification}
            />
          )}
          <AtButton disabled={disabled} type='primary' formType='submit'>
            绑定校园卡
          </AtButton>
        </AtForm>
        {bindType == 'pwd' && (
          <View className='c9 fz30' style={{ padding: '0 8rpx' }}>
            *密码在传输前已进行加密，请您放心。如果遗忘密码，可以尝试其他绑定方式。
            <View>如果不曾修改过密码，密码为身份证后6位</View>
          </View>
        )}
      </View>
    )
  }
}
