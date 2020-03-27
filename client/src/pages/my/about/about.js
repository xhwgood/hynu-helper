import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Logo from '@components/logo'
import { AtDivider } from 'taro-ui'
import './about.scss'

export default class About extends Taro.Component {
  config = {
    navigationBarTitleText: '关于'
  }

  render() {
    return (
      <View className='container'>
        <Logo />
        <AtDivider content='小程序' />
        <View className='about at-col'>
          <Text selectable>　　《我的衡师》是一款集教务处、校园卡、衡师图书馆等功能于一身的微信小程序。
          </Text>
          <View>　　目前已实现的功能：查询当前学期课程、查询毕业设计、找人、图书馆信息查询、图书馆历史借阅查询、校园卡充值、校园卡余额查询、成绩查询、考试安排、CET查询等。
          </View>
          <View>　　小程序的UI界面可能不太美观，但会持续改进。此外，《我的衡师》承诺：不接受任何赞助，也不会发布显示任何商业广告。
          </View>
          <View>　　如果你对《我的衡师》有任何的意见或者建议，都可以进行反馈，每一位用户都是《我的衡师》的产品经理，每一位用户的反馈都有可能成为《我的衡师》的修改意见。
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
          本项目开源99.9%代码，为保证校园卡安全，校园卡加密算法不进行开源。
          </View>
          <View>
            项目地址：<Text selectable>https://github.com/xhwgood/hynu-helper</Text>
          </View>
          <View>
            欢迎star，提交issue/PR。
          </View>
        </View>
      </View>
    )
  }
}
