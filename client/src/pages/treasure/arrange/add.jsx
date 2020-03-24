import Taro, { Component } from '@tarojs/taro'
// import { View, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import Exam from '@components/treasure/arrange'
import './arrange.scss'

export default class Add extends Component {
  config = {
    navigationBarBackgroundColor: '#769fcd',
    navigationBarTitleText: '选择',
    navigationBarTextStyle: 'white'
  }

  state = {
    current: 0,
    examClass: [],
    english: [
      '大学英语四级考试',
      '大学英语六级考试',
      '英语专业四级考试',
      '英语专业八级考试'
    ]
  }

  handleClick = v => {
    this.setState({
      current: v
    })
  }

  // set = item => {
  //   Taro.navigateTo({
  //     url: `./set?name=${item}`
  //   })
  // }

  componentWillMount() {
    const myClass = Taro.getStorageSync('myClass')
    const examClass = []
    myClass.forEach(e => {
      examClass.push(e.name)
    })
    this.setState({ examClass })
  }

  render() {
    const tabList = [{ title: '期末考试' }, { title: '英语等级考试' }]
    const { current, examClass, english } = this.state
    return (
      <AtTabs current={current} tabList={tabList} onClick={this.handleClick}>
        <AtTabsPane current={current} index={0}>
          <Exam list={examClass} />
        </AtTabsPane>
        <AtTabsPane current={current} index={1}>
          <Exam list={english} />
        </AtTabsPane>
      </AtTabs>
    )
  }
}
