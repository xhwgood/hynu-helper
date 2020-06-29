import Taro, { PureComponent } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

export default class Col extends PureComponent {
  render() {
    return <View className='at-col'>{this.props.children}</View>
  }
}
export default Col
