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
      this.setState({ bill: this.state.bill.concat(res.arr) })
      this.RecNum += 15
    })
  }

  goMonthBill = () => {
    const { AccNum } = this.$router.params
    Taro.navigateTo({
      url: `./monthBill?AccNum=${AccNum}`
    })
  }

  // showFilter = () => {
  //   this.setState({})
  // }

  componentWillMount() {
    this.queryDealRec()
  }

  render() {
    const { bill } = this.state
    return (
      <View className='container'>
        <View className='at-row at-row__align--center screen'>
          <View className='tac at-col' onClick={this.goMonthBill}>
            月账单
            <AtIcon value='chevron-right' size='25' color='#000' />
          </View>
          {/* <View className='tac at-col' onClick={this.showFilter}>
            <AtIcon
              prefixClass='icon'
              value='shaixuan'
              size='20'
              color='#000'
            />
            筛选（未完成）
          </View> */}
        </View>
        {bill &&
          bill.map(item => (
            <View
              className='item at-row at-row__justify--around at-row__align--center'
              key={String(item.time)}
            >
              <View className='daytime at-col at-col-3'>
                <Text>{item.date}</Text>
                <Text>{item.time}</Text>
              </View>
              <View className='at-col at-col-1'>
                <AtIcon
                  value={item.deal.charAt(0) == '-' ? 'subtract' : 'add'}
                  size='30'
                  color={item.deal.charAt(0) == '-' ? '#A80000' : '#00aaf9'}
                />
              </View>
              <View className='fee at-col at-col-6'>
                <Text>{item.feeName}</Text>
                <Text className='source'>{item.source}</Text>
              </View>
              <View className='at-col at-col-2 tar'>{item.deal}￥</View>
            </View>
          ))}
      </View>
    )
  }
}
