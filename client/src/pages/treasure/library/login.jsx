import Taro, { Component, setStorageSync } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtForm, AtInput } from 'taro-ui'
import Logo from '@components/logo'
import PwdInput from '@components/pwd-input'
import ajax from '@utils/ajax'
import { noicon } from '@utils/taroutils'
import { set as setGlobalData } from '@utils/global_data.js'
import './library.scss'

export default class LibraryLogin extends Component {
  config = {
    navigationBarBackgroundColor: '#a3c6c4',
    navigationBarTitleText: '绑定图书馆账号',
    navigationBarTextStyle: 'white'
  }

  state = {
    username: '',
    password: ''
  }
  // 绑定图书馆账号
  onSubmit = () => {
    const { username, password } = this.state
    setStorageSync('libPass', password)
    setStorageSync('libUsername', username)
    if (username && password) {
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
        })
        .catch(() => noicon('学号或密码错误'))
    } else {
      noicon('你还未输入学号及图书馆密码')
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
    const { username, password } = this.state

    return (
      <View className='library'>
        <Logo />
        <AtForm onSubmit={this.onSubmit} className='form'>
          <AtInput
            title='学号'
            placeholder='请输入学号'
            maxLength='9'
            value={username}
            onChange={this.changeName}
          />
          <PwdInput
            placeholder='图书馆密码，初始密码6个1'
            value={password}
            onChange={this.changePass}
            onConfirm={this.onSubmit}
          />
          <AtButton className='mtop' type='primary' formType='submit'>
            立即绑定
          </AtButton>
        </AtForm>
      </View>
    )
  }
}
