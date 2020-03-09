import Taro from "@tarojs/taro"
import { View, Text } from "@tarojs/components"
import Logo from "@components/logo"

export default class About extends Taro.Component {
  config = {
    navigationBarTitleText: "关于"
  };

  render() {
    return (
      <View>
        <Logo />
        <View className='about'>
          《我的衡师》是一款集学校教务处、校园卡等功能于一身的微信小程序
        </View>
      </View>
    )
  }
}
