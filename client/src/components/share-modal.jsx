import Taro from '@tarojs/taro'
import { Button } from '@tarojs/components'
import { AtModal, AtModalContent, AtModalAction } from 'taro-ui'

const ShareModal = ({ isOpened, content, close }) => (
  <AtModal isOpened={isOpened}>
    <AtModalContent>{content}</AtModalContent>
    <AtModalAction>
      <Button onClick={close}>关闭</Button>
      <Button openType='share'>分享给好友</Button>
    </AtModalAction>
  </AtModal>
)

export default ShareModal
