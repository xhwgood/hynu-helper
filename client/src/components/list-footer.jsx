import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

/** 有列表的页面底部loading */
const ListFooter = ({ hasNext }) => hasNext ? (
  <View>
    <AtIcon
      value='loading-3'
      customStyle={{
        transform: 'rotate(360deg)',
        transition: 'All 0.8s ease'
      }}
    />
    数据正快马加鞭赶来……
  </View>
) : <View>没有更多了~</View>

export default ListFooter
