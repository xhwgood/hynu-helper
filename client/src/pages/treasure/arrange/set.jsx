import Taro, { PureComponent } from '@tarojs/taro'
import { Picker, View, Text } from '@tarojs/components'
import { AtButton, AtForm, AtInput } from 'taro-ui'
import moment from '@utils/moment.min.js'
import './set.scss'

export default class Set extends PureComponent {
  config = {
    navigationBarBackgroundColor: '#769fcd',
    navigationBarTitleText: '添加',
    navigationBarTextStyle: 'white'
  }

  state = {
    name: '',
    time: '08:00',
    place: '',
    remind: '提前半小时',
    arr_remind: [
      '提前半小时',
      '提前一小时',
      '提前二小时',
      '提前三小时',
      '提前一天'
    ],
    date: '',
    time_arr: [
      [
        '08',
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20'
      ],
      ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']
    ]
  }

  changeName = e => this.setState({ name: e })

  changeDate = e => this.setState({ date: e.detail.value })

  changeTime = e => {
    const { time_arr } = this.state
    const v = e.detail.value
    this.setState({
      time: `${time_arr[0][v[0]]}:${time_arr[1][v[1]]}`
    })
  }
  changePlace = e => this.setState({ place: e })

  changeRemind = e => {
    const { arr_remind } = this.state
    this.setState({
      remind: arr_remind[e.detail.value]
    })
  }

  onSubmit = () => {
    const { name, time, date, place, remind } = this.state
    const exam_remind = { name, time, date, place, remind }
    let exam_arr = Taro.getStorageSync('exam_arr')
    exam_arr = [...exam_arr, exam_remind]
    exam_arr.sort((a, b) => new Date(a.date) - new Date(b.date))
    Taro.setStorageSync('exam_arr', exam_arr)
    Taro.navigateBack()
  }

  componentWillMount() {
    const { name } = this.$router.params
    const today = moment().format('YYYY-MM-DD')
    this.setState({
      name,
      start: today
    })
  }

  render() {
    const {
      name,
      time,
      place,
      remind,
      arr_remind,
      date,
      start,
      time_arr
    } = this.state
    return (
      <AtForm onSubmit={this.onSubmit} className='form'>
        <AtInput
          title='考试科目'
          placeholder='请输入考试科目'
          value={name}
          onChange={this.changeName}
        />
        <View className='page-section'>
          <Picker
            mode='date'
            start={start}
            className='at-input__container'
            onChange={this.changeDate}
          >
            <View className='picker'>
              <Text className='at-input__title'>考试日期</Text>
              <Text className='picker-select'>{date ? date : '请选择'}</Text>
            </View>
          </Picker>
        </View>
        <View className='page-section'>
          <Picker
            mode='multiSelector'
            className='at-input__container'
            value={time}
            range={time_arr}
            onChange={this.changeTime}
          >
            <View className='picker'>
              <Text className='at-input__title'>开始时间</Text>
              <Text className='picker-select'>{time}</Text>
            </View>
          </Picker>
        </View>
        <AtInput
          title='考试地点'
          placeholder='请输入考试地点'
          value={place}
          onChange={this.changePlace}
        />
        <View className='page-section'>
          <Picker
            mode='selector'
            range={arr_remind}
            className='at-input__container'
            onChange={this.changeRemind}
          >
            <View className='picker'>
              <Text className='at-input__title'>提醒时间</Text>
              <Text className='picker-select'>{remind}</Text>
            </View>
          </Picker>
        </View>
        <AtButton type='primary' formType='submit'>
          立即添加
        </AtButton>
      </AtForm>
    )
  }
}
