import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtCard } from 'taro-ui'
import ajax from '@utils/ajax'
import { set as setGlobalData } from '@utils/global_data.js'
import Item from '@components/treasure/electives'
import './electives.scss'

export default class Electives extends Component {
  config = {
    navigationBarBackgroundColor: '#f2a379',
    navigationBarTitleText: '选修课',
    navigationBarTextStyle: 'white'
  }

  state = {
    stageObj: {},
    // 已选选修课
    selectedArr: []
  }
  // 进入选课
  enter = () =>
    Taro.navigateTo({
      url: `./select`
    })

  // 获取选修课阶段入口及信息
  getElectives = () => {
    const sessionid = Taro.getStorageSync('sid')
    const username = Taro.getStorageSync('username')
    const data = {
      func: 'onlySid',
      data: {
        sessionid,
        spider: 'getElective',
        username
      }
    }
    ajax('base', data).then(res => {
      const { enter_info } = res
      if (enter_info[0]) {
        setGlobalData('query', enter_info[0].queryDetail)
        this.setState({ stageObj: enter_info[0] })
      } else {
        this.query()
      }
    })
  }
  // 得到 ajax 的 data
  getData = () => {
    const sessionid = Taro.getStorageSync('sid')
    const username = Taro.getStorageSync('username')
    const myterm = Taro.getStorageSync('myterm')
    const keys = Object.keys(myterm)
    return {
      func: 'allSelected',
      data: {
        sessionid,
        username,
        term: keys[keys.length - 1]
      }
    }
  }

  // 查询已选选修课
  query = () => {
    const selectedData = this.getData()
    ajax('base', selectedData).then(res => {
      const { selected: selectedArr } = res
      this.setState({ selectedArr })
    })
  }

  componentWillMount() {
    this.getElectives()
  }
  onShareAppMessage() {
    return {
      title: SLOGAN,
      path: PATH
    }
  }

  render() {
    const { term, stage, start, end } = this.state.stageObj
    const { selectedArr } = this.state

    return (
      <View className='electives'>
        {term ? (
          <AtCard title={'学年学期：' + term}>
            <View>选课阶段：{stage}</View>
            <View>开始时间：{start}</View>
            <View>结束时间：{end}</View>
            <AtButton onClick={this.enter}>进入选课</AtButton>
          </AtCard>
        ) : (
          <View>
            <View style={{ padding: '30rpx' }}>
              选修课入口已关闭，查询到本学期你的选修课情况：
            </View>
            {selectedArr.length ? (
              <Item
                list={selectedArr}
                showBottom={this.showBottom}
                selectList={this.selectList}
              />
            ) : (
              <View style={{ padding: '30rpx' }}>本学期你没有选修课</View>
            )}
          </View>
        )}
      </View>
    )
  }
}
