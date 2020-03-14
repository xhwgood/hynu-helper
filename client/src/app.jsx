import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'

import './app.scss'
import '@assets/css/iconfont.css' // 引入阿里图标库

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {
  config = {
    pages: [
      'pages/index/index',
      'pages/login/login',
      'pages/login/login_card',
      'pages/my/my',
      'pages/my/about/about',
      'pages/treasure/treasure',
      'pages/treasure/design/design',
      'pages/treasure/landf/landf',
      'pages/treasure/arrange/arrange',
      'pages/treasure/arrange/add',
      'pages/treasure/arrange/set',
      'pages/treasure/class/class',
      'pages/treasure/evaluate/evaluate',
      'pages/treasure/library/library',
      'pages/treasure/score/score',
      'pages/treasure/stu/stu',
      'pages/treasure/electives/electives',
      'pages/treasure/cet/cet',
      'pages/treasure/cet/score',
      'pages/treasure/card/card'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: '#7b7b7a',
      selectedColor: '#000',
      backgroundColor: '#fff',
      list: [
        {
          pagePath: 'pages/index/index',
          text: '课程表',
          iconPath: 'assets/tab/calendar.png',
          selectedIconPath: 'assets/tab/calendar@selected.png'
        },
        {
          pagePath: 'pages/treasure/treasure',
          text: '百宝箱',
          iconPath: 'assets/tab/treasure.png',
          selectedIconPath: 'assets/tab/treasure@selected.png'
        },
        {
          pagePath: 'pages/my/my',
          text: '我的',
          iconPath: 'assets/tab/my.png',
          selectedIconPath: 'assets/tab/my@selected.png'
        }
      ]
    },
    cloud: true
  }

  componentDidMount() {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Index />
  }
}

Taro.render(<App />, document.getElementById('app'))
