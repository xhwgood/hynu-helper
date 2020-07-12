import Taro from '@tarojs/taro'

let major_color = '#000'
let secondary_color3 = '#333'
let secondary_color4 = '#444'
let secondary_color6 = '#666'
let secondary_color8 = '#888'
let secondary_color80 = '#808080'
let secondary_color9 = '#999'
let secondary_colorA = '#aaa'
let secondary_colorE = '#eee'
let primary_color = '#fff'
// 背景色
let bgColor = '#f1f1f1'
let bgColor7 = '#f7f7f7'
let bgColorE = '#eee'
let bgColorFE = '#fefefe'
let bgColorF5 = '#f5f5f5'
let classBG = '#f4f9f8'
let activeBG = '#dce9ed'

// 考试安排
let arrange = '#769fcd'
// 校园卡
let card = '#a80000'
// 毕业设计
let design = '#a5e9db'
// 选修课
let electives = '#f2a379'
// 图书馆
let library = '#a3c6c4'
// 成绩
let score = '#4e4e6a'
// 找人
let stu = '#f9b8be'
// 宿舍报修
let repair = '#519a73'

Taro.getSystemInfo({
  success: res => {
    if (res.theme == 'dark') {
      major_color = '#fff'
      secondary_color3 = '#ccc'
      secondary_color4 = '#bbb'
      secondary_color6 = '#999'
      secondary_color8 = '#777'
      secondary_color80 = '#7f7f7f'
      secondary_color9 = '#666'
      secondary_colorA = '#555'
      secondary_colorE = '#111'
      primary_color = '#000'
      bgColor = '#0e0e0e'
      bgColor7 = '#080808'
      bgColorE = '#111'
      bgColorFE = '#010101'
      bgColorF5 = '#0a0a0a'
      classBG = '#0b0607'
      activeBG = '#231612'
    }
  }
})

export {
  major_color,
  secondary_color3,
  secondary_color4,
  secondary_color6,
  secondary_color8,
  secondary_color80,
  secondary_color9,
  secondary_colorA,
  secondary_colorE,
  primary_color,
  arrange,
  card,
  design,
  electives,
  library,
  score,
  stu,
  repair,
  bgColor,
  bgColor7,
  bgColorE,
  bgColorFE,
  bgColorF5,
  classBG,
  activeBG
}
