import Taro, { Component } from '@tarojs/taro'
import { View, Radio, RadioGroup } from '@tarojs/components'
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
    type: 'xh',
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
    if ((type == 'xh' && xh) || (type == 'xm' && xm) ) {
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
        {type == 'xh' ? (
          <AtSearchBar
            actionName='查找'
            showActionButton
            onConfirm={this.onSubmit}
            maxLength={9}
            value={xh}
            placeholder='请输入学号（允许模糊查找）'
            onChange={this.changeXh}
            onActionClick={this.onSubmit}
          />
        ) : (
          <AtSearchBar
            actionName='查找'
            showActionButton
            onConfirm={this.onSubmit}
            value={xm}
            placeholder='请输入姓名（允许模糊查找）'
            onChange={this.changeXm}
            onActionClick={this.onSubmit}
          />
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
