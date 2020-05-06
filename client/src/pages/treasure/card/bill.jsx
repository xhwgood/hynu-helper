import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ajax from '@utils/ajax'
import { AtIcon } from 'taro-ui'
import './bill.scss'

export default class Bill extends Component {
  config = {
    navigationBarBackgroundColor: '#A80000',
    navigationBarTitleText: '校园卡账单',
    navigationBarTextStyle: 'white'
  }

  state = {
    // 账单详细数据
    bill: [],
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
    ajax('card', data).then(res => {
      const { bill, monthBill } = this.state
      const { obj, monthObj } = res
      // 若新获取的数据中有前一个月份的，则合并到前一个月份
      const first = Object.keys(obj)[0]
      if (Object.keys(bill).includes(first)) {
        bill[first] = bill[first].concat(obj[first])
        delete obj[first]
      }
      Object.keys(obj).map(value => {
        bill[value] = obj[value]
        monthBill[value] = monthObj[value]
      })
      this.setState({ bill, monthBill })
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

  // showFilter = () => {
  //   this.setState({})
  // }

  componentWillMount() {
    this.queryDealRec()
  }
  onShareAppMessage() {
    return {
      title: SLOGAN
    }
  }

  render() {
    const { bill, monthBill } = this.state

    return (
      <View className='container'>
        {Object.keys(bill).map(elem => (
          <View key={elem}>
            <View className='at-row at-row__align--center screen bbox'>
              <View
                className='big at-col'
                onClick={this.goMonthBill.bind(this, monthBill[elem], elem)}
              >
                <View>
                  {elem.slice(0, 4)}年{elem.slice(5).replace('0', '')}月
                </View>
                <View className='at-row at-row__justify--between'>
                  <View className='sml'>
                    支出<Text className='fb'>￥{monthBill[elem].expenses}</Text>
                    <Text className='ml'>
                      收入<Text className='fb'>￥{monthBill[elem].income}</Text>
                    </Text>
                  </View>
                  <View className='right'>
                    <Text className='top'>分析</Text>
                    <AtIcon value='chevron-right' size='20' color='#999' />
                  </View>
                </View>
              </View>
            </View>
            {bill[elem].map(item => (
              <View
                className='item bbox at-row at-row__justify--around at-row__align--center'
                key={String(item.time)}
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
                  <Text>{item.source}</Text>
                  <Text className='time'>
                    {item.zhDate}
                    <Text style='margin-left: 15rpx'>
                      {item.time.slice(0, 5)}
                    </Text>
                  </Text>
                </View>
                <View
                  className='at-col at-col-2 big tar'
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
