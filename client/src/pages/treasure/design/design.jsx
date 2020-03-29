import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtCard } from 'taro-ui'
import ajax from '@utils/ajax'
import slogan from '@utils/slogan.js'
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

  getDesign = () => {
    const sessionid = Taro.getStorageSync('sid')
    const data = {
      func: 'getDesign',
      data: {
        sessionid,
        pageNum: this.pageNum
      }
    }
    ajax('base', data).then(res => {
      const { design } = res
      this.setState({
        designRes: this.state.designRes.concat(design)
      })
      this.pageNum++
    })
  }

  componentWillMount() {
    this.getDesign()
  }

  onShareAppMessage() {
    return {
      title: slogan,
      path: '/pages/index/index'
    }
  }

  render() {
    return (
      <View className='design'>
        {this.state.designRes.length &&
          this.state.designRes.map(item => (
            <AtCard title={item.name} className='mt' key={item.name}>
              <View>指导教师：{item.teacher}</View>
              <View>限选人数：{item.limit}</View>
              <View>已选人数：{item.selected}</View>
            </AtCard>
          ))}
      </View>
    )
  }
}
