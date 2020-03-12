import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
// import { designRes } from '@utils/data'
import { AtCard } from 'taro-ui'
import './design.scss'

export default class Design extends Component {
  state = {
    designRes: []
  }
  pageNum = 1

  onReachBottom() {
    this.getDesign()
  }

  getDesign = () => {
    Taro.showLoading()
    const sessionid = Taro.getStorageSync('sid')
    Taro.cloud
      .callFunction({
        name: 'base',
        data: {
          func: 'getDesign',
          data: {
            sessionid,
            pageNum: this.pageNum
          }
        }
      })
      .then(res => {
        console.log(res)

        Taro.hideLoading()
        const msg = res.result.data.msg || '网络出现异常或教务处无法访问'
        this.setState({
          designRes: this.state.designRes.concat(res.result.data.design)
        })
        this.pageNum++
        Taro.showToast({
          title: msg,
          icon: 'none'
        })
      })
      .catch(err => {
        Taro.showToast({
          title: '获取课程出现未知错误！',
          icon: 'none'
        })
      })
  }

  componentWillMount() {
    this.getDesign()
  }

  render() {
    return (
      <View className="design">
        {this.state.designRes.length &&
          this.state.designRes.map(item => (
            <AtCard title={item.name} className="mt" key={item.name}>
              <View>指导教师：{item.teacher}</View>
              <View>限选人数：{item.limit}</View>
              <View>已选人数：{item.selected}</View>
            </AtCard>
          ))}
      </View>
    )
  }
}
