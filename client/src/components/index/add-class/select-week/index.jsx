// @ts-check
import Taro, { PureComponent } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import {
  AtModal,
  AtModalContent,
  AtModalHeader,
  AtModalAction,
  AtButton
} from 'taro-ui'
import { week } from '@utils/data'
import './index.scss'

export default class Index extends PureComponent {
  state = {
    btnArr: ['单周', '双周', '全选']
  }
  static defaultProps = {
    selectedWeek: [],
    /** 点击三个多选按钮 */
    addToWeekBtn: () => {},
    /** 直接点击周 */
    addToWeek: () => {}
  }

  render() {
    const {
      selectWeekIsOpen,
      selectedWeek,
      addToWeek,
      addToWeekBtn,
      weekBtn,
      closeSelectWeek
    } = this.props
    const { btnArr } = this.state

    return (
      <AtModal isOpened={selectWeekIsOpen} closeOnClickOverlay={false}>
        <AtModalHeader>选择上课周数</AtModalHeader>
        <AtModalContent>
          <View className='at-row at-row--wrap at-row__justify--around'>
            {week.map(item => (
              <AtButton
                type={selectedWeek.includes(item) ? 'primary' : 'secondary'}
                size='small'
                customStyle={{ margin: '2rpx 8rpx' }}
                onClick={addToWeek.bind(this, item)}
                key={item}
              >
                {item}
              </AtButton>
            ))}
          </View>
          {/* 单周、双周、全选三个按钮 */}
          <View
            style='margin-top: 10px'
            className='at-row at-row__justify--around'
          >
            {btnArr.map((item, i) => (
              <AtButton
                type={weekBtn == i ? 'primary' : 'secondary'}
                size='small'
                onClick={addToWeekBtn.bind(this, i)}
                key={item}
              >
                {item}
              </AtButton>
            ))}
          </View>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={closeSelectWeek}>确定</Button>
        </AtModalAction>
      </AtModal>
    )
  }
}
