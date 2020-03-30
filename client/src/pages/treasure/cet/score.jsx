import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { slogan } from '@utils/slogan.js'
import './score.scss'

export default class Score extends Component {
  config = {
    navigationBarBackgroundColor: '#fcbad3',
    navigationBarTitleText: '查询结果',
    navigationBarTextStyle: 'white'
  }

  onShareAppMessage() {
    return {
      title: slogan
    }
  }

  render() {
    let { obj } = this.$router.params
    if (obj) {
      obj = JSON.parse(obj.replace(/\//g, ''))
    }
    return (
      <View className="container">
        <View>2019年12月</View>
        <View>考试成绩查询结果</View>
        <View className="card">
          <View className="at-row">
            <View className="at-col at-col__offset-1">
              <View className="key">考生姓名</View>
              <View>{obj.n}</View>
            </View>
            <View className="at-col at-col-7">
              <View className="key">准考证号</View>
              <View>{obj.z}</View>
            </View>
          </View>
          <View className="at-row">
            <View className="at-col at-col__offset-1">
              <View className="key">考试类别</View>
              <View>{obj.z[9] == 2 ? '英语六级' : '英语四级'}</View>
            </View>
            <View className="at-col at-col-7">
              <View className="key">学校</View>
              <View>{obj.x}</View>
            </View>
          </View>
          <View className="line"></View>
          <View className="at-col at-col__offset-1">
            <View className="key">笔试总分</View>
            <View className="big">{obj.s}</View>
          </View>
          <View className="at-row mtop">
            <View className="at-col at-col__offset-1">
              <View className="key">听力</View>
              <View>{obj.l}</View>
            </View>
            <View className="at-col">
              <View className="key">阅读</View>
              <View>{obj.r}</View>
            </View>
            <View className="at-col">
              <View className="key">写作翻译</View>
              <View>{obj.w}</View>
            </View>
          </View>
          <View className="line"></View>
          <View className="at-col at-col__offset-1">
            <View className="key">口语准考证</View>
            <View>{obj.kyz}</View>
          </View>
          <View className="at-col at-col__offset-1 mtop">
            <View className="key">口语等级</View>
            <View>{obj.kys}</View>
          </View>
        </View>
        <View className="mtop key">注意：名字含生僻字可能无法正常显示</View>
        <View className="key">查询成绩仅做参考</View>
      </View>
    )
  }
}
