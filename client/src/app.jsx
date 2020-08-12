import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'
import { set as setGlobalData } from '@utils/global_data.js'

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
      'pages/treasure/treasure',
      'pages/index/index',
      'pages/index/addClass/addClass',
      'pages/login/login',
      'pages/my/my',
      'pages/my/about/about',
      'pages/treasure/design/design',
      'pages/treasure/arrange/arrange',
      'pages/treasure/arrange/add',
      'pages/treasure/arrange/set',
      'pages/treasure/repair/repair',
      'pages/treasure/evaluate/evaluate',
      'pages/treasure/library/library',
      'pages/treasure/library/history',
      'pages/treasure/library/login',
      'pages/treasure/score/score',
      'pages/treasure/score/grade',
      'pages/treasure/stu/stu',
      'pages/treasure/electives/electives',
      'pages/treasure/electives/select',
      'pages/treasure/card/bill',
      'pages/treasure/card/login',
      'pages/treasure/card/monthBill'
    ],
    window: {
      navigationBarBackgroundColor: '@navBgColor',
      backgroundColor: '@bgColor',
      navigationBarTextStyle: '@navTxtStyle'
    },
    tabBar: {
      color: '#7b7b7a',
      selectedColor: '@tabSelectedColor',
      backgroundColor: '@tabBgColor',
      list: [
        {
          pagePath: 'pages/index/index',
          text: '课程表',
          iconPath: 'assets/tab/calendar.png',
          selectedIconPath: 'assets/tab/calendar@selected.png'
        },
        {
          pagePath: 'pages/treasure/treasure',
          text: '衡师百宝箱',
          iconPath: 'assets/tab/hynu.png',
          selectedIconPath: 'assets/tab/hynu@selected.png'
        },
        {
          pagePath: 'pages/my/my',
          text: '我的',
          iconPath: 'assets/tab/my.png',
          selectedIconPath: 'assets/tab/my@selected.png'
        }
      ]
    },
    cloud: true,
    darkmode: true,
    themeLocation: 'theme.json'
  }

  componentDidMount() {
    // Taro.getSystemInfo({
    //   success: res => {
    //     if (res.theme == 'dark') {

    //     }
    //   }
    // })

    switch (process.env.TARO_ENV) {
      case 'weapp':
        Taro.cloud.init()
        break
      case 'qq':
        // QQ小程序云开发必须传入环境ID
        Taro.cloud.init({
          env: 'xhw-831852'
        })
        break

      default:
        break
    }
    const updateManager = Taro.getUpdateManager()
    // 检测版本更新
    updateManager.onCheckForUpdate(res => {
      if (res.hasUpdate) {
        // 将“我的”页的切换图片toast再次提示
        // Taro.setStorageSync('noastImg-new', false)

        updateManager.onUpdateReady(() => {
          Taro.showModal({
            title: '更新提示',
            content: '已经有新版本，是否要重启以更新？',
            success(res) {
              if (res.confirm) {
                updateManager.applyUpdate()
              }
            }
          })
        })
      }
    })
    const year = new Date().getFullYear() + '年'
    setGlobalData('year', year)
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
