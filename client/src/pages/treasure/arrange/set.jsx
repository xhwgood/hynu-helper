import Taro, { PureComponent } from '@tarojs/taro'
import { Picker, View } from '@tarojs/components'
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
    time: [0, 0],
    place: '',
    remind: 0,
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

  changeName = e => {
    this.setState({ name: e })
  }
  changeDate = e => {
    this.setState({ date: e.detail.value })
  }
  changeTime = e => {
    this.setState({ time: e.detail.value })
  }
  changePlace = e => {
    this.setState({ place: e })
  }

  changeRemind = e => {
    this.setState({
      remind: e.detail.value
    })
  }

  onSubmit = () => {
    // Taro.removeStorageSync('exam_arr')
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
              <Text className='picker-select'>
                {time_arr[0][time[0]]}:{time_arr[1][time[1]]}
              </Text>
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
              <Text className='picker-select'>{arr_remind[remind]}</Text>
            </View>
          </Picker>
        </View>
        <AtButton className='mtop' type='primary' formType='submit'>
          立即添加
        </AtButton>
      </AtForm>
    )
  }
}
