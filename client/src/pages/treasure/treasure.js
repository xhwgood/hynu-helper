import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import ajax from '@utils/ajax'
import Card from '@components/treasure/card'
import { list } from './tList.js'
import './treasure.scss'

export default class Treasure extends Taro.Component {
  config = {
    navigationBarTitleText: '百宝箱'
  }

  myFunc = item => {
    const card = Taro.getStorageSync('card')
    if (card.balance) {
      Taro.navigateTo({ url: `/pages/treasure/${item.icon}/${item.icon}` })
      // 变化当前导航条的颜色和标题
      Taro.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: item.bgc,
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
      Taro.setNavigationBarTitle({ title: String(item.text) })
    } else {
      Taro.showToast({
        title: '请先绑定校园卡',
        icon: 'none'
      })
      Taro.navigateTo({ url: '../login/login_card' })
    }
  }

  render() {
    return (
      <View>
        <View className='treasure'>
          {list.map(item => (
            <View
              className='list'
              style={{ background: item.bgc }}
              onClick={this.myFunc.bind(this, item)}
              key={String(item.bgc)}
            >
              <AtIcon
                prefixClass='icon'
                value={item.icon}
                size='23'
                color='#fff'
              />
              {item.text}
            </View>
          ))}
        </View>
        <Card myFunc={this.myFunc} />
      </View>
    )
  }
}
