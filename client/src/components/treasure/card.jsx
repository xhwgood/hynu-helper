import Taro, { Component } from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import NumberAnimate from '@utils/NumberAnimate'
import ajax from '@utils/ajax'
import { View, Text, Image, Navigator } from '@tarojs/components'
import { noicon, nocancel } from '@utils/taroutils'
import './card.scss'

export default class Index extends Component {
  constructor() {
    const card = Taro.getStorageSync('card')

    this.state = {
      card,
      /** 刷新图标动画 */
      isReload: false
    }
  }
  /** 10秒钟内最多刷新一次余额 */
  timer = null
  /**
   * 查询校园卡余额
   * @param {Event} e 点击事件
   * @param {Boolean} notoast 是否有toast提示
   */
  queryAccNum = (e, notoast = false) => {
    const { AccNum } = this.state.card
    this.setState({ isReload: false })
    if (!AccNum) {
      return
    }
    if (!this.timer) {
      this.setState({ isReload: true })
      const data = {
        func: 'queryAccWallet',
        data: {
          AccNum
        }
      }
      ajax('card', data, notoast).then(({ balance: endNum }) => {
        const { balance } = this.state
        this.setState({ isReload: false })
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
      this.timer = setTimeout(() => {
        this.timer = null
      }, 10000)
    } else {
      if (!notoast) {
        noicon('请勿频繁刷新哦')
      }
    }
  }

  /** 绑定校园卡 */
  login = () => {
    const { card } = this.state
    if (!card.AccNum) {
      Taro.navigateTo({ url: '/pages/treasure/card/login' })
    }
  }
  /** 扫一扫 */
  scan = () => {
    Taro.scanCode({
      onlyFromCamera: true,
      success: res => {
        console.log(res)
      }
    })
  }

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
    const { card, balance, animation, isReload } = this.state

    return (
      <View className='container'>
        <View className='card' onClick={this.login}>
          <View className='my-card'>
            <View onClick={this.queryAccNum} style={{ paddingRight: '20px' }}>
              <AtIcon
                value='reload'
                customStyle={{
                  transform: isReload ? 'rotate(360deg)' : '',
                  transition: 'All 0.8s ease'
                }}
                size='20'
                color='#fff'
              />
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
        {card.AccNum && (
          <View
            className='card-drawer'
            animation={animation}
            style={{ bottom: '50px' }}
          >
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
              url={card.BankCard ? `./card/transfer` : ''}
              hoverClass='none'
              onClick={() => {
                if (!card.BankCard) {
                  nocancel('很抱歉，未获取到你的银行卡号，无法使用充值功能。')
                }
              }}
            >
              <AtIcon
                prefixClass='icon'
                value='charge'
                size='19'
                color='#fff'
              />
              充值
            </Navigator>
            <View className='list' onClick={() => this.props.getRandomNum()}>
              <AtIcon value='credit-card' size='20' color='#fff' />
              <Text className='ml'>虚拟卡</Text>
            </View>
            {/* <View className='list' onClick={this.scan}>
              <AtIcon prefixClass='icon' value='scan' size='20' color='#fff' />
              扫一扫
            </View> */}
          </View>
        )}
      </View>
    )
  }
}
