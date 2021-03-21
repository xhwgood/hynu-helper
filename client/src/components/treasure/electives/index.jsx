import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtIcon, AtProgress } from 'taro-ui'
import ajax from '@utils/ajax'
import { showError, nocancel } from '@utils/taroutils'
import { get as getGlobalData } from '@utils/global_data'
import { electives } from '@styles/color'
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
    const { selected, selectList, openShareModal } = this.props
    if (item.surplus == 0) {
      showError('选课人数已满！')
    } else if (selected) {
      nocancel('本学期已选了一门选修课，无法再选！')
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
          openShareModal(
            `你已成功选中《${item.name}》，上课时间为${item.week}周 ${item.time}，快跟好友分享一下吧~`
          )
          // 页面滚至顶部，显示已选选修课
          Taro.pageScrollTo({
            scrollTop: 0
          })
          const notoast = true
          selectList(notoast)
        } else {
          nocancel(modalMsg)
          if (modalMsg == '退选成功！') {
            selectList()
          }
        }
      })
    }
  }

  render() {
    const { list, showBottom } = this.props

    return (
      <View>
        {list.length &&
          list.map((item, i) => {
            const {
              name,
              from,
              teacher,
              // 是否已选中
              mySelected,
              surplus,
              classID,
              progress,
              bottomShow,
              credit,
              place,
              sex,
              week,
              time,
              selected
            } = item

            return (
              // 点击该选修课即可展开详情
              <View
                className='border-b'
                onClick={showBottom && showBottom.bind(this, item, i)}
                key={name}
              >
                <View className='item-container at-row'>
                  <View className='at-col at-col-8'>
                    <View
                      className='item'
                      style={
                        name.includes('三选二') ? { color: electives } : {}
                      }
                    >
                      {name}
                    </View>
                    <View>
                      <View className='more'>开课院系：{from}</View>
                      {teacher && (
                        <View className='more'>授课教师：{teacher}</View>
                      )}
                    </View>
                  </View>
                  <View className='at-col at-col-3'>
                    <Button
                      className='btn'
                      onClick={this.select.bind(this, classID, item)}
                    >
                      {mySelected ? '退选' : surplus == 0 ? '已满' : '选课'}
                    </Button>
                  </View>
                </View>
                {progress >= 0 && (
                  <View className='pro-txt'>
                    已选/总人数：
                    <AtProgress
                      strokeWidth={9}
                      percent={progress}
                      color={electives}
                    />
                  </View>
                )}
                {/* 选修课详情 */}
                {(mySelected || bottomShow) && (
                  <View className='bottom'>
                    {!mySelected && (
                      <View className='at-row'>
                        <View className='at-col'>已选：{selected}人</View>
                        <View className='at-col' style={{ fontWeight: 'bold' }}>
                          剩余可选：{surplus}人
                        </View>
                      </View>
                    )}
                    <View className='at-row'>
                      <View className='at-col'>上课周：{week}周</View>
                      <View className='at-col'>上课时间：{time}</View>
                    </View>
                    {credit && <View>学分：{credit}</View>}
                    {place && <View>地点：{place}</View>}
                    {sex && <View>性别要求：{sex}</View>}
                  </View>
                )}
                {!mySelected && (
                  <View className='at-row at-row__justify--end'>
                    {bottomShow ? '收起' : '更多'}
                    <AtIcon
                      value='chevron-up'
                      customStyle={{
                        transform: bottomShow ? 'rotate(-180deg)' : '',
                        transition: 'All 0.3s',
                        transformOrigin: '11px 10px'
                      }}
                      size='22'
                      color='#666'
                    />
                  </View>
                )}
              </View>
            )
          })}
      </View>
    )
  }
}
