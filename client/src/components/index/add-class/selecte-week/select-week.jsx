import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtModal, AtModalContent } from 'taro-ui'
import './select-week.scss'

const SelectWeek = ({ selectWeekIsOpen }) => {
  return (
    <AtModal isOpened={selectWeekIsOpen}>
      <View className='header'>选择上课周数</View>
      <AtModalContent className='content'>
        <View className='txt'>
          <Text className='ml'>
            选择上课周数
          </Text>
        </View>
      </AtModalContent>
    </AtModal>
  )
}

export default SelectWeek
