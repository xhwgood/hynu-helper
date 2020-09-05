import Taro, { Component } from '@tarojs/taro'
import { View, Text, Navigator } from '@tarojs/components'
import PwdInput from '@components/pwd-input'
import { AtButton, AtForm, AtInput, AtIcon, AtSwitch } from 'taro-ui'
import ajax from '@utils/ajax'
import crypto from '@utils/crypto'
import {
  primary_color,
  secondary_color6,
  secondary_color9,
  secondary_color80
} from '@styles/color.js'
import { noicon, nocancel } from '@utils/taroutils'
import {
  set as setGlobalData,
  get as getGlobalData
} from '@utils/global_data.js'
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
    /** 自动充值设置 */
    const autoTransferForm = Taro.getStorageSync('autoTransferForm')
    const {
      limitMoney = '',
      limitBalance = '',
      autoIsOpen = false,
      pwd = ''
    } = autoTransferForm

    this.state = {
      /** 要充值的金额 */
      money: '',
      /** 未加密的密码 */
      oriPassword: '',
      card,
      /** 自动充值设置是否显示 */
      settingIsShow: false,
      /** 自动充值开关 */
      autoIsOpen,
      /** 低于此金额充值 */
      limitBalance,
      /** 充值金额 */
      limitMoney,
      /** 加密过的交易密码 */
      pwd
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
        Taro.navigateBack()
        nocancel(res.msg)
        this.setState({
          money: '',
          oriPassword: ''
        })
        /** 保存加密后的校园卡重置密码 */
        setGlobalData('cardPwd', Password)
      })
    } else {
      noicon('你还未输入金额及交易密码')
    }
  }
  /** 保存自动充值设置 */
  saveAutoTransfer = () => {
    const { limitMoney, limitBalance, autoIsOpen } = this.state
    if (Number(limitMoney) <= 0 || Number(limitBalance) <= 0) {
      noicon('请输入正确金额')
      return
    }
    Taro.setStorageSync('autoTransferForm', {
      limitMoney,
      limitBalance,
      autoIsOpen,
      pwd: getGlobalData('cardPwd')
    })
    noicon('保存成功')
  }

  // 校园卡充值：金额和交易密码
  changeMoney = e => this.setState({ money: e })
  changePass = e => this.setState({ oriPassword: e })

  render() {
    const {
      money,
      password,
      settingIsShow,
      autoIsOpen,
      limitMoney,
      limitBalance,
      pwd
    } = this.state

    return (
      <View>
        <View className='top'>
          <View className='border' style={{ color: secondary_color6 }}>
            建设银行
            <Text style={{ color: secondary_color9 }}>
              尾号（{card.BankCard}）
            </Text>
          </View>
        </View>
        <AtForm
          onSubmit={this.bankTransfer}
          customStyle={{ background: primary_color }}
        >
          <AtInput
            title='充值金额'
            type='digit'
            placeholder='请输入充值金额'
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

        <View style={{ color: secondary_color6 }} className='open-setting'>
          {(getGlobalData('cardPwd') || pwd) && (
            <View
              className='tac'
              onClick={() =>
                this.setState(preState => ({
                  settingIsShow: !preState.settingIsShow
                }))
              }
            >
              <AtIcon
                value={settingIsShow ? 'chevron-up' : 'chevron-down'}
                size='22'
                color={secondary_color80}
              />
              自动充值功能
            </View>
          )}
          {settingIsShow && (
            <View>
              <View className='c9 fz30' style={{ margin: '0 5px' }}>
                自动充值功能是《我的衡师》为衡师学子量身打造的，旨在解决因忘记充值而出现无法刷卡的尴尬情况。在你每一次进入《我的衡师》后，都会自动检测余额并充值
              </View>
              <AtSwitch
                title={autoIsOpen ? '功能已开启' : '功能关闭'}
                checked={autoIsOpen}
                onChange={() =>
                  this.setState(preState => ({
                    autoIsOpen: !preState.autoIsOpen
                  }))
                }
              />
              <AtForm
                onSubmit={this.saveAutoTransfer}
                customStyle={{ background: primary_color }}
              >
                <AtInput
                  title='检测余额'
                  type='digit'
                  placeholder='低于此余额时自动充值'
                  maxLength='8'
                  value={limitBalance}
                  onChange={e => this.setState({ limitBalance: e })}
                />
                <AtInput
                  title='充值金额'
                  type='digit'
                  placeholder='每次自动充值的金额'
                  maxLength='8'
                  value={limitMoney}
                  onChange={e => this.setState({ limitMoney: e })}
                />
                <AtButton type='primary' formType='submit'>
                  保存设置
                </AtButton>
              </AtForm>
            </View>
          )}
        </View>
      </View>
    )
  }
}
