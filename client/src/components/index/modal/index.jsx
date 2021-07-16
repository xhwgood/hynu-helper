// @ts-check
import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtModal, AtModalContent, AtIcon, AtModalAction } from 'taro-ui'
import { day } from '@utils/data'
import './index.scss'

export default class Index extends PureComponent {
  static defaultProps = {
    detail: {}
  }

  componentDidHide() {
    this.props.handleClose()
  }

  render() {
    const { detail, handleClose, isOpened } = this.props

    return (
      <AtModal isOpened={isOpened} onClose={handleClose}>
        <View className='header' style={{ color: detail.bg }}>
          {detail.name}
        </View>
        <AtModalContent>
          <View className='txt'>
            <AtIcon value='map-pin' size='20' color='#333' />
            <Text selectable className='ml'>
              教室：{detail.place}
            </Text>
          </View>
          <View className='txt'>
            <AtIcon value='calendar' size='17' color='#333' />
            <Text selectable className='ml'>
              周数：{detail.oriWeek && detail.oriWeek.toString()}
            </Text>
          </View>
          <View className='txt'>
            <AtIcon value='clock' size='18' color='#333' />
            <Text selectable className='ml'>
              节数：{day[detail.day - 1]} {detail.section}节
            </Text>
          </View>
          <View className='txt'>
            <AtIcon value='user' size='18' color='#333' />
            <Text selectable className='ml'>
              老师：{detail.teacher ? detail.teacher : '暂无教师'}
            </Text>
          </View>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={handleClose}>关闭</Button>
          {/* {detail.isCustom && (
            <Button onClick={() => Taro.navigateTo}>编辑</Button>
          )} */}
        </AtModalAction>
      </AtModal>
    )
  }
}
