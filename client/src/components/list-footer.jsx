import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
/** 有列表的页面底部loading */
const ListFooter = ({ hasNext }) => hasNext ? <View>数据正快马加鞭赶来……</View> : <View>没有更多了~</View>

export default ListFooter
