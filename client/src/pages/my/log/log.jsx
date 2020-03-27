import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Logo from '@components/logo'
import { AtDivider } from 'taro-ui'
import logList from './log-list'
import './log.scss'

export default class Log extends Taro.Component {
  config = {
    navigationBarTitleText: '更新日志'
  }

  render() {
    return (
      <View className='container'>
        <Logo />
        {logList.map(item => (
          <View className='container'>
            <AtDivider content={item.date} />
            <View>版本：{item.version}</View>
            <View className='content'>更新内容：{item.content}</View>
          </View>
        ))}
      </View>
    )
  }
}
