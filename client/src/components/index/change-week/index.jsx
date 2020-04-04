import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import './index.scss'

export default class Index extends PureComponent {
  constructor(props) {
    super(props)
    const week = []
    for (let i = 1; i <= 20; i++) {
      week.push(i)
    }
    this.state = {
      week
    }
  }

  render() {
    const { week } = this.state
    const { showWeek, closeChangeWeek, now, changeWeek } = this.props

    return (
      <AtModal isOpened={showWeek} onClose={closeChangeWeek}>
        <AtModalHeader>查看其它星期课程</AtModalHeader>
        <AtModalContent>
          <View className='at-row at-row--wrap'>
            {week.map(item => (
              <View
                className='change-item'
                onClick={changeWeek.bind(this, item)}
                key={item}
              >
                {now.week + 1 == item ? '本周' : `第${item}周`}
              </View>
            ))}
          </View>
        </AtModalContent>
      </AtModal>
    )
  }
}
