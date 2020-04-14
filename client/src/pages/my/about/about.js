import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Logo from '@components/logo'
import { AtDivider } from 'taro-ui'
import './about.scss'

export default class About extends Taro.Component {
  config = {
    navigationBarTitleText: '关于'
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
        <AtDivider content='小程序' />
        <View className='about at-col'>
          <Text selectable>　　《我的衡师》是一款集教务处、校园卡、图书馆等功能于一身的微信小程序。
          </Text>
          <View>　　如果你觉得《我的衡师》很不错，但我觉得还不够，我认为一款真正好用的程序：它完全免费且没有广告，真心诚意地为用户服务，用户如果能不计回报的主动的去分享这个程序，这才是真正好用的程序，如果《我的衡师》还没到你乐意去主动分享的程度，那一定是还不够好，不够完美，所以《我的衡师》一定会继续努力。
          </View>
          <View>　　如果你对《我的衡师》有任何的意见/建议，都可以反馈。每一位用户都是《我的衡师》的产品经理，每一位用户的反馈都有可能成为《我的衡师》的修改意见。
          </View>
        </View>
        <AtDivider content='作者' />
        <View className='about at-col'>
          <View>　　我是项鸿伟，学号16190232，专业是计算机科学与技术。《我的衡师》是我的毕业设计，也是我思考了两年的产品，现在终于落地，感慨万分。
          </View>
          <View>　　坦白我的信息，不是希望你能认识我，是希望你相信我，相信《我的衡师》，我不会收集任何你的敏感信息。非敏感信息，《我的衡师》也只会在你完全知情的情况下进行收集，所以你无需担心隐私/数据的泄露。
          </View>
        </View>
        <AtDivider content='开源' />
        <View className='about at-col'>
          <View>
          本项目开源度99.9%（为保证校园卡安全，校园卡加密算法不开源）。
          </View>
          <View>
            项目地址：<Text selectable>https://github.com/xhwgood/hynu-helper</Text>
          </View>
            本人微信/QQ：<Text selectable>734824565</Text>
        </View>
      </View>
    )
  }
}
