import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import ajax from '@utils/ajax'
import Item from '@components/treasure/electives'
import { get as getGlobalData } from '@utils/global_data.js'
import ShareModal from '@components/share-modal'
import NoData from '@components/no-data'
import './select.scss'

export default class Select extends Component {
  config = {
    navigationBarBackgroundColor: '#f2a379',
    navigationBarTitleText: '选修课程列表',
    navigationBarTextStyle: 'white'
  }

  state = {
    xxk_arr: [],
    selectedArr: [],
    disabled: false,
    /** 分享模态框是否显示 */
    shareIsOpen: false,
    /** 分享模态框文案 */
    txt: ''
  }
  /** 重新获取选修课数据 */
  data = undefined
  /**
   * 可选选修课和已选选修课列表
   * @param {boolean} notoast 是否不显示提示
   */
  selectList = notoast => {
    const preData = Taro.getCurrentPages()[1].$component.getData()
    let queryDetail
    if (getGlobalData('query')) {
      queryDetail = getGlobalData('query')
        .replace('toXk', 'toFindxskxkclb')
        .replace('xnxq', 'xnxq01id')
    }

    const data = {
      func: 'easyQuery',
      data: {
        sessionid: getGlobalData('sid'),
        queryDetail,
        spider: 'selectElective'
      }
    }
    this.data = data
    ajax('base', data, notoast).then(({ xxk_arr }) => {
      ajax('base', preData).then(res_selected => {
        const { selected: selectedArr } = res_selected
        this.setState({ xxk_arr, selectedArr })
      })
    })
  }
  /** 刷新列表 */
  refresh = () => {
    const notoast = true
    this.setState({
      disabled: true
    })
    ajax('base', this.data, notoast)
      .then(({ xxk_arr }) => {
        Taro.showToast({
          title: '刷新成功'
        })
        this.setState({ xxk_arr })
      })
      .finally(() => this.setState({ disabled: false }))
  }
  /**
   * 显示选修课详情
   * @param {object} item 要显示的选修课数据
   * @param {number} i 该选修课在数组中的索引
   */
  showBottom = (item, i) => {
    const { xxk_arr } = this.state
    xxk_arr[i].bottomShow = !item.bottomShow
    this.setState({ xxk_arr })
  }
  /**
   * 打开分享模态框
   * @param {string} txt
   * @param {boolean} shareIsOpen
   */
  openShareModal = (txt, shareIsOpen) => this.setState({ txt, shareIsOpen })

  componentWillMount() {
    this.selectList()
  }

  onShareAppMessage({ from }) {
    return {
      title:
        from == 'button'
          ? '我在《我的衡师》抢课成功啦，你也快来试试吧~'
          : SLOGAN,
      path: PATH,
      imageUrl: SHARE
    }
  }

  render() {
    const { xxk_arr, selectedArr, disabled, shareIsOpen, txt } = this.state

    return (
      <View className='select'>
        <View className='list'>已选中的选修课</View>
        {selectedArr.length ? (
          <Item list={selectedArr} selectList={this.selectList} />
        ) : (
          <View style={{ marginLeft: '15px' }}>暂无</View>
        )}
        <View className='list'>
          <View className='at-row'>
            <Text>选修课列表</Text>
            <Button
              onClick={this.refresh}
              size='mini'
              loading={disabled}
              disabled={disabled}
            >
              刷新列表
            </Button>
          </View>
          <View className='tip fz28 c6'>
            注意：已选中的选修课不会出现在下方
          </View>
          <View className='tip fz28 c6'>此列表按已选中人数从多到少排列</View>
        </View>
        {xxk_arr.length ? (
          <Item
            list={xxk_arr}
            selected={selectedArr.length ? true : false}
            showBottom={this.showBottom}
            selectList={this.selectList}
            openShareModal={this.openShareModal}
          />
        ) : (
          <NoData txt='没有可选选修课' />
        )}
        <ShareModal
          shareIsOpen={shareIsOpen}
          txt={txt}
          close={() => this.setState({ shareIsOpen: false })}
        />
      </View>
    )
  }
}
