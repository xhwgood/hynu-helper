import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import ajax from '@utils/ajax'
import { AtIcon, AtList, AtListItem } from 'taro-ui'
import Echart from 'echarts12'
import moment from '@utils/moment.min.js'
import './monthBill.scss'

export default class MonthBill extends Component {
  config = {
    navigationBarBackgroundColor: '#A80000',
    navigationBarTitleText: '月账单',
    navigationBarTextStyle: 'white'
  }

  state = {
    // 选择的月份
    dateSel: '',
    today: '',
    // echarts
    option: {}
  }
  // 查询月账单
  queryMonthBill = () => {
    let { dateSel } = this.state
    const { AccNum } = this.$router.preload
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
    ajax('card', data).then(res => this.changeData(res.monthBill))
  }
  // 渲染图表和数据
  changeData = monthBill => {
    // echarts 的数据
    const data = []
    monthBill.arr.forEach(item => {
      let { name, value } = item
      const reg = /东校区|新食堂|西校区/
      name = name.replace(reg, '')
      data.push({
        name,
        value
      })
    })
    monthBill.arr.sort((a, b) => b.value - a.value)
    const option = {
      series: [
        {
          label: {
            normal: {
              fontSize: 13
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
      () => this.setState({ monthBill })
    )
  }
  // 改变月份
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
    const { month, monthInfo } = this.$router.preload
    const user = Taro.getStorageSync('username').slice(0, 2)
    const today = moment().format('YYYY-MM')
    const dateSel = month.replace('-', '')
    const start = `20${user}-09`
    this.changeData(monthInfo)
    this.setState({
      today,
      dateSel,
      start
    })
  }
  onShareAppMessage() {
    return {
      title: SLOGAN
    }
  }

  render() {
    const { dateSel, today, monthBill, option, start } = this.state
    return (
      <View className='at-col'>
        <Picker
          mode='date'
          fields='month'
          className='top tac'
          start={start}
          end={today}
          onChange={this.onDateChange}
        >
          {dateSel.slice(0, 4) + '年' + dateSel.slice(4) + '月'}
          <AtIcon value='chevron-down' size='25' color='#000' />
        </Picker>
        <View className='title'>月消费：{monthBill.expenses}￥</View>
        <Echart option={option} />
        {monthBill.arr.length && (
          <View className='tip'>*因手机尺寸限制，上图省略了部分文字</View>
        )}
        <AtList>
          {monthBill &&
            monthBill.arr.map(item => (
              <AtListItem
                key={item.name}
                title={item.name}
                extraText={'￥' + item.value}
              />
            ))}
        </AtList>
      </View>
    )
  }
}
