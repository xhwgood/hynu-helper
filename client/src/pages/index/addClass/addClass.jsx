import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { AtButton, AtForm, AtInput } from 'taro-ui'
import SelectWeek from '@components/index/add-class/select-week'
import { week } from '@utils/data'
import './addClass.scss'

class addClass extends Component {
  config = {
    navigationBarTitleText: '添加课程'
  }
  state = {
    cName: '',
    place: '',
    teacher: '',
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
    // 显示选择上课周数的模态框，测试时为 true
    selectWeekIsOpen: false,
    // 选中的上课周
    selectedWeek: [],
    // 上课周模态框的按钮
    weekBtn: -1
  }
  // 输入课程名、教室、教师，和选择节数
  changeName = e => this.setState({ cName: e })
  changeRoom = e => this.setState({ place: e })
  changeTeacher = e => this.setState({ teacher: e })
  changeSection = e => this.setState({ section: e.detail.value })

  // 显示/隐藏选择周数的模态框
  showSelectWeek = () => this.setState({ selectWeekIsOpen: true })
  closeSelectWeek = () => this.setState({ selectWeekIsOpen: false })

  // 选择上课周数，选中数字
  addToWeek = item => {
    const { selectedWeek } = this.state
    const idx = selectedWeek.indexOf(item)
    // 如果已经选中，则移除，否则添加
    if (idx > -1) {
      selectedWeek.splice(idx, 1)
    } else {
      selectedWeek.push(item)
      selectedWeek.sort((a, b) => a - b)
    }
    console.log('week: ', week)
    this.setState({ selectedWeek: [...selectedWeek] })
  }
  // 选择上课周数，点击按钮
  addToWeekBtn = i =>
    // 按钮只能选中一个，如果已经选中，则取消选中
    this.setState(
      preState => ({
        weekBtn: preState.weekBtn == i ? -1 : i
      }),
      () => {
        const { weekBtn } = this.state
        switch (weekBtn) {
          case 2:
            // 需要深拷贝，否则会出现 bug
            return this.setState({
              selectedWeek: JSON.parse(JSON.stringify(week))
            })
          case 1:
            return this.setState({ selectedWeek: week.filter(i => i % 2 == 0) })
          case 0:
            return this.setState({ selectedWeek: week.filter(i => i % 2 == 1) })

          default:
            return this.setState({ selectedWeek: [] })
        }
      }
    )

  // 添加至课表
  addClass = () => {
    const { cName, place, selectedWeek, teacher, section } = this.state
    console.log(cName, place, selectedWeek, teacher, section)

    // const myClass = Taro.getStorageSync('myClass')
    // myClass.push({
    //   name: cName,
    //   place,
    //   week,
    //   oriWeek: week,
    //   section: '',
    //   teacher,
    //   day: ''
    // })
    // Taro.setStorageSync('myClass', myClass)
  }

  render() {
    const {
      cName,
      place,
      teacher,
      section,
      section_arr,
      selectWeekIsOpen,
      selectedWeek,
      weekBtn
    } = this.state

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
            <Text className='picker-select'>
              {selectedWeek.length ? `${selectedWeek.toString()}周` : '请选择'}
            </Text>
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
        <SelectWeek
          selectWeekIsOpen={selectWeekIsOpen}
          selectedWeek={selectedWeek}
          addToWeek={this.addToWeek}
          addToWeekBtn={this.addToWeekBtn}
          weekBtn={weekBtn}
          closeSelectWeek={this.closeSelectWeek}
        />
      </View>
    )
  }
}

export default addClass
