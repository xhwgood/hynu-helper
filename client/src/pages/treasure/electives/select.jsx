import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ajax from '@utils/ajax'
import Item from '@components/treasure/electives'
import { get as getGlobalData } from '@utils/global_data.js'
import slogan from '@utils/slogan.js'
import './select.scss'

export default class Select extends Component {
  config = {
    navigationBarBackgroundColor: '#f2a379',
    navigationBarTitleText: '选修课程列表',
    navigationBarTextStyle: 'white'
  }

  state = {
    xxk_arr: [],
    selectedArr: []
  }

  selectList = notoast => {
    const sessionid = Taro.getStorageSync('sid')
    let queryDetail = getGlobalData('query')
    queryDetail = queryDetail
      .replace('toXk', 'toFindxskxkclb')
      .replace('xnxq', 'xnxq01id')
    const data = {
      func: 'easyQuery',
      data: {
        sessionid,
        queryDetail,
        spider: 'selectElective'
      }
    }
    ajax('base', data, notoast).then(res => {
      const data = {
        func: 'allSelected',
        data: {
          sessionid
        }
      }
      const { xxk_arr } = res
      ajax('base', data, notoast).then(res_selected => {
        const { selected: selectedArr } = res_selected
        this.setState({ xxk_arr, selectedArr })
      })
    })
  }

  showBottom = (item, i) => {
    const { xxk_arr } = this.state
    xxk_arr[i].bottomShow = !item.bottomShow
    this.setState({ xxk_arr })
  }

  componentWillMount() {
    this.selectList()
  }

  onShareAppMessage() {
    return {
      title: slogan,
      path: '/pages/index/index'
    }
  }

  render() {
    const { xxk_arr, selectedArr } = this.state

    return (
      <View>
        {selectedArr.length && <View className='list'>已选中的选修课</View>}
        <Item
          list={selectedArr}
          showBottom={this.showBottom}
          selectList={this.selectList}
        />
        <View className='list'>
          选修课列表<Text className='tip'>若有已选课程，则不会出现在下方</Text>
          <View className='tip'>此列表按已选中人数从多到少排列</View>
        </View>
        <Item
          list={xxk_arr}
          showBottom={this.showBottom}
          selectList={this.selectList}
        />
      </View>
    )
  }
}
