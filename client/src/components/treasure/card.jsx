import Taro, { Component } from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import NumberAnimate from '@utils/NumberAnimate'
import ajax from '@utils/ajax'
import { View, Text, Image, Navigator } from '@tarojs/components'
import './card.scss'

export default class Index extends Component {
  constructor(props) {
    super(props)
    const card = Taro.getStorageSync('card')

    this.state = {
      card
    }
  }
  // 查询校园卡余额
  queryAccNum = (e, notoast = false) => {
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
    ajax('card', data, notoast).then(({ balance: endNum }) => {
      const { balance } = this.state
      // 数据不相等时才进行变化
      if (balance != endNum) {
        let n1 = new NumberAnimate({
          from: this.state.balance,
          to: endNum,
          onUpdate: () =>
            this.setState({
              balance: n1.tempValue
            })
        })
        const card = Taro.getStorageSync('card')
        card.balance = endNum
        Taro.setStorageSync('card', card)
      }
    })
  }

  // 绑定校园卡
  login = () => {
    const { card } = this.state
    if (!card.BankCard) {
      Taro.navigateTo({ url: '/pages/treasure/card/login' })
    }
  }
  /** 虚拟校园卡 */
  getRandomNum = () => {}
  /** 扫一扫 */
  scan = () => {}

  componentWillMount() {
    this.animation = Taro.createAnimation()
  }

  componentDidShow() {
    const card = Taro.getStorageSync('card')
    this.setState(
      {
        card,
        balance: card.balance
      },
      () => this.queryAccNum(false, true)
    )
    // 放假期间不再每次重新获取余额
    // this.setState({ card, balance: card.balance })
    // 校园卡功能弹出动画
    if (card.balance) {
      setTimeout(() => {
        this.animation.translateY(50).step()
        this.setState({ animation: this.animation.export() })
      }, 300)
    }
  }

  render() {
    const { card, balance, animation } = this.state

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
                  {balance}
                </View>
              ) : (
                <Text className='un'>绑定校园卡</Text>
              )}
            </View>
          </View>
        </View>
        {card.BankCard && (
          <View className='card-drawer' animation={animation}>
            <Navigator
              className='list'
              url={`./card/bill?AccNum=${card.AccNum}`}
              hoverClass='none'
            >
              <AtIcon prefixClass='icon' value='zd' size='20' color='#fff' />
              账单
            </Navigator>
            <Navigator
              className='list'
              url={`./card/transfer`}
              hoverClass='none'
            >
              <AtIcon
                prefixClass='icon'
                value='charge'
                size='19'
                color='#fff'
              />
              充值
            </Navigator>
            <View className='list' onClick={this.getRandomNum}>
              <AtIcon value='credit-card' size='20' color='#fff' />
              <Text className='ml'>虚拟卡</Text>
            </View>
            <View className='list' onClick={this.scan}>
              <AtIcon prefixClass='icon' value='scan' size='20' color='#fff' />
              扫一扫
            </View>
          </View>
        )}
      </View>
    )
  }
}
