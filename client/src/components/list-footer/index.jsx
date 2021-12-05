// @ts-check
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './index.scss'

/**
 * 有列表的页面底部loading
 * @param {{
 *  hasNext: boolean
 * }} data
 */
export default class Index extends Taro.PureComponent {
  render() {
    const { hasNext } = this.props

    if (hasNext) {
      return (
        <View className='text'>
          <View className='data-loading'>
            <AtIcon value='loading-3' />
          </View>
          数据正快马加鞭赶来
        </View>
      )
    }
    return <View className='text'>没有更多了~</View>
  }
}
