import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ajax from '@utils/ajax'
import { AtIcon } from 'taro-ui'
import { nocancel } from '@utils/taroutils'
import {
  get as getGlobalData,
  set as setGlobalData
} from '@utils/global_data.js'
import { bgColor7, secondary_color4, secondary_colorA } from '@styles/color.js'
import './bill.scss'

export default class Bill extends Component {
  config = {
    navigationBarBackgroundColor: '#A80000',
    navigationBarTitleText: '校园卡账单',
    navigationBarTextStyle: 'white',
    enablePullDownRefresh: true
  }

  state = {
    // 账单详细数据
    bill: {},
    // 月账单数据
    monthBill: {}
  }
  // 账单的起始记录数
  RecNum = 1

  onReachBottom() {
    this.queryDealRec()
  }
  // 查询近期账单，每次查询15条
  queryDealRec = () => {
    const { AccNum } = this.$router.params
    const data = {
      func: 'queryDealRec',
      data: {
        AccNum,
        RecNum: this.RecNum
      }
    }
    ajax('card', data).then(({ obj, monthObj }) => {
      const { bill, monthBill } = this.state
      // 若新获取的数据中有前一个月份的，则合并到前一个月份
      const first = Object.keys(obj)[0]
      if (Object.keys(bill).includes(first)) {
        bill[first] = bill[first].concat(obj[first])
        delete obj[first]
      }
      this.setState(
        {
          bill: { ...bill, ...obj },
          monthBill: { ...monthBill, ...monthObj }
        },
        () => {
          // 保存数据以便用户多次进入查看
          setGlobalData('billData', {
            bill: this.state.bill,
            monthBill: this.state.monthBill
          })
          setGlobalData('billRecNum', this.RecNum)
        }
      )
      // 获取数据后停止当前页面下拉刷新
      Taro.stopPullDownRefresh()
      this.RecNum += 15
    })
  }
  // 查看月账单
  goMonthBill = (monthInfo, month) => {
    const { AccNum } = this.$router.params
    this.$preload({ monthInfo, month, AccNum })
    Taro.navigateTo({
      url: `./monthBill`
    })
  }

  componentWillMount() {
    if (getGlobalData('billData')) {
      this.setState({ ...getGlobalData('billData') })
      this.RecNum = getGlobalData('billRecNum')
    } else {
      this.queryDealRec()
      if (!Taro.getStorageSync('billModal')) {
        nocancel('账单数据获取自校园卡APP，仅供参考，若有延迟可下拉刷新')
        Taro.setStorageSync('billModal', true)
      }
    }
  }
  onPullDownRefresh() {
    // 下拉刷新
    this.RecNum = 1
    this.setState(
      {
        bill: {},
        monthBill: {}
      },
      () => this.queryDealRec()
    )
  }
  onShareAppMessage() {
    return {
      title: SLOGAN
    }
  }

  render() {
    const { bill, monthBill } = this.state

    return (
      <View className='container' style={{ color: secondary_color4 }}>
        {Object.keys(bill).map(elem => (
          <View key={elem}>
            <View
              className='at-row at-row__align--center screen bbox'
              style={{ background: bgColor7 }}
            >
              <View
                className='fz32 at-col'
                onClick={this.goMonthBill.bind(this, monthBill[elem], elem)}
              >
                <View>
                  {elem.slice(0, 4)}年{Number(elem.slice(5))}月
                </View>
                <View className='at-row at-row__justify--between'>
                  <View className='sml c9 fz26'>
                    支出<Text className='fb'>￥{monthBill[elem].expenses}</Text>
                  </View>
                  <View className='fz30 c9'>
                    <Text className='top'>统计</Text>
                    <AtIcon value='chevron-right' size='19' color='#999' />
                  </View>
                </View>
              </View>
            </View>
            {bill[elem].map((item, i) => (
              <View
                className='item fz30 bbox at-row at-row__justify--around at-row__align--center'
                key={item.time + i}
              >
                <View className='at-col at-col-1'>
                  <AtIcon
                    prefixClass='icon'
                    value={item.icon}
                    size='28'
                    color={item.deal.charAt(0) == '-' ? '#A80000' : '#00aaf9'}
                  />
                </View>
                <View className='fee at-col at-col-8'>
                  <Text>{item.source.replace('衡阳市雁峰区', '')}</Text>
                  <Text className='time' style={{ color: secondary_colorA }}>
                    {item.zhDate.slice(5)}
                    <Text style='margin-left: 15rpx'>
                      {item.time.slice(0, 5)}
                    </Text>
                  </Text>
                </View>
                <View
                  className='at-col at-col-2 deal tar fz34'
                  style={{
                    color: item.deal.charAt(0) == '-' ? '#A80000' : '#00aaf9'
                  }}
                >
                  {item.deal}
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    )
  }
}
