import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'

export default class Index extends PureComponent {
  static defaultProps = {
    list: []
  }

  set = item => {
    Taro.navigateTo({
      url: `./set?name=${item}`
    })
  }

  render() {
    const { list } = this.props
    return (
      <View className="tabs">
        <AtList>
          {list &&
            list.map(item => (
              <AtListItem
                onClick={this.set.bind(this, item)}
                title={item}
                key={item}
                arrow="right"
              />
            ))}
        </AtList>
      </View>
    )
  }
}
