import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtPagination, AtTag } from 'taro-ui'
import { get as getGlobalData } from '@utils/global_data.js'
import ajax from '@utils/ajax'
import Item from '@components/treasure/library/item'
import './history.scss'

export default class History extends Component {
  config = {
    navigationBarBackgroundColor: '#a3c6c4',
    navigationBarTitleText: '历史借阅',
    navigationBarTextStyle: 'white'
  }

  state = {
    historyArr: [],
    current: 1,
    total: 0,
    // 过滤id，默认显示借书
    filterId: '借',
    // 过滤按钮
    btnArr: ['借', '还']
  }
  // 获取历史借阅记录
  getHistory = () => {
    const { current } = this.state
    const libSid = getGlobalData('libSid')
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
        Taro.pageScrollTo({
          scrollTop: 0
        })
      }
    })
  }
  // 改变页数
  onPageChange = e =>
    this.setState({ current: e.current }, () => this.getHistory())

  // 过滤历史借阅图书
  filter = i => {
    let filterId = i
    if (i == this.state.filterId) {
      filterId = null
    }
    this.setState({ filterId })
  }

  componentDidShow() {
    this.getHistory()
  }

  onShareAppMessage() {
    return {
      title: SLOGAN
    }
  }

  render() {
    const { historyArr, total, current, filterId, btnArr } = this.state
    let filterHistory
    if (filterId) {
      filterHistory = historyArr.filter(
        item => item.operate == (filterId == '借' ? '借书' : '还书')
      )
    } else {
      filterHistory = historyArr
    }
    return (
      <View>
        <View className='his-title'>
          历史借阅信息：
          {btnArr.map(item => (
            <AtTag
              type='primary'
              active={filterId == item}
              onClick={this.filter.bind(this, item)}
              className={item == '借' ? 'mr' : ''}
              circle={true}
              key={item}
            >
              {item}书
            </AtTag>
          ))}
        </View>
        {!historyArr.length && <View className='bind tac'>暂无历史借阅</View>}
        <Item list={filterHistory} />
        {/* 分页组件 */}
        {historyArr.length && (
          <AtPagination
            onPageChange={this.onPageChange}
            total={parseInt(total)}
            pageSize={15}
            current={current}
          />
        )}
      </View>
    )
  }
}
