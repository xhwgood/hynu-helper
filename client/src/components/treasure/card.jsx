import Taro, { Component } from '@tarojs/taro'
import {
  AtIcon,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtInput
} from 'taro-ui'
import crypto from '@utils/crypto'
import ajax from '@utils/ajax'
import noicon from '@utils/noicon'
import navigate from '@utils/navigate'
import { View, Text, Button, Image, Navigator } from '@tarojs/components'
import './card.scss'

export default class Index extends Component {
  constructor(props) {
    super(props)
    const card = Taro.getStorageSync('card')

    this.state = {
      // 充值模态框，测试时为 true
      opened: false,
      card,
      money: '',
      oriPassword: ''
    }
  }
  // 充值模态框显/隐
  showTransfer = () => this.setState({ opened: true })
  onCancel = () => this.setState({ opened: false })
  // 充值
  bankTransfer = () => {
    const { money, oriPassword, card } = this.state
    if (money && oriPassword.length == 6) {
      if (Number(money) <= 0) {
        noicon('请输入正确金额')
        return
      }
      const Password = crypto(oriPassword)
      const data = {
        func: 'bankTransfer',
        data: {
          AccNum: card.AccNum,
          MonTrans: money,
          Password
        }
      }
      ajax('card', data).then(res => {
        if (res.code == 200) {
          this.setState({ opened: false })
        }
      })
    } else {
      noicon('你还未输入金额及交易密码')
    }
  }
  // 查询校园卡余额
  queryAccNum = (e, notoast = false) => {
    e && e.stopPropagation()
    const { AccNum } = this.state.card
    if (!AccNum) {
      return
    }
    const data = {
      func: 'queryAccWallet',
      data: {
        AccNum
      }
    }
    ajax('card', data, notoast).then(res => {
      const { balance } = res
      this.setState({
        card: { ...this.state.card, balance }
      })
      const card = Taro.getStorageSync('card')
      card.balance = balance
      Taro.setStorageSync('card', card)
    })
  }
  // 校园卡充值：金额和交易密码
  changeMoney = e => this.setState({ money: e })
  changePass = e => this.setState({ oriPassword: e })

  // 绑定校园卡
  login = () => {
    const card = Taro.getStorageSync('card')
    if (!card.balance) {
      navigate('请先绑定校园卡', '/pages/treasure/card/login')
    }
  }
  // 扫一扫
  // scan = () => {
  //   Taro.scanCode({
  //     success: res => {
  //       Taro.showLoading()
  //     }
  //   })
  //   Taro.hideLoading()
  // }

  componentDidShow() {
    const card = Taro.getStorageSync('card')
    // 尚未开学，不再每次都查询校园卡余额
    // this.setState({ card }, () => this.queryAccNum())
    this.setState({ card })
  }
  componentDidHide() {
    // 若没有关闭校园卡充值模态框，则自动关闭
    this.onCancel()
  }

  render() {
    const { card, opened, money, oriPassword } = this.state

    return (
      <View className='container'>
        <View className='card' onClick={this.login}>
          <View className='my-card'>
            <View onClick={this.queryAccNum} style={{ paddingRight: '20px' }}>
              <AtIcon value='reload' size='20' color='#fff' />
              <Text className='ml'>刷新</Text>
            </View>
            <View>校园卡</View>
          </View>
          <View className='money'>
            <Image className='bg' src={`${CDN}/card-bg.png`} />
            <View className='balance'>
              {card.balance ? (
                <View>
                  <Text style={{ fontSize: '34px' }}>￥</Text>
                  {card.balance}
                </View>
              ) : (
                <Text className='un'>立即绑定校园卡</Text>
              )}
            </View>
          </View>
        </View>
        {card.balance && (
          <View className='card-drawer'>
            <Navigator
              className='list'
              url={`./card/bill?AccNum=${card.AccNum}`}
              hoverClass='none'
            >
              <AtIcon prefixClass='icon' value='zd' size='20' color='#fff' />
              账单
            </Navigator>
            <View className='list' onClick={this.showTransfer}>
              <AtIcon
                prefixClass='icon'
                value='charge'
                size='19'
                color='#fff'
              />
              充值
            </View>
            {/* <View className='list' onClick={this.getRandomNum}>
              <AtIcon value='credit-card' size='20' color='#fff' />
              <Text className='ml'>虚拟校园卡</Text>
            </View> */}
            {/* <View className='list' onClick={this.scan}>
              <AtIcon prefixClass='icon' value='scan' size='20' color='#fff' />
              扫一扫
            </View> */}
          </View>
        )}
        <AtModal isOpened={opened} onClose={this.onCancel}>
          <AtModalHeader>充值</AtModalHeader>
          <AtModalContent>
            <Text>
              {card.BankName}（尾号 {card.BankCard}）
            </Text>
            <AtInput
              title='金额'
              type='digit'
              placeholder='请输入金额'
              maxLength='4'
              value={money}
              onChange={this.changeMoney}
            />
            <AtInput
              title='交易密码'
              type='password'
              placeholder='请输入6位交易密码'
              onConfirm={this.bankTransfer}
              maxLength='6'
              value={oriPassword}
              onChange={this.changePass}
            />
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.onCancel}>取消</Button>
            <Button onClick={this.bankTransfer}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
