import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtForm, AtInput } from 'taro-ui'
import Dialog from '@components/dialog'
import './cet.scss'

export default class Arrange extends Component {
  state = {
    base64: '',
    zkzh: '',
    name: ''
  }

  changeName = e => {
    this.setState({ username: e })
  }
  changeZkzh = e => {
    this.setState({ password: e })
  }
  changeRCode = e => {
    this.setState({ randomcode: e })
  }

  getRCode = () => {
    console.log('查四六级验证码')
  }

  render() {
    const { zkzh, name, randomcode } = this.state

    return (
      <View>
        <AtForm onSubmit={this.onSubmit} className="form">
          <AtInput
            title="准考证号"
            type="text"
            placeholder="请输入准考证号（15位）"
            maxLength="15"
            border={true}
            value={zkzh}
            onChange={this.changeZkzh}
          />
          <AtInput
            title="姓名"
            type="text"
            placeholder="请输入姓名"
            border={true}
            value={name}
            onChange={this.changeName}
          />
          <AtInput
            clear
            title="验证码"
            type="text"
            placeholder="请输入验证码"
            maxLength="4"
            value={randomcode}
            onChange={this.changeRCode}
          >
            {base64 ? (
              <Image onClick={this.getRCode} src={base64} />
            ) : (
              <View onClick={this.getRCode} className="line">
                获取验证码
              </View>
            )}
          </AtInput>
          <AtButton className="submit" type="primary" formType="submit">
            立即查询
          </AtButton>
        </AtForm>
        <View className="text">
          <View className="line forget">准考证号忘记了点我查询</View>
          <View>看不清验证码？</View>
          <View>点击验证码图片即可切换</View>
          <View>没有显示验证码？</View>
          <View>可能是CET官网接口出现问题，欢迎反馈</View>
        </View>
      </View>
    )
  }
}
