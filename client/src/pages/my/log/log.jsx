import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import Logo from '@components/logo'
import { AtDivider } from 'taro-ui'
import moment from '@utils/moment.min.js'
import logList from './log-list'
import './log.scss'

export default class Log extends Taro.Component {
  config = {
    navigationBarTitleText: '更新日志'
  }

  onShareAppMessage() {
    return {
      title: SLOGAN
    }
  }

  render() {
    const year = new Date().getFullYear() + '年'

    return (
      <View className='log'>
        <Logo />
        <View className='container'>
          <View style={{ color: '#777' }}>
            目前已经运营{moment().diff(moment('2020-03-27'), 'days')}
            天，共更新了
            {logList.length}个版本。
          </View>
          {logList.map(item => (
            <View key={item.version}>
              <AtDivider content={item.version} />
              <View>日期：{item.date.replace(year, '')}</View>
              <View className='content'>内容：{item.content}</View>
            </View>
          ))}
        </View>
      </View>
    )
  }
}
