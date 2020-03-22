import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Picker } from '@tarojs/components'
import ajax from '@utils/ajax'
import { AtIcon, AtList, AtListItem } from 'taro-ui'
import Echart from 'echarts12'
import './monthBill.scss'

export default class MonthBill extends Component {
  config = {
    navigationBarTitleText: '月账单'
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
                fontSize: 10
              }
            },
            type: 'pie',
            data
          }
        ]
      }
      this.setState({
        option,
        monthBill: res.monthBill
      })
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
    const date = new Date()
    const year = date.getFullYear()
    let month = String(date.getMonth() + 1)
    if (month.length == 1) {
      month = '0' + month
    }
    this.setState({
      today: `${year}-${month}`,
      dateSel: `${year}${month}`
    })
  }

  render() {
    const { dateSel, today, monthBill, option } = this.state
    return (
      <View className='at-col container'>
        <Picker
          mode='date'
          fields='month'
          className='top'
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
            *因手机尺寸限制，省略了部分文字及比重小的选项
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
