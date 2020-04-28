import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { AtButton, AtForm, AtInput } from 'taro-ui'
import SelectWeek from '@components/index/add-class/select-week/select-week'
import './addClass.scss'

class addClass extends Component {
  config = {
    navigationBarTitleText: '添加课程'
  }
  state = {
    cName: '',
    place: '',
    teacher: '',
    week: [],
    section_arr: [
      ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      [
        '第1节',
        '第2节',
        '第3节',
        '第4节',
        '第5节',
        '第6节',
        '第7节',
        '第8节',
        '第9节',
        '第10节'
      ],
      [
        '到第1节',
        '到第2节',
        '到第3节',
        '到第4节',
        '到第5节',
        '到第6节',
        '到第7节',
        '到第8节',
        '到第9节',
        '到第10节'
      ]
    ],
    selectWeekIsOpen: false
  }

  changeName = e => this.setState({ username: e })
  changeRoom = e => this.setState({ place: e })
  changeTeacher = e => this.setState({ teacher: e })
  changeSection = e => this.setState({ section: e.detail.value })

  // 显示选择周数的模态框
  showSelectWeek = () => {
    this.setState({ selectWeekIsOpen: true })
  }

  // 添加至课表
  addClass = () => {
    const { cName, place, teacher, week } = this.state
    const myClass = Taro.getStorageSync('myClass')
    myClass.push({
      name: cName,
      place,
      week,
      oriWeek: week,
      section: '',
      teacher,
      day: ''
    })
    Taro.setStorageSync('myClass', myClass)
  }

  render() {
    const { cName, place, teacher, section, section_arr,selectWeekIsOpen } = this.state

    return (
      <View>
        <AtForm onSubmit={this.addClass} className='form'>
          <AtInput
            title='课程名'
            placeholder='请输入课程名'
            value={cName}
            onChange={this.changeName}
          />
          <AtInput
            title='教室'
            placeholder='请输入教室'
            value={place}
            onChange={this.changeRoom}
          />
          <View className='page-section' onClick={this.showSelectWeek}>
            <Text className='at-input__title'>周数</Text>
            <Text className='picker-select'>请选择</Text>
          </View>
          <View className='page-section'>
            <Picker
              mode='multiSelector'
              className='at-input__container'
              value={section}
              range={section_arr}
              onChange={this.changeSection}
            >
              <View className='picker'>
                <Text className='at-input__title'>节数</Text>
                <Text className='picker-select'>
                  {section
                    ? `${section_arr[0][section[0]]} ${
                        section[1] == section[2]
                          ? `第${section[1] + 1}节`
                          : `${section[1] + 1}-${section[2] + 1}节`
                      }`
                    : '请选择'}
                </Text>
              </View>
            </Picker>
          </View>
          <AtInput
            title='教师'
            placeholder='请输入教师姓名'
            value={teacher}
            onChange={this.changeTeacher}
          />
          <AtButton className='mtop' type='primary' formType='submit'>
            添加至课表
          </AtButton>
        </AtForm>
        <SelectWeek selectWeekIsOpen={selectWeekIsOpen} />
      </View>
    )
  }
}

export default addClass
