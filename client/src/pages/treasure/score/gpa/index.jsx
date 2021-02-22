import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '@utils/global_data'
import { AtDivider } from 'taro-ui'
import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarBackgroundColor: '#4e4e6a',
    navigationBarTitleText: '考级成绩',
    navigationBarTextStyle: 'white'
  }

  state = {
    /** 已修学分数组 */
    creditArr: getGlobalData('creditArr'),
    all_credit: getGlobalData('all_credit'),
    standardGPA: getGlobalData('standardGPA')
  }

  calculate = () => {
    /** 所有科目成绩 */
    const all_score = getGlobalData('all_score')
    let { creditArr } = this.state
    /** 如果全局数据中没有 */
    if (!creditArr) {
      /** 标准GPA算法 */
      let standardGPA = 0
      // const standardGPAObj = {}
      const txtScoreList = ['优', '良', '中', '格']
      let all_credit = 0
      const creditNumArr = []
      creditArr = {}
      /** 遍历获取每个学期的总学分 */
      Object.values(all_score).forEach(items =>
        Object.values(items).forEach(item => {
          /** 本学期学分 */
          let creditNum = 0
          item.forEach(({ score, credit }) => {
            credit = Number(credit)
            numScore = Number(score)
            /** 挂科的成绩不算，优/良/中的成绩不算 */
            if (numScore >= 60) {
              creditNum += credit
              all_credit += credit
              // 标准GPA算法
              switch (numScore) {
                case numScore >= 90:
                  standardGPA += 4 * credit
                  break
                case numScore >= 80:
                  standardGPA += 3 * credit
                  break
                case numScore >= 70:
                  standardGPA += 2 * credit
                  break
                case numScore >= 60:
                  standardGPA += 1 * credit
                  break

                default:
                  break
              }
              standardGPA = standardGPA / all_credit
            }
          })
          creditNumArr.push(creditNum)
        })
      )
      // 映射为：{ 大一上：25.5 }
      Object.values(this.myterm).forEach((term, idx) => {
        creditArr[term] = creditNumArr[idx]
      })
      setGlobalData('creditArr', creditArr)
      setGlobalData('all_credit', all_credit)
      setGlobalData('standardGPA', standardGPA)
      this.setState({
        creditArr,
        all_credit,
        standardGPA
      })
    }
  }

  componentWillMount() {
    this.calculate()
  }

  onShareAppMessage() {
    return {
      title: '我查到了我的学分和绩点，你也来试试吧',
      path: PATH
    }
  }

  render() {
    const { standardGPA, creditArr, all_credit } = this.state

    return (
      <View>
        <AtDivider content='学分' />
        {creditArr &&
          Object.keys(creditArr).map(item => (
            <View key={item}>
              {item}：{creditArr[item] || 0}学分
            </View>
          ))}
        <View>累计：{all_credit}学分</View>
        <AtDivider content='GPA' />
        <View>标准4.0算法：{standardGPA}</View>
        {/* <View>北大4.0算法：{standardGPA}</View> */}
      </View>
    )
  }
}
