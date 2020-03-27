import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtIcon, AtProgress } from 'taro-ui'
import ajax from '@utils/ajax'
import './index.scss'

export default class Index extends Component {
  static defaultProps = {
    list: [],
    selectList: () => {},
    showBottom: () => {}
  }

  select = (id, e) => {
    e.stopPropagation()
    const sessionid = Taro.getStorageSync('sid')
    const data = {
      func: 'easyQuery',
      data: {
        sessionid,
        queryDetail: id,
        spider: 'checkCancelxxk'
      }
    }
    ajax('base', data).then(res => {
      Taro.pageScrollTo({
        scrollTop: 0
      })
      this.props.selectList()
    })
  }

  render() {
    const { list, showBottom } = this.props

    return (
      <View>
        {list.length &&
          list.map((item, i) => (
            <View
              className='border-b'
              onClick={showBottom.bind(this, item, i)}
              key={item.name}
            >
              <View className='item-container at-row'>
                <View className='at-col at-col-8'>
                  <View className='item'>{item.name}</View>
                  <View className='more'>
                    <View>开课院系：{item.from}</View>
                    {item.teacher && <View>授课教师：{item.teacher}</View>}
                  </View>
                </View>
                <View className='at-col at-col-3'>
                  {item.mySelected ? (
                    <Button
                      className='btn cancel'
                      onClick={this.select.bind(e, item.classID)}
                    >
                      退选
                    </Button>
                  ) : (
                    <Button
                      className='btn'
                      onClick={this.select.bind(e, item.classID)}
                    >
                      选课
                    </Button>
                  )}
                </View>
              </View>
              {item.progress >= 0 && (
                <View className='pro-txt'>
                  已选/总人数：
                  <AtProgress strokeWidth={9} percent={item.progress} />
                </View>
              )}
              {(item.mySelected || item.bottomShow) && (
                <View className='bottom'>
                  {!item.mySelected && (
                    <View className='at-row'>
                      <View className='at-col'>已选：{item.selected}人</View>
                      <View className='at-col'>剩余：{item.surplus}人</View>
                    </View>
                  )}
                  <View className='at-row'>
                    <View className='at-col'>上课周：{item.week}周</View>
                    <View className='at-col'>上课时间：{item.time}</View>
                  </View>
                  {item.credit && <View>学分：{item.credit}</View>}
                  {item.place && <View>地点：{item.place}</View>}
                  {item.sex && <View>性别要求：{item.sex}</View>}
                </View>
              )}
              {!item.mySelected && (
                <View>
                  <AtIcon
                    value={item.bottomShow ? 'chevron-up' : 'chevron-down'}
                    size='22'
                    color='#666'
                  />
                  {item.bottomShow ? '收起' : '更多'}
                </View>
              )}
            </View>
          ))}
      </View>
    )
  }
}
