import Taro, { Component } from '@tarojs/taro'
import { View, Text, Block } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import ajax from '@utils/ajax'
import { get as getGlobalData } from '@utils/global_data.js'
import Col from '@components/taro-comp/col'
import Row from '@components/taro-comp/row'
import moment from '@utils/moment.min.js'
import strToDate from '@utils/strToDate.js'
import './index.scss'

export default class Index extends Component {
  static defaultProps = {
    list: []
  }

  renew = id => {
    const libSid = getGlobalData('libSid')
    const data = {
      func: 'renew',
      data: {
        barcodeList: id,
        Cookie: libSid
      }
    }
    // 有bug
    ajax('library', data).then(res => {
      console.log(res)
    })
  }

  render() {
    const { list } = this.props

    return (
      <Block>
        {list.map((item, idx) => (
          <View className='at-col his-book' key={item.time + idx}>
            {item.operate ? (
              <Row>
                <Text className='at-col'>操作：{item.operate}</Text>
                <Text className='at-col'>时间：{item.time}</Text>
              </Row>
            ) : (
              <Block>
                <Row>
                  <Col>
                    <Row>借出时间：{item.lendTime}</Row>
                    <View
                      className='at-row'
                      style={{
                        color: moment().isSameOrAfter(item.returnTime) && 'red'
                      }}
                    >
                      应还时间：{strToDate(item.returnTime)}
                      {moment().isSameOrAfter(item.returnTime) && '【已超期】'}
                    </View>
                  </Col>
                  {/* <AtButton
                    type='primary'
                    onClick={this.renew.bind(this, item.barcodeList)}
                    customStyle={{
                      marginRight: '20px'
                    }}
                  >
                    续借
                  </AtButton> */}
                </Row>
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
