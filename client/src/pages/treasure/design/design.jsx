import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtCard } from 'taro-ui'
import ajax from '@utils/ajax'
import {
  get as getGlobalData,
  set as setGlobalData
} from '@utils/global_data.js'
import NoData from '@components/no-data'
import './design.scss'
import { showError } from '../../../utils/taroutils'

export default class Design extends Component {
  config = {
    navigationBarTitleText: '毕业设计',
    enablePullDownRefresh: true
  }

  state = {
    designRes: [],
    /** 是否还有下一页 */
    hasMore: false
  }
  pageNum = 1

  /**
   * 获取毕设课题列表
   * @param {boolean} isClear
   */
  getDesign = (isClear = false) => {
    const sessionid = getGlobalData('sid')
    const data = {
      func: 'getDesign',
      data: {
        sessionid,
        pageNum: this.pageNum
      }
    }
    ajax('base', data).then(({ design }) => {
      if (design.length && design.length % 10 == 0) {
        this.setState({ hasMore: true })
      }
      const designRes = isClear ? design : this.state.designRes.concat(design)
      this.setState({
        designRes
      })
      // 获取数据后停止当前页面下拉刷新
      Taro.stopPullDownRefresh()
      setGlobalData('designRes', designRes)
      this.pageNum++
    })
  }

  onPullDownRefresh() {
    if (this.state.designRes.length) {
      // 下拉刷新
      this.pageNum = 1
      this.getDesign(true)
    } else {
      showError('抱歉，没有查询到数据')
      Taro.stopPullDownRefresh()
    }
  }
  onReachBottom() {
    if (this.state.hasMore) {
      this.getDesign()
    }
  }
  componentWillMount() {
    if (getGlobalData('designRes')) {
      this.setState(
        {
          designRes: getGlobalData('designRes')
        },
        () =>
          Taro.pageScrollTo({
            scrollTop: getGlobalData('designScrollTop')
          })
      )
    } else {
      this.getDesign()
    }
  }

  onPageScroll(e) {
    // 保存当前的滚动位置
    setGlobalData('designScrollTop', e.scrollTop)
  }
  onShareAppMessage() {
    return {
      title: '《我的衡师》居然能查毕业设计，太棒了吧！',
      path: PATH
    }
  }

  render() {
    const { designRes } = this.state

    return (
      <View>
        {designRes.length ? (
          designRes.map(item => (
            <AtCard title={item.name} className='mt' key={item.name}>
              <View>指导教师：{item.teacher}</View>
              <View className='at-row'>
                <View className='at-col'>限选人数：{item.limit}</View>
                <View className='at-col'>已选人数：{item.selected}</View>
              </View>
            </AtCard>
          ))
        ) : (
          <NoData />
        )}
      </View>
    )
  }
}
