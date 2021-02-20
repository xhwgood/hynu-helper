import Taro, { Component, setStorageSync } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtForm, AtInput } from 'taro-ui'
import Logo from '@components/logo'
import PwdInput from '@components/pwd-input'
import ajax from '@utils/ajax'
import { showError } from '@utils/taroutils'
import { set as setGlobalData } from '@utils/global_data'
import { primary_color } from '@styles/color'
import validXH from '@utils/validXH'
import './library.scss'

export default class LibraryLogin extends Component {
  config = {
    navigationBarBackgroundColor: '#a3c6c4',
    navigationBarTitleText: '绑定图书馆账号',
    navigationBarTextStyle: 'white'
  }

  state = {
    username: '',
    password: '',
    disabled: false
  }
  // 绑定图书馆账号
  onSubmit = () => {
    const { username, password } = this.state
    if (!validXH(username)) {
      return showError('学号输入有误')
    }
    if (password) {
      this.setState({ disabled: true })
      const data = {
        func: 'login',
        data: {
          rdid: username,
          password
        }
      }
      ajax('library', data)
        .then(res => {
          setGlobalData('libSid', res.libSid)
          setGlobalData('libObj', res.obj)
          Taro.navigateBack()
          setStorageSync('libPass', password)
          setStorageSync('libUsername', username)
        })
        .then(() => this.setState({ disabled: false }))
    } else {
      showError('你还未输入图书馆密码')
    }
  }
  // 输入框
  changeName = e => this.setState({ username: e })
  changePass = e => this.setState({ password: e })

  componentWillMount() {
    const username = Taro.getStorageSync('username')
    this.setState({ username })
  }

  render() {
    const { username, password, disabled } = this.state

    return (
      <View className='library-container'>
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
            placeholder='图书馆密码'
            value={password}
            onChange={this.changePass}
            onConfirm={this.onSubmit}
          />
          <AtButton
            disabled={disabled}
            className='mtop'
            type='primary'
            formType='submit'
          >
            立即绑定
          </AtButton>
        </AtForm>
        <View className='tip fz28 c6'>*图书馆初始密码为身份证号后六位（如含Ｘ，为大写）</View>
      </View>
    )
  }
}
