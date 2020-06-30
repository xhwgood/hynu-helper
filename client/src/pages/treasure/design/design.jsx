import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtCard } from 'taro-ui'
import ajax from '@utils/ajax'
import {
  get as getGlobalData,
  set as setGlobalData
} from '@utils/global_data.js'
import './design.scss'

export default class Design extends Component {
  config = {
    navigationBarTitleText: '毕业设计'
  }

  state = {
    designRes: []
  }
  pageNum = 1

  onReachBottom() {
    this.getDesign()
  }
  // 获取毕设课题列表
  getDesign = () => {
    const sessionid = getGlobalData('sid')
    const data = {
      func: 'getDesign',
      data: {
        sessionid,
        pageNum: this.pageNum
      }
    }
    ajax('base', data).then(res => {
      const designRes = this.state.designRes.concat(res.design)
      this.setState({
        designRes
      })
      setGlobalData('designRes', designRes)
      this.pageNum++
    })
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
      title: SLOGAN,
      path: PATH
    }
  }

  render() {
    return (
      <View>
        {this.state.designRes.length &&
          this.state.designRes.map(item => (
            <AtCard title={item.name} className='mt' key={item.name}>
              <View>指导教师：{item.teacher}</View>
              <View className='at-row'>
                <View className='at-col'>限选人数：{item.limit}</View>
                <View className='at-col'>已选人数：{item.selected}</View>
              </View>
            </AtCard>
          ))}
      </View>
    )
  }
}
