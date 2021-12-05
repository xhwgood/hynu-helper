// @ts-check
import Taro, { Component } from '@tarojs/taro'
import { View, Navigator } from '@tarojs/components'
import ajax from '@utils/ajax'
import {
  set as setGlobalData,
  get as getGlobalData
} from '@utils/global_data'
import { AtTabs, AtTabsPane, AtIcon } from 'taro-ui'
import Item from '@components/treasure/score/item'
import {
  bgColorFE,
  primary_color,
  secondary_color6,
  secondary_colorE
} from '@styles/color'
import NoData from '@components/no-data'
import { showError } from '@utils/taroutils'
import './score.scss'

export default class Score extends Component {
  config = {
    navigationBarTitleText: '查成绩'
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
    term: '2019',
    noData: true,
    /** 防止多次请求云函数 */
    disabled: false,
    /** 再次查询按钮仅允许点击一次 */
    isAgain: false
  }
  cookie = getGlobalData('cookie') || Taro.getStorageSync('cookie')
  /** 获取所有成绩 */
  getScore = () => {
    const data = {
      func: 'getScore',
      data: {
        cookie: this.cookie,
      }
    }
    ajax('base', data)
      .then((/** @type {{ scores: { term: string }[]; }} */ { scores }) => {
        const all_score = {}
        /** 云函数返回的是所有成绩的数组，在小程序端归类 */
        scores.forEach((element) => {
          const { term } = element
          const term4 = term.slice(0, 4)
          if (!all_score[`${term4}`]) {
            all_score[`${term4}`] = {}
          }
          if (!all_score[`${term4}`][`${term.charAt(10)}`]) {
            all_score[`${term4}`][`${term.charAt(10)}`] = []
          }
          all_score[`${term4}`][`${term.charAt(10)}`].push(element)
        })

        const len = Object.keys(all_score).length
        // 优先显示最近一个学期的成绩
        const term = Object.keys(all_score)[len - 1]
        this.setState({
          noData: false,
          all_score,
          tabList: this.state.tabList.slice(0, len),
          term,
          current: len - 1
        })
        // 保存至全局状态
        setGlobalData('all_score', all_score)
      })
      .catch(() => {
        setGlobalData('score_is_empty', true)
      })
  }

  /**
   * 显示单科成绩详情
   * @param {object} item
   * @param {number} i
   * @param {object} element
   */
  showBottom = (item, i, element) => {
    const { all_score, term } = this.state
    item.bottomShow = !item.bottomShow
    all_score[term][element][i] = { ...item }
    this.setState({ all_score })
  }
  /**
   * tab 切换时改变显示的学期
   * @param {number} e 当前 `tab` 索引
   */
  changeTabs = (e) => {
    const { all_score } = this.state
    const term = Object.keys(all_score)[e]
    this.setState({
      current: e,
      term
    })
    Taro.pageScrollTo({
      scrollTop: 40
    })
  }
  /**
   * 左右滑动切换 tab：1.滑动（触摸）开始
   * TODO:
   * @param {import('@tarojs/components/types/common').ITouchEvent} e
   */
  touchStart = (e) => {
    // TODO: 验证是否使用了错误的字段
    this.start = e.changedTouches[0].pageX
  }
  /**
   * 2.滑动（触摸）结束
   * @param {import('@tarojs/components/types/common').ITouchEvent} e
   */
  touchEnd = (e) => {
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
  /** 再次查询 */
  handleClickAgain = () => {
    this.setState({
      isAgain: true
    })
    this.getScore()
  }

  componentWillMount() {
    const all_score = getGlobalData('all_score')
    /** 之前获取的成绩是否为空 */
    if (!getGlobalData('score_is_empty')) {
      if (all_score) {
        const len = Object.keys(all_score).length
        const term = Object.keys(all_score)[len - 1]
        const creditArr = getGlobalData('creditArr')
        this.setState({
          all_score,
          term,
          tabList: this.state.tabList.slice(0, len),
          current: len - 1,
          creditArr,
          noData: false
        })
      } else {
        this.getScore()
      }
    }
  }

  onShareAppMessage() {
    return {
      title: '《我的衡师》居然能查成绩，太棒了吧！',
      path: PATH
    }
  }

  render() {
    const {
      all_score,
      tabList,
      current,
      term,
      noData,
      isAgain
    } = this.state

    return (
      <View
        className={noData ? '' : 'score'}
        style={{ color: secondary_color6 }}
        onTouchStart={this.touchStart}
        onTouchEnd={this.touchEnd}
      >
        {noData ? (
          <NoData>
            {!isAgain && (
              <View className='again-query mt20 fz36'>
                你是否想要
                <View
                  className='btn blue uline'
                  onClick={this.handleClickAgain}
                >
                  再次查询
                </View>
              </View>
            )}
          </NoData>
        ) : (
          <View>
            <AtTabs
              current={current}
              tabList={tabList}
              onClick={this.changeTabs}
            >
              <AtTabsPane current={current} index={0}></AtTabsPane>
            </AtTabs>
            <View
              style={{ background: bgColorFE, marginBottom: 5 }}
              className='at-row at-row__justify--around tac'
            >
              <Navigator
                hoverClass='none'
                className='fz36 at-col'
                url='./gpa/index'
                style={{ borderRight: `1px solid ${secondary_colorE}` }}
              >
                {/* <AtIcon
                  prefixClass='icon'
                  value='gpa'
                  size='20'
                  color='#4e4e6a'
                /> */}
                学分查询
              </Navigator>
            </View>
            <View className='getted fz30 tac'>点击任意课程显示详情</View>

            <View className='tac' style={{ background: bgColorFE }}>
              {Object.keys(all_score[`${term}`]).map(element => (
                <View key={element}>
                  <View className='title fz30'>
                    {element == 1 ? '上学期' : '下学期'}
                  </View>
                  {all_score[`${term}`][element].map((item, /** @type {number} */ i) => (
                    <Item
                      key={i}
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
        )}
      </View>
    )
  }
}
