import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtForm, AtInput } from 'taro-ui'
import './cet.scss'

export default class Arrange extends Component {
  state = {
    src: '',
    zkzh: '',
    name: '',
    randomcode: '',
    queryRandomode: '',
    queryStatus: false,
    base64: '',
    idnumber: ''
  }

  changeName = e => {
    this.setState({ name: e })
  }
  changeZkzh = e => {
    this.setState({ zkzh: e })
  }
  changeRCode = e => {
    this.setState({ randomcode: e })
  }
  changeID = e => {
    this.setState({ idnumber: e })
  }
  changeQueryRCode = e => {
    this.setState({ queryRandomode: e })
  }

  getRCode = () => {
    Taro.showLoading()
    const { zkzh, name } = this.state
    if (zkzh && name) {
      Taro.cloud
        .callFunction({
          name: 'cet',
          data: {
            func: 'getRandom',
            data: {
              zkzh
            }
          }
        })
        .then(res => {
          Taro.hideLoading()
          const { data } = res.result
          let msg = '查询接口出现异常'
          if (data.code === 200) {
            msg = '获取成功'
          }
          this.setState({
            src: `http://cet.neea.edu.cn/imgs/${data.random}.png`
          })
          this.cookie = data.cookie
          Taro.showToast({
            title: msg,
            icon: 'none'
          })
        })
        .catch(err => {
          this.getRCode()
          Taro.showToast({
            title: '出现未知错误！',
            icon: 'none'
          })
        })
    } else {
      Taro.showToast({
        title: '准考证号、姓名都需填写',
        icon: 'none'
      })
    }
  }

  queryCode = () => {
    Taro.cloud
      .callFunction({
        name: 'randomcode',
        data: {
          url: 'http://cet-bm.neea.cn/Home/VerifyCodeImg'
        }
      })
      .then(res => {
        this.setState({ base64: res.result.base64 })
        this.sessionid = res.result.sessionid
      })
      .catch(err => console.error(err))
  }

  onSubmit = () => {
    Taro.showLoading()
    const { name, zkzh, randomcode, src } = this.state
    this.setState({ randomcode: '' })
    if (!src) {
      Taro.showToast({
        title: '你尚未获取验证码',
        icon: 'none'
      })
      return
    }
    if (name && zkzh && randomcode) {
      Taro.cloud
        .callFunction({
          name: 'cet',
          data: {
            func: 'query',
            data: {
              random: randomcode,
              cookie: this.cookie,
              name,
              zkzh
            }
          }
        })
        .then(res => {
          Taro.hideLoading()
          const { data } = res.result
          let msg = '查询接口出现异常'
          const obj = JSON.parse(data.data)
          console.log(obj)
          if (data.code === 200) {
            msg = '获取成功'
          }
          if (obj.error) {
            msg = obj.error
          }

          Taro.showToast({
            title: msg,
            icon: 'none'
          })
        })
        .catch(err => {
          // this.getRCode()
          Taro.hideLoading()
          Taro.showToast({
            title: '出现未知错误！',
            icon: 'none'
          })
        })
    } else {
      Taro.showToast({
        title: '准考证号、姓名及验证码都需填写',
        icon: 'none'
      })
    }
    Taro.hideLoading()
  }

  showQuery = () => {
    this.setState({ queryStatus: true })
    this.queryCode()
  }

  onQuery = () => {
    Taro.showLoading()
    const { name, idnumber, queryRandomode } = this.state
    if (name && idnumber && queryRandomode) {
      Taro.cloud
        .callFunction({
          name: 'cet',
          data: {
            func: 'queryID',
            data: {
              random: queryRandomode,
              cookie: this.sessionid,
              name,
              idnumber
            }
          }
        })
        .then(res => {
          Taro.hideLoading()
          const { data } = res.result
          console.log(data)

          // Taro.showToast({
          //   title: msg,
          //   icon: 'none'
          // })
        })
        .catch(err => {
          Taro.hideLoading()
          Taro.showToast({
            title: '出现未知错误！',
            icon: 'none'
          })
        })
    } else {
      Taro.showToast({
        title: '身份证号、姓名及验证码都需填写',
        icon: 'none'
      })
      Taro.hideLoading()
    }
  }

  render() {
    const {
      zkzh,
      name,
      randomcode,
      src,
      queryStatus,
      idnumber,
      queryRandomode
    } = this.state

    return (
      <View>
        <AtForm onSubmit={this.onSubmit} className="form">
          <AtInput
            title="准考证号"
            placeholder="请输入准考证号（15位）"
            clear
            maxLength="15"
            border={true}
            value={zkzh}
            onChange={this.changeZkzh}
          />
          <AtInput
            title="姓名"
            placeholder="请输入姓名"
            border={true}
            value={name}
            onChange={this.changeName}
          />
          <AtInput
            clear
            title="验证码"
            placeholder="请输入验证码"
            maxLength="4"
            value={randomcode}
            onChange={this.changeRCode}
          >
            {src ? (
              <Image onClick={this.getRCode} src={src} />
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
          <View className="line forget" onClick={this.showQuery}>
            准考证号忘记了点我查询
          </View>
          <View>看不清验证码？</View>
          <View>点击验证码图片即可切换</View>
          <View>没有显示验证码？</View>
          <View>可能是CET官网接口出现问题，欢迎反馈</View>
        </View>
        {queryStatus && (
          <AtForm onSubmit={this.onQuery} className="form">
            <AtInput
              title="身份证号"
              maxLength="18"
              placeholder="请输入身份证号"
              value={idnumber}
              onChange={this.changeID}
            />
            <AtInput
              title="姓名"
              placeholder="请输入姓名"
              value={name}
              onChange={this.changeName}
            />
            <AtInput
              clear
              title="验证码"
              placeholder="请输入验证码"
              maxLength="4"
              value={queryRandomode}
              onChange={this.changeQueryRCode}
            >
              <Image onClick={this.queryCode} src={base64} />
            </AtInput>
            {/* class删掉 */}
            <AtButton type="primary" formType="submit">
              查询准考证号
            </AtButton>
          </AtForm>
        )}
      </View>
    )
  }
}
