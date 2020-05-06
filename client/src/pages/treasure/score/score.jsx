import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import ajax from '@utils/ajax'
import {
  set as setGlobalData,
  get as getGlobalData
} from '@utils/global_data.js'
import { AtTabs, AtTabsPane } from 'taro-ui'
import List from '@components/treasure/score/list'
import './score.scss'

export default class Score extends Component {
  config = {
    navigationBarBackgroundColor: '#4e4e6a',
    navigationBarTitleText: '查成绩',
    navigationBarTextStyle: 'white'
  }

  state = {
    all_score: {
      2019: {}
    },
    tabList: [
      { title: '大一' },
      { title: '大二' },
      { title: '大三' },
      { title: '大四' }
    ],
    current: 0,
    term: '2019'
  }
  // 获取所有成绩
  getScore = () => {
    const sessionid = Taro.getStorageSync('sid')
    const username = Taro.getStorageSync('username')
    const data = {
      func: 'getScore',
      data: {
        sessionid,
        username
      }
    }
    ajax('base', data).then(res => {
      const { score_arr } = res.score
      const all_score = {}
      score_arr.forEach(element => {
        const { term } = element
        if (!all_score[`${term.slice(0, 4)}`]) {
          all_score[`${term.slice(0, 4)}`] = {}
        }
        if (!all_score[`${term.slice(0, 4)}`][`${term.charAt(10)}`]) {
          all_score[`${term.slice(0, 4)}`][`${term.charAt(10)}`] = []
        }
        all_score[`${term.slice(0, 4)}`][`${term.charAt(10)}`].push(element)
      })
      const len = Object.keys(all_score).length
      // 优先显示最近一个学期的成绩
      const term = Object.keys(all_score)[len - 1]
      this.setState({
        all_score,
        tabList: this.state.tabList.slice(0, len),
        term,
        current: len - 1
      })
      setGlobalData('all_score', all_score)
      // 将已修学分保存至全局状态
      setGlobalData('all_credit', all_credit)
    })
  }
  // 显示单科成绩详情
  showBottom = (item, i, element) => {
    const { all_score, term } = this.state
    let needChange = all_score[term][element][i]
    needChange.bottomShow = !item.bottomShow
    this.setState({ all_score })
    // 只有当此成绩的更多信息未显示，且未获取过详情时才发起请求
    if (!item.bottom && !item.getted) {
      const sessionid = Taro.getStorageSync('sid')
      const username = Taro.getStorageSync('username')
      const queryDetail = item.queryDetail + escape(item.score)
      const data = {
        func: 'easyQuery',
        data: {
          sessionid,
          queryDetail,
          spider: 'singleScore',
          username
        }
      }
      ajax('base', data).then(res => {
        const { single_obj, code } = res
        if (code == 200) {
          all_score[term][element][i] = { ...needChange, ...single_obj }
          this.setState({ all_score })
        }
      })
    }
  }
  // tab 切换时改变显示的学期
  changeTabs = e => {
    const { all_score } = this.state
    const term = Object.keys(all_score)[e]
    this.setState({
      current: e,
      term
    })
    Taro.pageScrollTo({
      scrollTop: '40'
    })
  }
  // 左右滑动切换 tab
  // 1.滑动（触摸）开始
  touchStart = e => {
    this.start = e.changedTouches[0].pageX
  }
  // 2.滑动（触摸）结束
  touchEnd = e => {
    const end = e.changedTouches[0].pageX
    const { current, tabList } = this.state
    // 向左滑
    if (end - this.start > 100 && current != 0) {
      this.changeTabs(current - 1)
    } else if (end - this.start < -100 && current != tabList.length - 1) {
      // 向右滑
      this.changeTabs(current + 1)
    }
  }

  componentWillMount() {
    const all_score = getGlobalData('all_score')
    if (all_score) {
      const len = Object.keys(all_score).length
      const term = Object.keys(all_score)[len - 1]
      this.setState({
        all_score,
        term,
        tabList: this.state.tabList.slice(0, len)
      })
    } else {
      this.getScore()
    }
  }
  onShareAppMessage() {
    return {
      title: SLOGAN,
      path: PATH
    }
  }

  render() {
    const { all_score, tabList, current, term } = this.state

    return (
      <View className='score'>
        <AtTabs current={current} tabList={tabList} onClick={this.changeTabs}>
          <AtTabsPane current={current} index={0}></AtTabsPane>
        </AtTabs>
        <View className='getted'>目前已修学分：{getGlobalData('all_credit')}学分</View>

        <View
          className='container tac'
          onTouchStart={this.touchStart}
          onTouchEnd={this.touchEnd}
        >
          {Object.keys(all_score[`${term}`]).map(element => (
            <View key={element}>
              <View className='title'>
                {element == 1 ? '上学期' : '下学期'}
              </View>
              {all_score[`${term}`][element].map((item, i) => (
                <List
                  key={item.queryDetail}
                  item={item}
                  i={i}
                  element={element}
                  showBottom={this.showBottom}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    )
  }
}
