import Taro, { Component } from '@tarojs/taro'
import { AtDrawer, AtList, AtListItem, AtRadio, AtAccordion } from 'taro-ui'

export default class Index extends Component {
  state = {
    sort_arr: [
      {
        label: '按学期降序',
        value: 'a.xqmc+desc'
      },
      {
        label: '按学期升序',
        value: 'a.xqmc+asc'
      },
      {
        label: '按成绩降序',
        value: 'a.zcj+desc'
      },
      {
        label: '按成绩升序',
        value: 'a.zcj+asc'
      }
    ],
    open: true,
    value: 'a.xqmc+desc'
  }

  openSort = () =>
    this.setState(preState => ({
      open: !preState.open
    }))

  change = value => {
    const newV = true
    this.setState({ value }, () => {
      this.props.getScore(newV, value)
      this.props.closeDrawer()
    })
  }

  render() {
    const { opened, closeDrawer, all_credit } = this.props
    const { sort_arr, open, value } = this.state

    return (
      <AtDrawer right mask show={opened} onClose={closeDrawer}>
        <AtList>
          <AtListItem title='已修学分' extraText={all_credit + '学分'} />
          <AtAccordion open={open} onClick={this.openSort} title='成绩排序'>
            <AtRadio options={sort_arr} value={value} onClick={this.change} />
          </AtAccordion>
        </AtList>
      </AtDrawer>
    )
  }
}
