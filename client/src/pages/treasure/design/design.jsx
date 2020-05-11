import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtCard } from 'taro-ui'
import ajax from '@utils/ajax'
import './design.scss'

export default class Design extends Component {
  config = {
    navigationBarBackgroundColor: '#a5e9db',
    navigationBarTitleText: '毕业设计',
    navigationBarTextStyle: 'white'
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
    const sessionid = Taro.getStorageSync('sid')
    const username = Taro.getStorageSync('username')
    const data = {
      func: 'getDesign',
      data: {
        sessionid,
        pageNum: this.pageNum,
        username
      }
    }
    ajax('base', data).then(res => {
      this.setState({
        designRes: this.state.designRes.concat(res.design)
      })
      this.pageNum++
    })
  }

  componentWillMount() {
    this.getDesign()
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
