import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Logo from '@components/logo'
import { AtCard } from 'taro-ui'
import moment from '@utils/moment.min'
import logList from './log-list'
import { get } from '@utils/global_data'
import './about.scss'

export default class About extends Taro.Component {
  config = {
    navigationBarTitleText: '关于我的衡师'
  }

  onShareAppMessage() {
    return {
      title: SLOGAN
    }
  }

  render() {
    return (
      <View className='container'>
        <Logo />
        <View className='about fz30'>
          <Text selectable>
            <Text style={{ color: '#ff0302', marginRight: '6rpx' }}>
              我的衡师
            </Text>
            是一款集衡阳师范学院教务处、校园卡、图书馆等功能于一身的微信小程序，由我本人自主开发，如果你有任何疑问或建议，都可以联系我，微信/QQ：734824565。
            <Text style={{ color: 'blue' }}>源码地址：</Text>
            https://github.com/xhwgood/hynu-helper
          </Text>
          <View className='version c9'>
            目前已运营{moment().diff(moment('2020-03-27'), 'days')}
            天，共更新了
            {logList.length}个版本（靠爱发电，更新时间完全随缘）
          </View>
        </View>

        {logList.map(item => (
          <AtCard
            key={item.version}
            title={item.version + ' | ' + item.date.replace(get('year'), '')}
          >
            {item.content.split('；').map((release, idx) => (
              <View>
                {idx + 1}、{release}
              </View>
            ))}
          </AtCard>
        ))}
      </View>
    )
  }
}
