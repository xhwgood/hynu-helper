import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtCard } from 'taro-ui'
import ajax from '@utils/ajax'
import { set as setGlobalData } from '@utils/global_data.js'
import slogan from '@utils/slogan.js'
import './electives.scss'

export default class Electives extends Component {
  config = {
    navigationBarBackgroundColor: '#f2a379',
    navigationBarTitleText: '选修课',
    navigationBarTextStyle: 'white'
  }

  state = {
    stageObj: {
      term: '选修课入口已经关闭'
    }
  }

  enter = () => {
    setGlobalData('query', this.state.stageObj.queryDetail)
    Taro.navigateTo({
      url: `./select`
    })
  }

  getElectives = () => {
    const sessionid = Taro.getStorageSync('sid')
    const data = {
      func: 'onlySid',
      data: {
        sessionid,
        spider: 'getElective'
      }
    }
    ajax('base', data).then(res => {
      this.setState({ stageObj: res.enter_info[0] })
    })
  }

  componentWillMount() {
    this.getElectives()
  }

  onShareAppMessage() {
    return {
      title: slogan,
      path: '/pages/index/index'
    }
  }

  render() {
    const { term, stage, start, end } = this.state.stageObj

    return (
      <View className='electives'>
        <AtCard title={'学年学期：' + term}>
          <View>选课阶段：{stage}</View>
          <View>开始时间：{start}</View>
          <View>结束时间：{end}</View>
          {end && <AtButton onClick={this.enter}>进入选课</AtButton>}
        </AtCard>
        {/* <View className='bg-container'>
          <Image className='bg' src='http://cdn.xianghw.xyz/LOGO.png' />
        </View> */}
      </View>
    )
  }
}
