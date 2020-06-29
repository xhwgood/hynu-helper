import Taro, { PureComponent } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

export default class Row extends PureComponent {
  render() {
    return <View className='at-row'>{this.props.children}</View>
  }
}
export default Row
