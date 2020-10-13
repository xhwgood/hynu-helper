import Taro, { PureComponent } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent } from 'taro-ui'
import { week } from '@utils/data'
import './index.scss'

export default class Index extends PureComponent {
  static defaultProps = {
    propsWeek: ''
  }

  render() {
    const { showWeek, closeChangeWeek, propsWeek, changeWeek } = this.props

    return (
      <AtModal isOpened={showWeek} onClose={closeChangeWeek}>
        <AtModalHeader>查看其它星期课程</AtModalHeader>
        <AtModalContent>
          <View className='at-row at-row--wrap at-row__justify--around'>
            {week.map(item => (
              <View
                className='change-item'
                style={{
                  background: propsWeek + 1 == item ? '#ddd' : ``
                }}
                onClick={changeWeek.bind(this, item - 1)}
                key={item}
              >
                {propsWeek + 1 == item ? '本周' : `第${item}周`}
              </View>
            ))}
          </View>
        </AtModalContent>
      </AtModal>
    )
  }
}
