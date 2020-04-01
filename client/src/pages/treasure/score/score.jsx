import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ajax from '@utils/ajax'
import { AtIcon } from 'taro-ui'
import Bottom from '@components/treasure/score'
import { slogan, path } from '@utils/slogan.js'
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
        value: 'a.xqmc+',
        sort: 'desc'
      },
      {
        title: '按成绩降序',
        value: 'a.zcj+',
        sort: 'desc'
      }
    ]
  }
  value = 'a.xqmc+desc'
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
        OrderBy: this.value,
        value: username,
        username
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

  change = (item, i) => {
    const { sort_arr } = this.state
    if (item.value.charAt(2) == this.value.charAt(2)) {
      if (item.title.includes('升')) {
        item.title = item.title.replace(/升/, '降')
        item.sort = 'desc'
      } else {
        item.title = item.title.replace(/降/, '升')
        item.sort = 'asc'
      }
      sort_arr[i] = item
      this.setState({
        sort_arr
      })
    }
    const newV = true
    this.value = item.value + item.sort
    this.getScore(newV)
  }

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
    const { score_arr, sort_arr, myterm } = this.state

    return (
      <View className='score'>
        <View className='at-row at-row__align--center'>
          {sort_arr.map((item, i) => (
            <View
              onClick={this.change.bind(this, item, i)}
              key={item.title}
              className={
                item.value + item.sort == this.value
                  ? 'selected at-col'
                  : 'unselect at-col'
              }
            >
              <View className='txt'>
                {item.title}
                <AtIcon
                  value={item.sort == 'desc' ? 'arrow-down' : 'arrow-up'}
                  size='22'
                  color={item.value + item.sort == value ? '#fff' : '#666'}
                />
              </View>
            </View>
          ))}
        </View>
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
