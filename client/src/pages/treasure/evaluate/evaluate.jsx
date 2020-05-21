import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import ajax from '@utils/ajax'
import { get as getGlobalData } from '@utils/global_data.js'
import './evaluate.scss'

export default class Evaluate extends Component {
  config = {
    navigationBarBackgroundColor: '#b793e6',
    navigationBarTitleText: '教学评价',
    navigationBarTextStyle: 'white'
  }

  state = {
    arr_xnxq: [],
    arr_pcname: [],
    arr_pjClass: [],
    selector: ['教学评价入口已关闭'],
    selectorChecked: '请选择',
    xnxq: '请选择',
    pcname: '请选择',
    courseCategory: '请选择'
  }
  // 分类名称
  onChange = e =>
    this.setState({
      selectorChecked: this.state.selector[e.detail.value]
    })
  // 学年学期
  changeXnxq = e =>
    this.setState({
      xnxq: this.state.arr_xnxq[e.detail.value]
    })
  // 批次名称
  changePcname = e =>
    this.setState({
      pcname: this.state.arr_pcname[e.detail.value].name
    })
  // 课程类别
  changeCourse = e =>
    this.setState({
      courseCategory: this.state.arr_pjClass[e.detail.value].name
    })
  // 获取教学评价入口信息
  getJxpj = () => {
    const sessionid = getGlobalData('sid')
    const data = {
      func: 'onlySid',
      data: {
        sessionid,
        spider: 'getJxpj'
      }
    }
    ajax('base', data).then(res => {
      const { arr_pcname, arr_xnxq, courseCategory } = res
      this.setState({ arr_pcname, arr_xnxq, arr_pjClass: courseCategory })
    })
  }

  componentWillMount() {
    this.getJxpj()
  }

  onShareAppMessage() {
    return {
      title: SLOGAN,
      path: PATH
    }
  }

  render() {
    const {
      selector,
      selectorChecked,
      xnxq,
      arr_xnxq,
      arr_pcname,
      pcname,
      arr_pjClass,
      courseCategory
    } = this.state

    return (
      <View className='body'>
        <View className='page-section'>
          <Picker
            mode='selector'
            range={arr_xnxq}
            onChange={this.changeXnxq}
            className='picker'
          >
            <Text>学年学期：</Text>
            <Text style={{ color: '#777' }}>{xnxq}</Text>
          </Picker>
        </View>
        <View className='page-section'>
          <Picker
            mode='selector'
            range={arr_pcname}
            rangeKey='name'
            onChange={this.changePcname}
          >
            <View className='picker'>
              评价批次名称：<Text style={{ color: '#777' }}>{pcname}</Text>
            </View>
          </Picker>
        </View>
        <View className='page-section'>
          <Picker mode='selector' range={selector} onChange={this.onChange}>
            <View className='picker'>
              评价分类名称：
              <Text style={{ color: '#777' }}>{selectorChecked}</Text>
            </View>
          </Picker>
        </View>
        <View className='page-section'>
          <Picker
            mode='selector'
            range={arr_pjClass}
            rangeKey='name'
            onChange={this.changeCourse}
          >
            <View className='picker'>
              评价课程类别：
              <Text style={{ color: '#777' }}>{courseCategory}</Text>
            </View>
          </Picker>
        </View>
        <AtButton size='normal' type='primary'>
          查询
        </AtButton>
      </View>
    )
  }
}
