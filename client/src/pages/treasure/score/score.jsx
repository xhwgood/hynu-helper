import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ajax from '@utils/ajax'
import './score.scss'

export default class Score extends Component {
  state = {
    score_arr: [
      {
        course: '思想道德修养与法律基础',
        credit: '3',
        detail: false,
        hour: '45',
        makeup: false,
        score: '85',
        sort: '通识教育课程',
        term: '2016-2017-1'
      },
      {
        course: '思想道德修养与法律基础',
        credit: '3',
        detail: false,
        hour: '45',
        makeup: false,
        score: '85',
        sort: '通识教育课程',
        term: '2016-2017-1'
      }
    ]
  }
  pageNum = 1

  onReachBottom() {
    this.getScore()
  }

  getScore = () => {
    const sessionid = Taro.getStorageSync('sid')
    const data = {
      func: 'getScore',
      data: {
        sessionid,
        PageNum: this.pageNum
      }
    }
    ajax('base', data).then(res => {
      console.log(res.score.score_arr)
      this.setState({
        score_arr: this.state.score_arr.concat(res.score.score_arr)
      })
      this.pageNum++
    })
  }

  showDetail = (item, idx) => {
    const { score_arr } = this.state
    score_arr[idx] = {
      ...item,
      detail: !item.detail
    }
    console.log(score_arr[idx])

    this.setState({ score_arr })
  }

  componentWillMount() {
    this.getScore()
  }

  render() {
    const { score_arr } = this.state

    return (
      <View className='score'>
        {score_arr.length &&
          score_arr.map(item => (
            <View className='item-container' key={item.course}>
              <View className='item'>
                <View>
                  {item.course}
                  {item.makeup ? '（补考）' : ''}
                </View>
                <View className='score'>{item.score}</View>
              </View>
              <View>学期：{item.term}</View>
              <View className='bottom'>
                <Text>学时：{item.hour}</Text>
                <Text>学分：{item.credit}</Text>
              </View>
            </View>
          ))}
      </View>
    )
  }
}
