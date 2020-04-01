const logList = [
  {
    date: '2020年4月1日',
    version: 'V1.4.0',
    content: `全面对接南岳学院教务处；因微信限制，关闭CET查询功能；修复已登录状态下获取课程失败的bug；修复图书馆登录错误时的bug；部分细节优化。`
  },
  {
    date: '2020年3月30日',
    version: 'V1.3.2',
    content: `课程表页溢出文字隐藏；百宝箱页减少预请求次数。`
  },
  {
    date: '2020年3月30日',
    version: 'V1.3.1',
    content: `修复部分同学获取课程失败的bug；修复课表页设置没有保存的bug/切换学期的bug/课程颜色增加/溢出文字隐藏；修复切换tab页或隐藏小程序时模态框没有关闭的bug；选修课页按钮优化。`
  },
  {
    date: '2020年3月29日',
    version: 'V1.3.0',
    content: `百宝箱页面改版；云函数超时时间改为20秒（20秒已为上限，请尽量在网络流畅时使用）；教务处登录页验证码不再自动清空；成绩查询页优化，bug修复。`
  },
  {
    date: '2020年3月28日',
    version: 'V1.2.0',
    content: `部分页面优化；云函数超时时间改为10秒；选修课列表百分比保留整数；分享bug修复，非隐私页面均可转发；百宝箱页功能顺序调整；选修课页选课成功后改为弹窗提示；校园卡登录提示更加友好。`
  },
  {
    date: '2020年3月27日',
    version: 'V1.1.2',
    content: `教务处的报错提示更加友好；”我的“页面细节优化。`
  },
  {
    date: '2020年3月27日',
    version: 'V1.1.0',
    content: '修复查看课程详情时图标没显示的bug；调整百宝箱页面功能顺序；选修课排序改为已选人数从多到少。'
  }
]

export default logList
