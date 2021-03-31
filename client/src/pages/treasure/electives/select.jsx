import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Picker } from '@tarojs/components'
import ajax from '@utils/ajax'
import Item from '@components/treasure/electives'
import { get as getGlobalData } from '@utils/global_data'
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
    txt: '',
    /** 当前排序索引 */
    orderIdx: 0
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
   * 更改排序
   * @param {object} e
   */
  handleChange = e => {
    console.log(e.detail.value)
    this.setState(pre => {
      const newArr = pre.xxk_arr.sort((a, b) => {
        return b.selected - a.selected
      })
      return {
        xxk_arr: newArr
      }
    })
  }
  /**
   * 删除可选列表中选中的选修课
   * @param {number} idx 要删除的索引
   * @param {object} item 选中的课程数据
   */
  deleteSelected = (idx, item) => {
    const { xxk_arr } = this.state
    xxk_arr.splice(idx, 1)
    const { classID, name, from, teacher, week, time } = item
    this.setState({
      xxk_arr,
      selectedArr: [
        { classID, name, from, teacher, week, time, mySelected: true }
      ]
    })
  }

  /**
   * 打开分享模态框
   * @param {string} txt
   */
  openShareModal = txt => this.setState({ txt, shareIsOpen: true })

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
    const {
      xxk_arr,
      selectedArr,
      disabled,
      shareIsOpen,
      txt,
      orderIdx
    } = this.state
    const orderArr = [
      '已选中人数降序',
      '已选中人数升序',
      '总人数降序',
      '总人数升序'
    ]

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
          {/* <Picker onChange={this.handleChange} range={orderArr}>
            更改排序-{orderArr[orderIdx]}
          </Picker> */}
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
            deleteSelected={this.deleteSelected}
            selectList={this.selectList}
            openShareModal={this.openShareModal}
          />
        ) : (
          <NoData txt='没有可选选修课' />
        )}
        <ShareModal
          isOpened={shareIsOpen}
          content={txt}
          close={() => this.setState({ shareIsOpen: false })}
        />
      </View>
    )
  }
}
