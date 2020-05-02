import Taro, { PureComponent } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import './index.scss'

export default class Index extends PureComponent {
  static defaultProps = {
    list: []
  }
  // 跳转到设置页
  set = item =>
    Taro.navigateTo({
      url: `./set?name=${item}`
    })

  render() {
    const { list } = this.props

    return (
      <View className='tabs'>
        <AtList>
          {list.length ? (
            list.map(item => (
              <AtListItem
                onClick={this.set.bind(this, item)}
                title={item}
                key={item}
                arrow='right'
              />
            ))
          ) : (
            <View className='none'>本学期没有课程</View>
          )}
        </AtList>
      </View>
    )
  }
}
