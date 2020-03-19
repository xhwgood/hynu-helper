import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import ajax from '@utils/ajax'
import { AtIcon } from 'taro-ui'
import './monthBill.scss'

export default class MonthBill extends Component {
  config = {
    navigationBarTitleText: '月账单'
  }

  state = {}

  queryMonthBill = () => {
    const { AccNum } = this.$router.params
    const data = {
      func: 'queryMonthBill',
      data: {
        AccNum,
        Month: '202003'
      }
    }
    ajax('card', data).then(res => {
      this.setState({ monthBill: res.monthBill })
    })
  }

  componentWillMount() {
    this.queryMonthBill()
  }
  render() {
    return (
      <View className='at-col'>
        <View>2019年12月</View>
        <View>月收入：</View>
        <View>月消费</View>
      </View>
    )
  }
}
