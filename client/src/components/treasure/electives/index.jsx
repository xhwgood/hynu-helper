import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtIcon, AtProgress } from 'taro-ui'
import ajax from '@utils/ajax'
import { noicon, nocancel } from '@utils/taroutils'
import { get as getGlobalData } from '@utils/global_data.js'
import './index.scss'

export default class Index extends Component {
  static defaultProps = {
    list: [],
    showBottom: () => {}
  }

  /**
   * 选课/退选按钮
   * @param {string} id 课程 ID
   * @param {object} item 该课程数据
   * @param {Event} e
   */
  select = (id, item, e) => {
    e.stopPropagation()
    if (item.surplus == 0) {
      noicon('选课人数已满！')
    } else if (this.props.selected) {
      noicon('本学期已选了一门选修课，无法再选！')
    } else {
      const data = {
        func: 'easyQuery',
        data: {
          sessionid: getGlobalData('sid'),
          queryDetail: id,
          spider: 'checkCancelxxk'
        }
      }
      ajax('base', data).then(({ modalMsg }) => {
        if (modalMsg.includes('选课成功')) {
          // 弹框提示选课成功
          nocancel(
            `你已成功选中《${item.name}》，时间为${item.week}周 ${item.time}`
          )
          // 页面滚至顶部，显示已选选修课
          Taro.pageScrollTo({
            scrollTop: 0
          })
          const notoast = true
          this.props.selectList(notoast)
        } else {
          nocancel(modalMsg)
          if (modalMsg == '退选成功！') {
            this.props.selectList()
          }
          // this.props.setSelectedEmpty()
        }
      })
    }
  }

  render() {
    const { list, showBottom } = this.props

    return (
      <View>
        {list.length &&
          list.map((item, i) => (
            // 点击该选修课即可展开详情
            <View
              className='border-b'
              onClick={showBottom && showBottom.bind(this, item, i)}
              key={item.name}
            >
              <View className='item-container at-row'>
                <View className='at-col at-col-8'>
                  <View className='item'>{item.name}</View>
                  <View>
                    <View className='more'>开课院系：{item.from}</View>
                    {item.teacher && (
                      <View className='more'>授课教师：{item.teacher}</View>
                    )}
                  </View>
                </View>
                <View className='at-col at-col-3'>
                  <Button
                    className='btn'
                    onClick={this.select.bind(this, item.classID, item)}
                  >
                    {item.mySelected
                      ? '退选'
                      : item.surplus == 0
                      ? '已满'
                      : '选课'}
                  </Button>
                </View>
              </View>
              {item.progress >= 0 && (
                <View className='pro-txt'>
                  已选/总人数：
                  <AtProgress
                    strokeWidth={9}
                    percent={item.progress}
                    color='#f2a379'
                  />
                </View>
              )}
              {/* 选修课详情 */}
              {(item.mySelected || item.bottomShow) && (
                <View className='bottom'>
                  {!item.mySelected && (
                    <View className='at-row'>
                      <View className='at-col'>已选：{item.selected}人</View>
                      <View className='at-col' style={{ fontWeight: 'bold' }}>
                        剩余可选：{item.surplus}人
                      </View>
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
                <View className='at-row at-row__justify--end'>
                  {item.bottomShow ? '收起' : '更多'}
                  <AtIcon
                    value={item.bottomShow ? 'chevron-up' : 'chevron-down'}
                    size='22'
                    color='#666'
                  />
                </View>
              )}
            </View>
          ))}
      </View>
    )
  }
}
