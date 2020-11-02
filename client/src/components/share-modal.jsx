import Taro from '@tarojs/taro'
import { Button } from '@tarojs/components'
import { AtModal, AtModalContent, AtModalAction } from 'taro-ui'

const ShareModal = ({ shareIsOpen, txt, close }) => (
  <AtModal isOpened={shareIsOpen}>
    <AtModalContent>{txt}</AtModalContent>
    <AtModalAction>
      <Button onClick={() => close()}>关闭</Button>
      <Button openType='share'>分享给好友</Button>
    </AtModalAction>
  </AtModal>
)

export default ShareModal
