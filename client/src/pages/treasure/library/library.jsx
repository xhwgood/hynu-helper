import Taro, { Component, setStorageSync, getStorageSync } from '@tarojs/taro'
import { View, Text, Navigator } from '@tarojs/components'
import { AtCard, AtPagination, AtIcon } from 'taro-ui'
import ajax from '@utils/ajax'
import './library.scss'

export default class Library extends Component {
  config = {
    navigationBarBackgroundColor: '#a3c6c4',
    navigationBarTitleText: '图书馆',
    navigationBarTextStyle: 'white'
  }

  state = {
    obj: {},
    historyArr: [],
    current: 1,
    total: 0
  }
  // 获取历史借阅记录
  getHistory = () => {
    const { current } = this.state
    const libSid = getStorageSync('libSid')
    const data = {
      func: 'getHistory',
      data: {
        page: current,
        Cookie: libSid
      }
    }
    ajax('library', data)
      .then(res => {
        // 登录成功
        if (res.code == 200) {
          this.setState({
            historyArr: res.arr,
            total: res.total
          })
          Taro.pageScrollTo({
            selector: '.library'
          })
        }
      })
      .catch(() => {
        // 图书馆登录状态过期
        const rdid = getStorageSync('username')
        const password = getStorageSync('libPass')
        const data = {
          func: 'reLogin',
          data: {
            rdid,
            password
          }
        }
        ajax('library', data).then(res => {
          if (res.code == 200) {
            setStorageSync('libSid', res.libSid)
            setStorageSync('obj', res.obj)
            this.setState({
              historyArr: res.arr,
              total: res.total
            })
          }
        })
      })
  }
  // 改变页数
  onPageChange = e =>
    this.setState({ current: e.current }, () => this.getHistory())

  componentDidShow() {
    const obj = getStorageSync('obj')
    this.setState({ obj })
    obj && this.getHistory()
  }

  onShareAppMessage() {
    return {
      title: SLOGAN
    }
  }

  render() {
    const { obj, historyArr, total, current } = this.state

    return (
      <View>
        <View className='card-container'>
          <AtCard title='我的借阅信息' isFull>
            <View>已借/可借：{obj.canBorrow}</View>
            <View>图书证有效期：{obj.validity}</View>
            <View className='at-row'>
              <Text className='at-col'>欠款：{obj.arrears}￥</Text>
              <Text className='at-col'>预付款：{obj.charge}￥</Text>
            </View>
            <View>当前借阅图书：{obj.borrowed}</View>
          </AtCard>
        </View>
        <View className='library'>
          <View className='his-title'>历史借阅信息：</View>
          {obj.validity ? (
            !historyArr.length && <View className='bind tac'>暂无历史借阅</View>
          ) : (
            <Navigator className='bind' url='./login'>
              点我绑定图书馆账号
              <AtIcon value='chevron-right' size='25' color='#808080' />
            </Navigator>
          )}
          {historyArr.map((item, idx) => (
            <View className='at-col his-book' key={item.time + idx}>
              <View className='at-row'>
                <Text className='at-col'>操作：{item.operate}</Text>
                <Text className='at-col'>时间：{item.time}</Text>
              </View>
              <View>书名：《{item.book}》</View>
              <View>作者：{item.author}</View>
              <View>地点：{item.place}</View>
            </View>
          ))}
          {/* 页数组件 */}
          {historyArr.length && (
            <AtPagination
              onPageChange={this.onPageChange}
              total={parseInt(total)}
              pageSize={10}
              current={current}
            />
          )}
        </View>
      </View>
    )
  }
}
