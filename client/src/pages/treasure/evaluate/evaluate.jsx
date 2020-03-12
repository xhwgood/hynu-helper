import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import './evaluate.scss'

export default class Evaluate extends Component {
  state = {
    selector: ['美国', '中国', '巴西', '日本'],
    selectorChecked: '请选择'
  }

  onChange = e => {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value]
    })
  }

  render() {
    const { selector, selectorChecked } = this.state
    return (
      <View className="body">
        <View className="page-section">
          <View>
            <Picker mode="selector" range={selector} onChange={this.onChange}>
              <View className="picker">学年学期：{selectorChecked}</View>
            </Picker>
          </View>
        </View>
        <View className="page-section">
          <View>
            <Picker mode="selector" range={selector} onChange={this.onChange}>
              <View className="picker">评价批次名称：{selectorChecked}</View>
            </Picker>
          </View>
        </View>
        <View className="page-section">
          <View>
            <Picker mode="selector" range={selector} onChange={this.onChange}>
              <View className="picker">评价分类名称： {selectorChecked}</View>
            </Picker>
          </View>
        </View>
        <View className="page-section">
          <View>
            <Picker mode="selector" range={selector} onChange={this.onChange}>
              <View className="picker">评价课程类别： {selectorChecked}</View>
            </Picker>
          </View>
        </View>
        <View style={{ display: 'flex' }}>
          <AtButton size="normal" type="primary">
            查询
          </AtButton>
          <AtButton size="normal" type="secondary">
            重置
          </AtButton>
        </View>
      </View>
    )
  }
}
