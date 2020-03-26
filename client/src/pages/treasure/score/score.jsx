import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ajax from '@utils/ajax'
import { AtIcon } from 'taro-ui'
import Bottom from '@components/treasure/score'
import './score.scss'

export default class Score extends Component {
  config = {
    navigationBarBackgroundColor: '#4e4e6a',
    navigationBarTitleText: '成绩查询',
    navigationBarTextStyle: 'white'
  }

  state = {
    score_arr: [],
    sort_arr: [
      {
        title: '按学期降序',
        value: 'a.xqmc+desc'
      },
      {
        title: '按学期升序',
        value: 'a.xqmc+asc'
      },
      {
        title: '按成绩降序',
        value: 'a.zcj+desc'
      },
      {
        title: '按成绩升序',
        value: 'a.zcj+asc'
      }
    ],
    value: 'a.xqmc+desc'
  }
  pageNum = 1

  onReachBottom() {
    this.getScore()
  }

  getScore = newV => {
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
        OrderBy: this.state.value,
        value: username
      }
    }
    ajax('base', data).then(res => {
      if (newV) {
        this.setState({ score_arr: res.score.score_arr })
      } else {
        this.setState({
          score_arr: this.state.score_arr.concat(res.score.score_arr)
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
      const data = {
        func: 'singleScore',
        data: {
          sessionid,
          queryDetail: item.queryDetail
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

  change = value => {
    const newV = true
    this.setState({ value }, () => this.getScore(newV))
  }

  componentWillMount() {
    this.getScore()
    const myterm = Taro.getStorageSync('myterm')
    this.setState({ myterm })
  }

  render() {
    const { score_arr, sort_arr, value, myterm } = this.state

    return (
      <View className='score'>
        <View className='at-row at-row__align--center'>
          {sort_arr.map(item => (
            <View
              onClick={this.change.bind(this, item.value)}
              key={item.title}
              className={
                item.value == value ? 'selected at-col' : 'unselect at-col'
              }
            >
              <View className='txt'>{item.title}</View>
            </View>
          ))}
        </View>
        {score_arr.length &&
          score_arr.map((item, i) => (
            <View className='border-b' key={item.course + item.score}>
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
