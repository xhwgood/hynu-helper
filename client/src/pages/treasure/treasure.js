import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './treasure.scss'
import bg from '@images/card-bg.png'

import { list, card } from './tList.js'

export default class Treasure extends Taro.Component {
  config = {
    navigationBarTitleText: '百宝箱'
  }

  // state = {
  //   balance: '4.45'
  // }

  myFunc = item => {
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
  }

  changeBalance = card => {
    this.setState({ balance: card.balance })
  }

  render() {
    const { balance } = this.state
    return (
      <View className="treasure">
        {list.map(item => (
          <View
            className="list"
            style={{ background: item.bgc }}
            onClick={this.myFunc.bind(this, item)}
            key={String(item.bgc)}
          >
            <AtIcon
              prefixClass="icon"
              value={item.icon}
              size="23"
              color="#fff"
            />
            <View className="text">{item.text}</View>
          </View>
        ))}
        <View className="card" onClick={this.myFunc.bind(this, card)}>
          <View className="my-card">
            <View>校园卡</View>
          </View>
          <View className="money">
            {/* http://cdn.xianghw.xyz/card-bg.png */}
            <Image className="bg" src={bg} />
            <View className="balance">
              {balance ? (
                <View>
                  <Text>￥</Text>
                  {balance}
                </View>
              ) : (
                <Text>未绑定校园卡</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    )
  }
}
