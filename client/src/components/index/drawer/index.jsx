import Taro, { Component } from '@tarojs/taro'
import { AtDrawer, AtList, AtListItem, AtRadio, AtAccordion } from 'taro-ui'
import './index.scss'

export default class Index extends Component {
  static defaultProps = {
    show: false,
    setting: {
      hideLeft: Taro.getStorageSync('hideLeft') || true,
      showStandard: Taro.getStorageSync('showStandard') || false,
      hideNoThisWeek: Taro.getStorageSync('hideNoThisWeek') || false
    },
    termList: [],
    handleSetting: () => {}
  }

  constructor(props) {
    super(props)
    // 若没有绑定课程表，修改学期的列表默认展开，否则折叠
    let open = false
    if (!props.termList.length) {
      open = true
    }
    this.state = {
      open
    }
  }

  changeTerm = () => {
    this.setState(state => ({ open: !state.open }))
  }

  render() {
    const { show, handleSetting, setting, termList } = this.props
    return (
      <AtDrawer mask show={show} width='520rpx'>
        <AtList>
          <AtListItem
            title='显示左侧节次信息'
            isSwitch
            switchIsCheck={setting.hideLeft}
            onSwitchChange={handleSetting.bind(this, 'hideLeft')}
            hasBorder={true}
          />
          <AtListItem
            title='隐藏非本周课程'
            isSwitch
            switchIsCheck={setting.hideNoThisWeek}
            data-name='showStandard'
            onSwitchChange={handleSetting.bind(this, 'hideNoThisWeek')}
          />
          <AtAccordion
            open={this.state.open}
            onClick={this.changeTerm}
            title='修改当前学期'
          >
            <AtList hasBorder={true}>
              {termList.length ? (
                termList.map(item => (
                  <AtListItem
                    className='list'
                    key={String(item)}
                    title={item}
                  />
                ))
              ) : (
                <AtListItem className='list' title='尚未绑定教务处' />
              )}
            </AtList>
          </AtAccordion>
        </AtList>
      </AtDrawer>
    )
  }
}
