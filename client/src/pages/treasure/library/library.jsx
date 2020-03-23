import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtCard, AtPagination } from 'taro-ui'
import ajax from '@utils/ajax'
import './library.scss'

export default class Library extends Component {
  state = {
    libSid: 'JSESSIONID=6D31B818BC4CBE817C9820E005AFFD09',
    obj: {
      arrears: '0.0',
      borrowed: '无',
      canBorrow: '0/6',
      charge: '0.0',
      validity: '2016.11.05-2020.09.05'
    },
    historyArr: [],
    current: 1,
    total: 0
  }

  getHistory = () => {
    const { libSid, current } = this.state
    const data = {
      func: 'getHistory',
      data: {
        page: current,
        Cookie: libSid
      }
    }
    ajax('library', data).then(res => {
      if (res.code == 200) {
        this.setState({
          historyArr: res.arr,
          total: res.total
        })
      }
    })
  }

  onPageChange = e => {
    this.setState({ current: e.current }, () => this.getHistory())
  }

  componentWillMount() {
    this.getHistory()
  }

  render() {
    const { obj, historyArr, total, current } = this.state

    return (
      <View className='library'>
        <AtCard title='我的借阅信息' isFull>
          <View>已借/可借：{obj.canBorrow}</View>
          <View>图书证有效期：{obj.validity}</View>
          <View className='at-row'>
            <Text className='at-col'>欠款：{obj.arrears}￥</Text>
            <Text className='at-col'>预付款：{obj.charge}￥</Text>
          </View>
          <View>当前借阅图书：{obj.borrowed}</View>
        </AtCard>
        <View className='his-title'>历史借阅信息：</View>
        {historyArr.map(item => (
          <View className='at-col his-book' key={item.time}>
            <View className='at-row'>
              <Text className='at-col'>操作：{item.operate}</Text>
              <Text className='at-col'>时间：{item.time}</Text>
            </View>
            <View>书名：《{item.book}》</View>
            <View>作者：{item.author}</View>
            <View>地点：{item.place}</View>
          </View>
        ))}
        {historyArr.length && (
          <AtPagination
            onPageChange={this.onPageChange}
            total={parseInt(total)}
            pageSize={10}
            current={current}
          />
        )}
      </View>
    )
  }
}
