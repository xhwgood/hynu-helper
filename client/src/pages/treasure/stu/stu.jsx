import Taro, { Component } from '@tarojs/taro'
import { View, Radio, RadioGroup, Label } from '@tarojs/components'
import { AtPagination, AtSearchBar } from 'taro-ui'
import ajax from '@utils/ajax'
import noicon from '@utils/noicon'
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
    type: 'xm',
    stuRes: [],
    numPages: 1,
    current: 1
  }
  // 点击查找
  onSubmit = (e, PageNum) => {
    if (!PageNum) {
      PageNum = 1
      this.setState({ current: 1 })
    }
    const { xh, xm, type } = this.state
    const sessionid = Taro.getStorageSync('sid')
    const username = Taro.getStorageSync('username')
    // 输入了学号或姓名信息才允许查找，未输入则返回提示
    if ((type == 'xh' && xh) || (type == 'xm' && xm)) {
      const data = {
        func: 'selectStu',
        data: {
          sessionid,
          type,
          value: type == 'xh' ? xh : xm,
          PageNum,
          username
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
      noicon('你还未输入查询信息')
    }
  }
  // 按学号或按姓名
  radioChange = e => {
    this.pageNum = 1
    this.setState({ type: e.detail.value })
  }

  changeXh = value => this.setState({ xh: value })
  changeXm = value => this.setState({ xm: value })
  // 下一页/上一页
  onPageChange = e => {
    this.onSubmit(e, e.current)
    this.setState({ current: e.current })
  }

  onShareAppMessage() {
    return {
      title: SLOGAN,
      path: PATH
    }
  }

  render() {
    const { xh, xm, type, stuRes, numPages, current } = this.state
    const searchObj =
      type == 'xh'
        ? {
            value: xh,
            onChange: this.changeXh,
            placeholder: '请输入学号（允许模糊查找）',
            inputType: 'number'
          }
        : {
            value: xm,
            onChange: this.changeXm,
            placeholder: '请输入姓名（允许模糊查找）'
          }

    return (
      <View>
        <RadioGroup
          onChange={this.radioChange}
          className='at-row at-row__justify--around radio-group'
        >
          {this.state.list.map((item, i) => {
            return (
              <Label for={i} key={i}>
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
        <AtSearchBar
          actionName='查找'
          showActionButton
          maxLength={9}
          {...searchObj}
          onConfirm={this.onSubmit}
          onActionClick={this.onSubmit}
        />
        {type == 'xm' && (
          <View style={{ color: '#999', marginLeft: '7px' }}>
            何不查找下你的姓名呢
          </View>
        )}
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
