// @ts-check
import Taro, { Component } from '@tarojs/taro'
import { AtInput, AtIcon } from 'taro-ui'

export default class PwdInput extends Component {
  state = {
    // 显示密码
    pwdIsShow: false
  }

  handlePwdShow = () =>
    this.setState(preState => ({
      pwdIsShow: !preState.pwdIsShow
    }))

  render() {
    const {
      value,
      onChange,
      placeholder,
      onConfirm,
      maxLength,
      title = '密码'
    } = this.props
    const { pwdIsShow } = this.state

    return (
      <AtInput
        title={title}
        type={pwdIsShow ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onConfirm={onConfirm}
        maxLength={maxLength}
        clear
        onChange={onChange}
      >
        <AtIcon
          value='eye'
          size='23'
          color={pwdIsShow ? '#358ece' : '#bbb'}
          onClick={this.handlePwdShow}
        />
      </AtInput>
    )
  }
}
