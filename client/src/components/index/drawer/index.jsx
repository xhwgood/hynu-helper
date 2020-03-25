import Taro, { PureComponent } from '@tarojs/taro'
import { AtDrawer, AtList, AtListItem, AtRadio, AtAccordion } from 'taro-ui'
import ajax from '@utils/ajax'
import {
  set as setGlobalData,
  get as getGlobalData
} from '@utils/global_data.js'
import './index.scss'

export default class Index extends PureComponent {
  state = {
    open: true,
    termList: [],
    value: ''
  }

  static defaultProps = {
    show: false,
    setting: {
      hideLeft: true,
      showStandard: false,
      hideNoThisWeek: false
    },
    handleSetting: () => {},
    closeDrawer: () => {},
    dealClassCalendar: () => {},
    logged: false
  }

  getTermList = () => {
    const myterm = Taro.getStorageSync('myterm')
    const termList = []
    let value
    if (myterm) {
      const keys = Object.keys(myterm)
      const values = Object.values(myterm)
      for (let i = keys.length - 1; i > 0; i--) {
        termList.push({
          value: keys[i],
          label: values[i]
        })
      }
      value = keys[keys.length - 1]
    }
    this.setState({ termList, value })
  }

  selectTerm = v => {
    this.setState({ value: v })
    const sessionid = Taro.getStorageSync('sid')
    const xsid = Taro.getStorageSync('xsid')
    const data = {
      func: 'changeClass',
      data: {
        sessionid,
        xsid,
        xnxqh: v
      }
    }
    ajax('base', data).then(res => {
      Taro.removeStorageSync('allWeek')
      const { myClass } = res
      Taro.setStorageSync('myClass', myClass)
      this.props.dealClassCalendar(myClass)
      setTimeout(() => {
        this.props.closeDrawer()
      })
    })
  }

  openTerm = () => {
    this.setState(preState => ({ open: !preState.open }))
  }

  componentDidShow() {
    if (getGlobalData('logged')) {
      this.getTermList()
    }
  }

  render() {
    const { show, handleSetting, setting, closeDrawer } = this.props
    const { termList, value, open } = this.state

    return (
      <AtDrawer mask show={show} width='520rpx' onClose={closeDrawer}>
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
          <AtAccordion open={open} onClick={this.openTerm} title='修改当前学期'>
            {termList.length ? (
              <AtRadio
                options={termList}
                value={value}
                onClick={this.selectTerm}
              />
            ) : (
              <AtListItem className='list' disabled title='尚未绑定教务处' />
            )}
          </AtAccordion>
        </AtList>
      </AtDrawer>
    )
  }
}
