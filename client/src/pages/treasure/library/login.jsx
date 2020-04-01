import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtForm, AtInput } from 'taro-ui'
import Logo from '@components/logo'
import ajax from '@utils/ajax'
import './library.scss'

export default class Library extends Component {
  config = {
    navigationBarBackgroundColor: '#a3c6c4',
    navigationBarTitleText: '绑定图书馆账号',
    navigationBarTextStyle: 'white'
  }

  state = {
    username: '',
    password: ''
  }

  onSubmit = () => {
    const { username, password } = this.state
    Taro.setStorageSync('libPass', password)
    Taro.setStorageSync('username', username)
    if (username && password) {
      const data = {
        func: 'login',
        data: {
          rdid: username,
          password
        }
      }
      ajax('library', data).then(res => {
        if (res.code == 200) {
          Taro.setStorageSync('libSid', res.libSid)
          Taro.setStorageSync('obj', res.obj)
          Taro.navigateBack()
        }
      })
    } else {
      Taro.showToast({
        title: '你还未输入学号及图书馆密码',
        icon: 'none'
      })
    }
  }

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
            type='number'
            maxLength='8'
            value={username}
            onChange={this.changeName}
          />
          <AtInput
            title='图书馆密码'
            type='password'
            placeholder='图书馆密码，初始密码6个1'
            value={password}
            onChange={this.changePass}
          />
          <AtButton className='mtop' type='primary' formType='submit'>
            立即绑定
          </AtButton>
        </AtForm>
      </View>
    )
  }
}
