import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ajax from '@utils/ajax'
import Modal from '@components/treasure/score'
import './score.scss'

export default class Score extends Component {
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
    value: 'a.xqmc+desc',
    isOpen: false,
    detail: {}
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

  showDetail = item => {
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
        single_obj.name = item.course
        this.setState({
          detail: single_obj,
          isOpen: true
        })
      }
    })
  }
  handleClose = () => {
    this.setState({ isOpen: false })
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
    const { score_arr, sort_arr, value, isOpen, detail, myterm } = this.state

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
          score_arr.map(item => (
            <View
              className='item-container'
              onClick={this.showDetail.bind(this, item)}
              key={item.course + item.score}
            >
              <View className='item'>
                <View>
                  {item.course}
                  {item.makeup ? '（补考）' : ''}
                </View>
                <View className='score'>{item.score}</View>
              </View>
              <View>学期：{myterm[item.term]}</View>
              <View className='bottom'>
                <Text>学时：{item.hour}</Text>
                <Text>学分：{item.credit}</Text>
              </View>
            </View>
          ))}
        <Modal detail={detail} isOpen={isOpen} handleClose={this.handleClose} />
      </View>
    )
  }
}
