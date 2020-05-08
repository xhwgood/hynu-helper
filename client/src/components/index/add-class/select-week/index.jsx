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
    addToWeekBtn: () => {}
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
        <AtModalContent className='content'>
          <View className='at-row at-row--wrap'>
            {week.map(item => (
              <View
                className='change-item'
                style={{
                  background: selectedWeek.includes(item) ? '#278def' : ``,
                  color: selectedWeek.includes(item) ? '#fff' : `#282828`
                }}
                onClick={addToWeek.bind(this, item)}
                key={item}
              >
                {item}
              </View>
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
                key={i}
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
