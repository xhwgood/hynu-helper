import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtModal, AtModalContent, AtModalHeader } from 'taro-ui'
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
    const { selectWeekIsOpen, closeSelectWeek } = this.props
    const { week } = this.state

    return (
      <AtModal isOpened={selectWeekIsOpen} onClose={closeSelectWeek}>
        <AtModalHeader>选择上课周数</AtModalHeader>
        <AtModalContent className='content'>
        <View className='at-row at-row--wrap'>
            {week.map(item => (
              <View
                className='change-item'
                style={{
                  // background: propsWeek + 1 == item ? '#ddd' : ``
                }}
                onClick={changeWeek.bind(this, item - 1)}
                key={item}
              >
                {/* {propsWeek + 1 == item ? '本周' : `第${item}周`} */}
              </View>
            ))}
          </View>
        </AtModalContent>
      </AtModal>
    )
  }
}
