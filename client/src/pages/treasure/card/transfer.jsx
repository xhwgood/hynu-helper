import Taro, { Component } from '@tarojs/taro'
import { View, Text, Navigator } from '@tarojs/components'
import PwdInput from '@components/pwd-input'
import { AtButton, AtForm, AtInput } from 'taro-ui'
import ajax from '@utils/ajax'
import crypto from '@utils/crypto'
import { primary_color } from '@styles/color.js'
import { noicon, nocancel } from '@utils/taroutils'
import './login.scss'

export default class Transfer extends Component {
  config = {
    navigationBarBackgroundColor: '#A80000',
    navigationBarTitleText: '校园卡充值',
    navigationBarTextStyle: 'white'
  }
  constructor(props) {
    super(props)
      /** 校园卡信息 */
      const card = Taro.getStorageSync('card')

    this.state = {
      /** 要充值的金额 */
      money: '',
      /** 未加密的密码 */
      oriPassword: '',
      card
    }
  }

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
        this.closeTransfer()
        nocancel(res.msg)
        this.setState({
          money: '',
          oriPassword: ''
        })
      })
    } else {
      noicon('你还未输入金额及交易密码')
    }
  }
  // 校园卡充值：金额和交易密码
  changeMoney = e => this.setState({ money: e })
  changePass = e => this.setState({ oriPassword: e })

  render() {
    const { money, password } = this.state

    return (
      <View>
        <AtForm
          onSubmit={this.bankTransfer}
          customStyle={{ background: primary_color }}
        >
          <AtInput
            title='金额'
            type='digit'
            placeholder='请输入金额'
            maxLength='8'
            value={money}
            onChange={this.changeMoney}
          />
          <PwdInput
            placeholder='请输入6位交易密码'
            onConfirm={this.bankTransfer}
            maxLength='6'
            value={password}
            onChange={this.changePass}
          />
          <AtButton type='primary' formType='submit'>
            立即充值
          </AtButton>
        </AtForm>
        <View className='c9 fz30'>*密码在传输前已进行加密，请您放心</View>
      </View>
    )
  }
}
