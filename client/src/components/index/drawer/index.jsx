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
    }
  }

  state = {
    open: false
  }

  changeTerm = () => {
    this.setState(state => ({ open: !state.open }))
  }

  render() {
    const { show, handleSetting, setting } = this.props
    return (
      <AtDrawer mask show={show} width="520rpx">
        <AtList>
          <AtListItem
            title="显示左侧节次信息"
            isSwitch
            switchIsCheck={setting.hideLeft}
            onSwitchChange={handleSetting.bind(this, 'hideLeft')}
            hasBorder={true}
          />
          <AtListItem
            title="隐藏非本周课程"
            isSwitch
            switchIsCheck={setting.hideNoThisWeek}
            data-name="showStandard"
            onSwitchChange={handleSetting.bind(this, 'hideNoThisWeek')}
          />
          <AtAccordion
            open={this.state.open}
            onClick={this.changeTerm}
            title="修改当前学期"
          >
            <AtList hasBorder={true}>
              <AtListItem className="list" title="大一上" />
              <AtListItem className="list" title="大一下" />
              <AtListItem className="list" title="大二上" />
              <AtListItem className="list" title="大二下" />
              <AtListItem className="list" title="大三上" />
              <AtListItem className="list" title="大三下" />
              <AtListItem className="list" title="大四上" />
              <AtListItem className="list" title="大四下" />
            </AtList>
          </AtAccordion>
        </AtList>
      </AtDrawer>
    )
  }
}
