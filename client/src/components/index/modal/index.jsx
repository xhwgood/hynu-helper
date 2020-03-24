import Taro, { PureComponent } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent } from 'taro-ui'
import './index.scss'

export default class Index extends PureComponent {
  static defaultProps = {
    isOpen: false,
    detail: {},
    handleClose: () => {}
  }

  render() {
    const { detail, handleClose, isOpened } = this.props

    return (
      <AtModal
        isOpened={isOpened}
        className='detail'
        onClose={handleClose}
      >
        <AtModalHeader>{detail.name}</AtModalHeader>
        <AtModalContent className='content'>
          <View className='txt'>
            <AtIcon value='map-pin' size='20' color='#333' />
            <Text className='ml'>教室：{detail.place}</Text>
          </View>
          <View className='txt'>
            <AtIcon value='calendar' size='17' color='#333' />
            <Text className='ml'>周数：{detail.oriWeek}</Text>
          </View>
          <View className='txt'>
            <AtIcon value='clock' size='18' color='#333' />
            <Text className='ml'>
              节数：{day[detail.day - 1]} {detail.section}节
            </Text>
          </View>
          <View className='txt'>
            <AtIcon value='user' size='18' color='#333' />
            <Text className='ml'>老师：{detail.teacher}</Text>
          </View>
        </AtModalContent>
      </AtModal>
    )
  }
}
