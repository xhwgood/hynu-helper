import Taro, { PureComponent } from '@tarojs/taro'
import { Picker, View } from '@tarojs/components'
import { AtButton, AtForm, AtInput } from 'taro-ui'
import './set.scss'

export default class Set extends PureComponent {
  config = {
    navigationBarTitleText: '添加考试安排'
  }

  state = {
    name: '',
    time: '',
    place: '',
    remind: '请选择',
    arr_remind: [
      '提前半小时',
      '提前一小时',
      '提前二小时',
      '提前三小时',
      '提前一天'
    ]
  }

  changeName = e => {
    this.setState({ name: e })
  }
  changeTime = e => {
    this.setState({ time: e })
  }
  changePlace = e => {
    this.setState({ place: e })
  }

  changeRemind = (e) => {
    this.setState({
      remind: this.state.arr_remind[e.detail.value]
    })
  }

  componentWillMount() {
    const { name } = this.$router.params
    this.setState({ name })
  }

  render() {
    const { name, time, place, remind, arr_remind } = this.state
    return (
      <AtForm onSubmit={this.onSubmit} className="form">
        <AtInput
          title="考试科目"
          placeholder="请输入考试科目"
          value={name}
          onChange={this.changeName}
        />
        <AtInput title="考试时间" value={time} onChange={this.changeTime} />
        <AtInput
          title="考试地点"
          placeholder="请输入考试地点"
          value={place}
          onChange={this.changePlace}
        />
        <View className="page-section">
          <Picker
            mode="selector"
            range={arr_remind}
            className='at-input__container'
            onChange={this.changeRemind}
          >
            <View className="picker">
              <Text className='at-input__title'>提醒时间</Text>
              <Text className='picker-select'>{remind}</Text>
            </View>
          </Picker>
        </View>
        <AtButton className="mtop" type="primary" formType="submit">
          立即添加
        </AtButton>
      </AtForm>
    )
  }
}
