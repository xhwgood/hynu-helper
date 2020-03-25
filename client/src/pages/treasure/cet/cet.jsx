import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtForm, AtInput, AtModal } from 'taro-ui'
import ajax from '@utils/ajax'
import './cet.scss'

export default class Arrange extends Component {
  config = {
    navigationBarBackgroundColor: '#fcbad3',
    navigationBarTitleText: 'cet查询',
    navigationBarTextStyle: 'white'
  }

  state = {
    src: '',
    zkzh: '',
    name: '',
    randomcode: '',
    queryRandomode: '',
    queryStatus: false,
    base64: '',
    idnumber: '',
    isOpen: false
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
    const { zkzh, name } = this.state
    if (zkzh && name) {
      const data = {
        func: 'getRandom',
        data: {
          zkzh
        }
      }
      ajax('cet', data).then(res => {
        const { cookie, random } = res
        this.setState({
          src: `http://cet.neea.edu.cn/imgs/${random}.png`
        })
        this.cookie = cookie
      })
    } else {
      Taro.hideLoading()
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
      const data = {
        func: 'query',
        data: {
          random: randomcode,
          cookie: this.cookie,
          name,
          zkzh
        }
      }
      ajax('cet', data).then(res => {
        const { data: obj, code } = res
        if (code == 200) {
          Taro.navigateTo({ url: `./score?obj=${JSON.stringify(obj)}` })
        }
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
    const { name, idnumber, queryRandomode } = this.state
    if (name && idnumber.length == 18 && queryRandomode.length == 4) {
      const data = {
        func: 'queryID',
        data: {
          random: queryRandomode,
          cookie: this.sessionid,
          name,
          idnumber
        }
      }
      ajax('cet', data).then(res => {
        let { body } = res
        body = JSON.parse(body)
        const { ExceuteResultType, Message } = body
        if (ExceuteResultType > 0) {
          const message = JSON.parse(Message)[0]
          this.setState({
            zkzh: message.TestTicket,
            isOpen: true
          })
        } else {
          Taro.showToast({
            title: Message,
            icon: 'none'
          })
        }
      })
    } else {
      Taro.showToast({
        title: '身份证号、姓名及验证码都需填写',
        icon: 'none'
      })
      Taro.hideLoading()
    }
  }

  handleCancel = () => {
    this.setState({ isOpen: false })
  }

  render() {
    const {
      zkzh,
      name,
      randomcode,
      src,
      queryStatus,
      idnumber,
      queryRandomode,
      isOpen
    } = this.state

    return (
      <View>
        <AtForm onSubmit={this.onSubmit} className='form'>
          <AtInput
            title='准考证号'
            placeholder='请输入准考证号（15位）'
            clear
            maxLength='15'
            border={true}
            value={zkzh}
            onChange={this.changeZkzh}
          />
          <AtInput
            title='姓名'
            placeholder='请输入姓名'
            border={true}
            value={name}
            onChange={this.changeName}
          />
          <AtInput
            clear
            title='验证码'
            placeholder='请输入验证码'
            maxLength='4'
            onFocus={this.getRCode}
            value={randomcode}
            onChange={this.changeRCode}
          >
            {src ? (
              <Image onClick={this.getRCode} src={src} />
            ) : (
              <View onClick={this.getRCode} className='line'>
                获取验证码
              </View>
            )}
          </AtInput>
          <AtButton className='submit' type='primary' formType='submit'>
            立即查询
          </AtButton>
        </AtForm>
        <View className='help-text'>
          <View className='text'>
            <View className='line forget' onClick={this.showQuery}>
              准考证号忘记了不用慌，点我查询
            </View>
            <View>看不清验证码？</View>
            <View>　点击验证码图片即可切换</View>
            <View>没有显示验证码？</View>
            <View>　可能是接口出现问题，此功能已无法使用</View>
          </View>
        </View>
        {queryStatus && (
          <AtForm onSubmit={this.onQuery} className='form'>
            <AtInput
              title='身份证号'
              maxLength='18'
              placeholder='请输入身份证号'
              value={idnumber}
              onChange={this.changeID}
            />
            <AtInput
              title='姓名'
              placeholder='请输入姓名'
              value={name}
              onChange={this.changeName}
            />
            <AtInput
              clear
              title='验证码'
              placeholder='请输入验证码'
              maxLength='4'
              value={queryRandomode}
              onChange={this.changeQueryRCode}
            >
              <Image onClick={this.queryCode} src={base64} />
            </AtInput>
            <AtButton className='submit' type='primary' formType='submit'>
              查询准考证号
            </AtButton>
          </AtForm>
        )}
        <AtModal
          isOpened={isOpen}
          onCancel={this.handleCancel}
          cancelText='确定'
          content={`你的准考证号为${zkzh}，已为你填入上方表格中`}
        />
      </View>
    )
  }
}
