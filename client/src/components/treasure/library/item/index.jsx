import Taro, { Component } from '@tarojs/taro'
import { View, Text, Block } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import ajax from '@utils/ajax'
import { get as getGlobalData } from '@utils/global_data.js'
import './index.scss'

export default class Index extends Component {
  static defaultProps = {
    list: []
  }

  renew = item => {
    const libSid = getGlobalData('libSid')
    const data = {
      func: 'renew',
      data: {
        barcodeList: item.barcodeList,
        Cookie: libSid
      }
    }
    console.log('data: ', data)

    ajax('library', data).then(res => {
      console.log(res)

      // const { code, obj } = res
      // // 登录成功
      // if (code == 200) {
      //   this.setState({ obj })
      //   setGlobalData('libObj', obj)
      // }
    })
  }

  render() {
    const { list } = this.props

    return (
      <Block>
        {list.map((item, idx) => (
          <View className='at-col his-book' key={item.time + idx}>
            {item.operate ? (
              <View className='at-row'>
                <Text className='at-col'>操作：{item.operate}</Text>
                <Text className='at-col'>时间：{item.time}</Text>
              </View>
            ) : (
              <Block>
                <View className='at-row'>
                  <View className='at-col'>
                    <View className='at-row'>借出时间：{item.lendTime}</View>
                    <View className='at-row'>应还时间：{item.returnTime}</View>
                  </View>
                  <AtButton
                    type='primary'
                    circle
                    onClick={this.renew.bind(this, item)}
                    customStyle={{
                      marginRight: '20px'
                    }}
                  >
                    续借
                  </AtButton>
                </View>
              </Block>
            )}
            <View className='break'>书名：《{item.book}》</View>
            <View>作者：{item.author}</View>
            <View>地点：{item.place}</View>
          </View>
        ))}
      </Block>
    )
  }
}
