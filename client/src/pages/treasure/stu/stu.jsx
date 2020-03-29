import Taro, { Component } from '@tarojs/taro'
import { View, Radio, RadioGroup } from '@tarojs/components'
import { AtForm, AtInput, AtButton, AtPagination } from 'taro-ui'
import ajax from '@utils/ajax'
import slogan from '@utils/slogan.js'
import './stu.scss'

export default class Stu extends Component {
  config = {
    navigationBarBackgroundColor: '#f9b8be',
    navigationBarTitleText: '找人',
    navigationBarTextStyle: 'white'
  }

  state = {
    list: [
      {
        value: 'xh',
        text: '按学号查找',
        checked: true
      },
      {
        value: 'xm',
        text: '按姓名查找',
        checked: false
      }
    ],
    type: 'xh',
    stuRes: [],
    numPages: 1,
    current: 1
  }

  onSubmit = (e, PageNum) => {
    if (!PageNum) {
      PageNum = 1
      this.setState({ current: 1 })
    }
    const { xh, xm, type } = this.state
    const sessionid = Taro.getStorageSync('sid')
    if (xh || xm) {
      const data = {
        func: 'selectStu',
        data: {
          sessionid,
          type,
          value: type == 'xh' ? xh : xm,
          PageNum
        }
      }
      ajax('base', data).then(res => {
        const { people, numPages } = res.data
        if (parseInt(numPages)) {
          this.setState({ numPages })
        }
        this.setState({ stuRes: people })
      })
    } else {
      Taro.showToast({
        title: '你还未输入完整信息',
        icon: 'none'
      })
    }
  }

  radioChange = e => {
    this.pageNum = 1
    this.setState({ type: e.detail.value })
  }

  changeXh = value => this.setState({ xh: value })

  changeXm = value => this.setState({ xm: value })

  onPageChange = e => {
    this.onSubmit(e, e.current)
    this.setState({ current: e.current })
  }

  onShareAppMessage() {
    return {
      title: slogan,
      path: '/pages/index/index'
    }
  }

  render() {
    const { xh, xm, type, stuRes, numPages, current } = this.state

    return (
      <View className='stu'>
        <RadioGroup
          onChange={this.radioChange}
          className='at-row at-row__justify--around radio-group'
        >
          {this.state.list.map((item, i) => {
            return (
              <Label className='label' for={i} key={i}>
                <Radio
                  className='radio'
                  value={item.value}
                  checked={item.checked}
                  color='#f9b8be'
                >
                  {item.text}
                </Radio>
              </Label>
            )
          })}
        </RadioGroup>
        <AtForm onSubmit={this.onSubmit.bind(1)}>
          {type == 'xh' ? (
            <AtInput
              name='xh'
              title='学号'
              placeholder='请输入学号（允许模糊查找）'
              maxLength='8'
              value={xh}
              onChange={this.changeXh}
            />
          ) : (
            <AtInput
              name='xm'
              title='姓名'
              placeholder='请输入姓名（允许模糊查找）'
              value={xm}
              onChange={this.changeXm}
            />
          )}
          <AtButton className='submit' formType='submit'>
            查找
          </AtButton>
        </AtForm>
        {stuRes.length && (
          <View>
            <View className='res'>
              查找结果：
              {stuRes.map(item => (
                <View className='at-row item' key={item.name + item.major}>
                  <View className='at-col at-col-3'>{item.name}</View>
                  <View className='at-col at-col-6 major'>{item.major}</View>
                </View>
              ))}
            </View>
            <AtPagination
              onPageChange={this.onPageChange}
              total={numPages * 10}
              pageSize={10}
              current={current}
            />
          </View>
        )}
      </View>
    )
  }
}
