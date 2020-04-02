import Taro, { Component } from '@tarojs/taro'
import { View, Text, MovableArea, MovableView } from '@tarojs/components'
import ajax from '@utils/ajax'
import { AtIcon, AtFab } from 'taro-ui'
import Bottom from '@components/treasure/score/bottom'
import Drawer from '@components/treasure/score/drawer'
import { slogan, path } from '@utils/slogan.js'
import './score.scss'

export default class Score extends Component {
  config = {
    navigationBarBackgroundColor: '#4e4e6a',
    navigationBarTitleText: '查成绩',
    navigationBarTextStyle: 'white'
  }

  state = {
    score_arr: [],
    // 抽屉是否打开
    opened: false
  }
  pageNum = 1

  onReachBottom() {
    this.getScore()
  }

  getScore = (newV, OrderBy = 'a.xqmc+desc') => {
    const sessionid = Taro.getStorageSync('sid')
    const username = Taro.getStorageSync('username')
    if (newV) {
      this.pageNum = 1
    }
    const data = {
      func: 'getScore',
      data: {
        sessionid,
        PageNum: this.pageNum,
        OrderBy,
        value: username,
        username
      }
    }
    ajax('base', data).then(res => {
      const { score_arr, all_credit } = res.score
      if (newV) {
        this.setState({ score_arr: score_arr })
      } else {
        this.setState({
          score_arr: this.state.score_arr.concat(score_arr),
          all_credit
        })
      }
      this.pageNum++
    })
  }

  showBottom = (item, i) => {
    const { score_arr } = this.state
    score_arr[i].bottomShow = !item.bottomShow
    this.setState({ score_arr })
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
          score_arr[i] = { ...score_arr[i], ...single_obj }
          this.setState({ score_arr })
        }
      })
    }
  }

  openDrawer = () => this.setState({ opened: true })
  closeDrawer = () => this.setState({ opened: false })

  componentWillMount() {
    this.getScore()
    const myterm = Taro.getStorageSync('myterm')
    this.setState({ myterm })
  }

  onShareAppMessage() {
    return {
      title: slogan,
      path
    }
  }

  render() {
    const { score_arr, myterm, opened, all_credit } = this.state

    return (
      <View className='score'>
        <MovableArea style='height: 85%; width: 90rpx; bottom: 100rpx; pointer-events: none;'>
          <MovableView
            style='height: 90rpx; width: 90rpx; pointer-events: auto;'
            direction='vertical'
          >
            <AtFab onClick={this.openDrawer}>
              <Text className='at-fab__icon at-icon at-icon-menu' />
            </AtFab>
          </MovableView>
        </MovableArea>
        <Drawer
          opened={opened}
          getScore={this.getScore}
          closeDrawer={this.closeDrawer}
          all_credit={all_credit}
        />
        {score_arr.length &&
          score_arr.map((item, i) => (
            <View className='border-b' key={item.queryDetail}>
              <View
                className='item-container'
                onClick={this.showBottom.bind(this, item, i)}
              >
                <View className='item'>
                  <View className='course'>
                    {item.course}
                    {item.makeup ? '（补考）' : ''}
                  </View>
                  <View>{item.score}</View>
                </View>
                <View className='term'>
                  <Text>学期：{myterm[item.term]}</Text>
                  <View>
                    更多
                    <AtIcon
                      value={item.bottomShow ? 'chevron-down' : 'chevron-left'}
                      size='22'
                      color='#666'
                    />
                  </View>
                </View>
              </View>
              {item.bottomShow && <Bottom detail={item} />}
            </View>
          ))}
      </View>
    )
  }
}
