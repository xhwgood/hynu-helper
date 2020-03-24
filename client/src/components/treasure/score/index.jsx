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
    const { detail, handleClose, isOpen } = this.props
    const {
      all,
      endper,
      endterm,
      midper,
      midterm,
      peaceper,
      peacetime,
      name
    } = detail

    return (
      <AtModal isOpened={isOpen} className='detail' onClose={handleClose}>
        <AtModalHeader>{name}</AtModalHeader>
        <AtModalContent className='content'>
          {peacetime && <View>平时成绩：{peacetime}</View>}
          <View>期末成绩：{endterm}</View>
          {midterm && <View>期中成绩：{midterm}</View>}
          <View>平时成绩比例：{peaceper}</View>
          <View>期末成绩比例：{endper}</View>
          {midper && <View>期中成绩比例：{midper}</View>}
          <View>总分：{all}</View>
        </AtModalContent>
      </AtModal>
    )
  }
}
