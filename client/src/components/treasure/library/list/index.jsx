import Taro, { Component, getStorageSync } from '@tarojs/taro'
import { View, Text, Block } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import ajax from '@utils/ajax'
import {
  get as getGlobalData,
  set as setGlobalData
} from '@utils/global_data.js'
import moment from '@utils/moment.min.js'
import strToDate from '@utils/strToDate.js'
import { nocancel } from '@utils/taroutils'
import {
  secondary_color4,
  secondary_color6,
  secondary_color9
} from '@styles/color.js'
import './index.scss'

export default class Index extends Component {
  static defaultProps = {
    list: []
  }

  state = {
    disabled: false
  }
  /**
   * 续借图书
   * @param {Object} obj 要续借的图书数据
   */
  renew = ({ barcodeList, book }) => {
    this.setState({ disabled: true })
    const mobileLibSid = getGlobalData('mobileLibSid')
    const data = {
      func: 'renew',
      data: {
        barcodeList,
        Cookie: mobileLibSid
      }
    }
    // 如果没有移动端图书馆sid，则需要发起登录移动端云函数
    // 并带上学号和图书馆密码
    if (!mobileLibSid) {
      const rdid = getStorageSync('libUsername')
      const password = getStorageSync('libPass')
      data.func = 'mobilelogin'
      data.data.rdid = rdid
      data.data.password = password
    }
    ajax('library', data)
      .then(res => {
        const { txt } = res
        // 将移动端sid保存至运行时globalData
        if (!mobileLibSid) {
          setGlobalData('mobileLibSid', res.mobileLibSid)
        }
        if (txt.includes('成功')) {
          nocancel('续借成功！已为你更新还书日期')
          const idx = txt.indeOf('日期')
          const date = txt.slice(idx + 4)
          this.props.updateReturnTime(barcodeList, date)
        } else {
          nocancel(
            `对不起，该书已达最大续借次数：2次，请先归还后再借阅！`
          )
        }
      })
      .finally(() => this.setState({ disabled: false }))
  }

  render() {
    const { list } = this.props

    return (
      <Block>
        {list.map((item, idx) => (
          <View
            className='at-col his-book'
            style={{ color: secondary_color6 }}
            key={item.time + idx}
          >
            <View className='break' style={{ color: secondary_color4 }}>
              《{item.book}》
            </View>
            {item.operate ? (
              <View className='at-row'>
                <Text className='at-col'>操作：{item.operate}</Text>
                <Text className='at-col'>时间：{item.time}</Text>
              </View>
            ) : (
              <View className='at-row operate-row'>
                <View className='at-col'>
                  <View className='at-row'>借出时间：{item.lendTime}</View>
                  <View
                    className='at-row'
                    style={{
                      color: moment().isSameOrAfter(item.returnTime) && 'red'
                    }}
                  >
                    应还时间：{strToDate(item.returnTime)}
                    {moment().isSameOrAfter(item.returnTime)
                      ? '【已超期】'
                      : ''}
                  </View>
                </View>
                <AtButton
                  type='primary'
                  onClick={this.renew.bind(this, item)}
                  size='small'
                  customStyle={{
                    marginRight: '3px'
                  }}
                >
                  续借
                </AtButton>
              </View>
            )}
            <View>作者：{item.author}</View>
            <View style={{ color: secondary_color9, fontSize: '28rpx' }}>
              地点：{item.place}
            </View>
          </View>
        ))}
      </Block>
    )
  }
}
