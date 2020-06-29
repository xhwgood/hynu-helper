import Taro, { PureComponent } from '@tarojs/taro'
import Col from '@components/taro-comp/col'
import Row from '@components/taro-comp/row'
import { View } from '@tarojs/components'
import './index.scss'

export default class Index extends PureComponent {
  static defaultProps = {
    detail: {}
  }

  render() {
    const {
      endper,
      endterm,
      midper,
      midterm,
      peaceper,
      peacetime,
      credit,
      hour
    } = this.props.detail

    return (
      <View className='bottom'>
        <Row>
          <Col>学时：{hour}</Col>
          <Col>学分：{credit}</Col>
        </Row>
        <Row>
          {endterm && <Col>期末成绩：{endterm}</Col>}
          {endper && <Col>期末成绩比例：{endper}</Col>}
        </Row>
        <Row>
          {peacetime && <Col>平时成绩：{peacetime}</Col>}
          {peaceper && <Col>平时成绩比例：{peaceper}</Col>}
        </Row>
        <Row>
          {midterm && <Col>期中成绩：{midterm}</Col>}
          {midper && <Col>期中成绩比例：{midper}</Col>}
        </Row>
      </View>
    )
  }
}
