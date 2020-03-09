import Taro, { Component } from '@tarojs/taro'
import { View, Navigator } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { todayWeek } from '@utils/data'
import './index.scss'

export default class Index extends Component {
  static defaultProps = {
    now: {}
  }

  render() {
    const { now, showDrawer, getMyClass } = this.props
    return (
      <View className="top">
        <View className="set" onClick={showDrawer}>
          <AtIcon value="menu" size="23" color="#000"></AtIcon>
          设置
        </View>
        <View className="main">
          {now.week
            ? `第${now.week + 1}周 ${todayWeek[now.day]}`
            : '现在是假期噢~'}
        </View>
        <Navigator className="right" url="../login/login?getClass=true">
          绑定
        </Navigator>
        {/* <View className="right" onClick={getMyClass}>
          获取课程
        </View> */}
      </View>
    )
  }
}
