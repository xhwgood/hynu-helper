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
    bill: []
  }
  // 账单的起始记录数
  RecNum = 1

  onReachBottom() {
    this.queryDealRec()
  }

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
      const { bill } = this.state
      const { obj } = res
      const first = Object.keys(obj)[0]

      if (Object.keys(bill).includes(first)) {
        bill[first] = bill[first].concat(obj[first])
        delete obj[first]
      }
      Object.keys(obj).map(value => {
        bill[value] = obj[value]
      })
      this.setState({ bill })
      this.RecNum += 15
    })
  }

  goMonthBill = month => {
    const { AccNum } = this.$router.params
    Taro.navigateTo({
      url: `./monthBill?AccNum=${AccNum}&month=${month}`
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
    const { bill } = this.state
    const keys = Object.keys(bill)

    return (
      <View className='container'>
        {keys.map(elem => (
          <View key={elem}>
            <View className='at-row at-row__align--center screen'>
              <View
                className='tac at-row at-row__justify--between'
                onClick={this.goMonthBill.bind(this, elem)}
              >
                {elem.slice(0, 4)}年{elem.slice(5).replace('0', '')}月
                <View className='right'>
                  <Text>统计</Text>
                  <AtIcon value='chevron-right' size='20' color='#999' />
                </View>
              </View>
            </View>
            {bill[elem].map(item => (
              <View
                className='item at-row at-row__justify--around at-row__align--center'
                key={String(item.time)}
              >
                <View className='at-col at-col-1'>
                  <AtIcon
                    prefixClass='icon'
                    value={item.icon}
                    size='23'
                    color={item.deal.charAt(0) == '-' ? '#A80000' : '#00aaf9'}
                  />
                </View>
                <View className='fee at-col at-col-8'>
                  <Text>{item.source}</Text>
                  <Text className='source'>{item.feeName}</Text>
                  <Text className='time'>
                    {item.date.slice(5)}
                    <Text style='margin-left: 15rpx'>
                      {item.time.slice(0, 5)}
                    </Text>
                  </Text>
                </View>
                <View
                  className='at-col at-col-2 tar'
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
