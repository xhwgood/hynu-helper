import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'
// Taro UI 的组件 BUG 有点多，所以自己写了一个蒙层
export default class Index extends Component {
  btnCancel = () => {
    this.props.onCloseHelp && this.props.onCloseHelp()
  }

  render() {
    return (
      <View className='dialog' onClick={this.btnCancel}>
        {props.children}
      </View>
    )
  }
}
