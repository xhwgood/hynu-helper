import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { AtButton, AtForm, AtInput } from 'taro-ui'
import SelectWeek from '@components/index/add-class/select-week'
import { week, day } from '@utils/data'
import { nocancel } from '@utils/taroutils'
import { primary_color } from '@styles/color'
import './addClass.scss'

export default class addClass extends Component {
  config = {
    navigationBarTitleText: '添加课程'
  }
  state = {
    cName: '',
    place: '',
    teacher: '',
    section_arr: [
      day,
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
    this.setState({
      selectedWeek: [...selectedWeek],
      weekBtn: 3,
      weekTxt: null
    })
  }
  // 选择上课周数，点击按钮
  addToWeekBtn = i =>
    this.setState(
      preState => ({
        // 按钮只能选中一个，如果已经选中，则取消选中
        weekBtn: preState.weekBtn == i ? -1 : i
      }),
      () => {
        let selectedWeek
        let weekTxt
        switch (this.state.weekBtn) {
          case 3:
            // 已选中一个按钮，但又手动点了其他周
            break
          case 2:
            // 需要深拷贝，否则会出现 bug
            selectedWeek = JSON.parse(JSON.stringify(week))
            weekTxt = '所有周'
            break
          case 1:
            selectedWeek = week.filter(i => i % 2 == 0)
            weekTxt = '所有双周'
            break
          case 0:
            selectedWeek = week.filter(i => i % 2 == 1)
            weekTxt = '所有单周'
            break
          // 未选中
          default:
            selectedWeek = []
            weekTxt = null
            break
        }
        this.setState({ selectedWeek, weekTxt })
      }
    )

  // 添加至课表
  addClass = () => {
    const { cName, place, selectedWeek, teacher, section, weekTxt } = this.state
    // console.log(section)
    if (cName && place && selectedWeek && section) {
      let newSection = JSON.parse(JSON.stringify(section))

      const [oriDay, begin, end] = newSection
      // begin：2 end：4
      // 如果相等，说明只有一节课
      if (begin == end) {
        if (begin == 9) {
          newSection = '10'
        } else {
          newSection = '0' + (begin + 1)
        }
      } else {
        newSection = ''
        for (let i = begin; i <= end; i++) {
          if (i == 9) {
            newSection += '10'
          } else {
            newSection += '0' + (i + 1)
          }
        }
      }

      const myClass = Taro.getStorageSync('myClass') || []
      myClass.push({
        name: cName,
        place,
        week: selectedWeek,
        oriWeek: weekTxt ? weekTxt : selectedWeek,
        section: newSection,
        teacher,
        day: String(oriDay + 1),
        isCustom: true
      })
      // console.log(myClass)
      Taro.setStorageSync('myClass', myClass)
      // 清除缓存中的课表校历数据，重新添加
      Taro.removeStorageSync('allWeek')
      // 调用课程表页面的方法，添加进课表
      Taro.getCurrentPages()[0].$component.dealClassCalendar(myClass)
      // 返回
      Taro.navigateBack()
    } else {
      nocancel('需填写课程名、教室、周数及节数')
    }
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
      weekBtn,
      weekTxt
    } = this.state
    const txt = weekTxt ? weekTxt : `${selectedWeek.toString()}周`

    return (
      <View>
        <AtForm
          onSubmit={this.addClass}
          customStyle={{ background: primary_color }}
        >
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
            <Text className='picker-select-week break'>
              {selectedWeek.length ? (
                txt
              ) : (
                <Text className='ccc'>请选择周数</Text>
              )}
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
                <Text className='picker-select break'>
                  {section ? (
                    `${section_arr[0][section[0]]} ${
                      section[1] == section[2]
                        ? `第${section[1] + 1}节`
                        : `${section[1] + 1}-${section[2] + 1}节`
                    }`
                  ) : (
                    <Text className='ccc'>请选择节数</Text>
                  )}
                </Text>
              </View>
            </Picker>
          </View>
          <AtInput
            title='教师'
            placeholder='请输入教师姓名（选填）'
            value={teacher}
            onChange={this.changeTeacher}
          />
          <AtButton type='primary' formType='submit'>
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
