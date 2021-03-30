import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtCard } from 'taro-ui'
import ajax from '@utils/ajax'
import { set as setGlobalData, get as getGlobalData } from '@utils/global_data'
import Item from '@components/treasure/electives'
import './electives.scss'

export default class Electives extends Component {
  config = {
    navigationBarTitleText: '选修课'
  }

  state = {
    stageObj: {},
    /** 已选选修课 */
    selectedArr: []
  }
  sessionid = getGlobalData('sid')
  /** 进入选课 */
  enter = () =>
    Taro.navigateTo({
      url: `./select`
    })

  /** 获取选修课阶段入口及信息 */
  getElectives = () => {
    const data = {
      func: 'onlySid',
      data: {
        sessionid: this.sessionid,
        spider: 'getElective'
      }
    }
    ajax('base', data).then(({ enter_info }) => {
      if (enter_info[0]) {
        setGlobalData('query', enter_info[0].queryDetail)
        this.setState({ stageObj: enter_info[0] })
      } else {
        // 如果选修课入口关闭，就查询用户选的选修课
        this.query()
      }
    })
  }
  /** 得到发起云函数请求的数据 `data` */
  getData = () => {
    const myterm = Taro.getStorageSync('myterm')
    const keys = Object.keys(myterm)
    return {
      func: 'allSelected',
      data: {
        sessionid: this.sessionid,
        term: keys[keys.length - 1]
      }
    }
  }
  /** 查询已选选修课 */
  query = () => {
    const selectedData = this.getData()
    ajax('base', selectedData).then(({ selected: selectedArr }) => {
      this.setState({ selectedArr })
    })
  }
  /**
   * 显示选修课详情
   * @param {object} item 要显示的选修课数据
   * @param {number} i 该选修课在数组中的索引
   */
  showBottom = (item, i) => {
    const { selectedArr } = this.state
    selectedArr[i].bottomShow = !item.bottomShow
    this.setState({ selectedArr })
  }

  componentWillMount() {
    this.getElectives()
    // 在确认选修课入口已关闭的情况下，直接获取已选选修课
    // this.query()
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
            {selectedArr && selectedArr.length ? (
              <Item list={selectedArr} showBottom={this.showBottom} />
            ) : (
              <View style={{ padding: '30rpx' }}>本学期你没有选修课</View>
            )}
          </View>
        )}
      </View>
    )
  }
}
