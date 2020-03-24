import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Picker } from '@tarojs/components'
import ajax from '@utils/ajax'
import { AtIcon, AtList, AtListItem } from 'taro-ui'
import Echart from 'echarts12'
// import moment from 'moment'
import moment from '@utils/moment.min.js'
import './monthBill.scss'

export default class MonthBill extends Component {
  config = {
    navigationBarBackgroundColor: '#A80000',
    navigationBarTitleText: '月账单',
    navigationBarTextStyle: 'white'
  }

  state = {
    dateSel: '',
    today: '',
    option: {}
  }

  queryMonthBill = () => {
    let { dateSel } = this.state
    const { AccNum } = this.$router.params
    if (!dateSel) {
      const date = new Date()
      const year = date.getFullYear()
      let month = String(date.getMonth() + 1)
      if (month.length == 1) {
        month = '0' + month
      }
      dateSel = `${year}${month}`
    }
    const data = {
      func: 'queryMonthBill',
      data: {
        AccNum,
        Month: dateSel
      }
    }
    ajax('card', data).then(res => {
      const data = []
      res.monthBill.arr.forEach(item => {
        let { name, value } = item
        name = name.replace('东校区', '').replace('新食堂', '')
        data.push({
          name,
          value
        })
      })
      const option = {
        series: [
          {
            label: {
              normal: {
                fontSize: 12
              }
            },
            type: 'pie',
            data
          }
        ]
      }
      this.setState(
        {
          option: { ...option }
        },
        () => this.setState({ monthBill: res.monthBill })
      )
    })
  }

  onDateChange = e => {
    const dateSel = e.detail.value.replace('-', '')
    this.setState(
      {
        dateSel
      },
      () => this.queryMonthBill()
    )
  }

  componentWillMount() {
    this.queryMonthBill()
    const username = Taro.getStorageSync('username').slice(0, 2)
    const today = moment().format('YYYY-MM')
    const dateSel = moment().format('YYYYMM')
    const start = `20${username}-09`
    this.setState({
      today,
      dateSel,
      start
    })
  }

  render() {
    const { dateSel, today, monthBill, option, start } = this.state
    return (
      <View className='at-col container'>
        <Picker
          mode='date'
          fields='month'
          className='top'
          start={start}
          end={today}
          onChange={this.onDateChange}
        >
          {dateSel.slice(0, 4) + '年' + dateSel.slice(4) + '月'}
          <AtIcon value='chevron-down' size='25' color='#000' />
        </Picker>
        <View className='income'>
          <Text>月收入：</Text>
          <Text>{monthBill.income}￥</Text>
        </View>
        <View className='expense-title'>月消费：{monthBill.expenses}￥</View>
        <Echart option={option} />
        {monthBill.arr.length && (
          <View className='tip'>
            *因兼容性的需要，省略了部分文字及比重小的选项
          </View>
        )}
        <AtList>
          {monthBill &&
            monthBill.arr.map(item => (
              <AtListItem
                key={item.name}
                title={item.name}
                extraText={item.value + '￥'}
              />
            ))}
        </AtList>
      </View>
    )
  }
}
