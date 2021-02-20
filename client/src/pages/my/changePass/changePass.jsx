import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtButton, AtForm, AtInput } from 'taro-ui'
import { primary_color, secondary_color9 } from '@styles/color'
import { nocancel } from '@utils/taroutils'
import ajax from '@utils/ajax'
import PwdInput from '@components/pwd-input'
import './changePass.scss'

export default class Index extends Component {
  config = {
    navigationBarBackgroundColor: '#A80000',
    navigationBarTitleText: '教务处密码修改',
    navigationBarTextStyle: 'white'
  }

  state = {
    oldpassword: '',
    password1: '',
    password2: '',
    disabled: false
  }

  handleSubmit = () => {
    const { oldpassword, password1, password2 } = this.state
    if (oldpassword == password1) {
      return nocancel('新密码不可和旧密码一样')
    }
    if (password1 != password2) {
      return nocancel('输入的两次新密码不一致，请重新输入')
    }
    if (password1.length < 8) {
      return nocancel('新密码需大于8个字符')
    }

    this.setState({ disabled: true })
    const data = {
      func: 'changePass',
      data: {
        ...this.state,
        sessionid: 'sessionid'
      }
    }
    ajax('base', data).catch(() => this.setState({ disabled: false }))
  }

  render() {
    const { oldpassword, password1, password2, disabled } = this.state

    return (
      <View>
        <AtForm
          onSubmit={this.handleSubmit}
          className='form'
          customStyle={{ background: primary_color }}
        >
          <PwdInput
            title='旧密码'
            placeholder='请输入旧密码'
            value={oldpassword}
            onChange={e => this.setState({ oldpassword: e })}
          />
          <PwdInput
            title='新密码'
            placeholder='请输入新密码'
            value={password1}
            onChange={e => this.setState({ password1: e })}
          />
          <PwdInput
            title='重复新密码'
            placeholder='请再次输入新密码'
            onConfirm={this.handleSubmit}
            value={password2}
            onChange={e => this.setState({ password2: e })}
          />
          <View>新密码需大于8位数，且包含数字和英文</View>
          <AtButton
            disabled={
              disabled ||
              !(oldpassword.length && password1.length && password2.length)
            }
            className='btn'
            type='primary'
            formType='submit'
          >
            确认修改
          </AtButton>
        </AtForm>
      </View>
    )
  }
}
