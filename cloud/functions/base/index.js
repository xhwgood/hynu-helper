// @ts-check
// 云函数入口文件
const newLogin = require('./new/login')
const xsxx = require('./new/xsxx')
const newGetScore = require('./new/getScore')
const { getClass } = require('./fn/getClass')
const { getDesign } = require('./fn/getDesign')
const { reset } = require('./fn/reset')
const { selectStu } = require('./fn/selectStu')
const { allSelected } = require('./fn/allSelected')
const { easyQuery } = require('./fn/easyQuery')
const { onlySid } = require('./fn/onlySid')
const { getGrade } = require('./fn/getGrade')
const { getOnlines } = require('./fn/getOnlines')
const { changePass } = require('./fn/changePass')

/**
 * @param {{
 *  func: string
 *  data: any
 * }} e
 */
exports.main = async ({ func, data }, context) => {
  const openedFunc = ['login', 'getScore', 'xsxx']
  if (!openedFunc.includes(func)) {
    return {
      data: {
        code: 700,
        msg: '抱歉，暂未适配该功能'
      }
    }
  }
  /** 教务处主机地址 */
  let host = '59.51.24.46'
  let newHost = 'hysfjw.hynu.cn'

  let url = `http://${host}/hysf`
  const newUrl = `http://${newHost}/jsxsd`
  const { username, account } = data

  // 南岳学院教务处网站
  if (
    (username && username.includes('N')) ||
    (account && account.includes('N'))
  ) {
    host = '59.51.24.41'
    url = `http://${host}`
  }
  let res

  switch (func) {
    // 登录
    case 'login':
      res = await newLogin(data, newUrl)
      break
    // 获取/修改当前课程表
    case 'changeClass':
      res = await getClass(data, url)
      break
    // 验证 sessionid 是否过期
    case 'xsxx':
      res = await xsxx(data, newUrl)
      break
    // 获取毕业设计
    case 'getDesign':
      res = await getDesign(data, url)
      break
    // 重置密码
    case 'reset':
      res = await reset(data, url)
      break
    // 查找学生
    case 'selectStu':
      res = await selectStu(data, url)
      break
    // 成绩查询
    case 'getScore':
      res = await newGetScore(data, newUrl, newHost)
      break
    // 查询已选中的选修课
    case 'allSelected':
      res = await allSelected(data, url)
      break
    // 查询考级成绩
    case 'getGrade':
      res = await getGrade(data, url)
      break
    // 查询当前在线人数
    case 'getOnlines':
      res = await getOnlines(data, url)
      break
    // 修改密码
    case 'changePass':
      res = await changePass(data, url)
      break
    // 单科成绩查询、选中/取消选修课、查询所有可选的选修课
    case 'easyQuery':
      if (!host) {
        console.log('出现错误！', { func, data })
      }
      res = await easyQuery(data, host || '59.51.24.46')
      break
    // 只需要 sessionid 的云函数：教学评价入口查询、选修课入口查询
    case 'onlySid':
      res = await onlySid(data, url)
      break

    default:
      break
  }
  return {
    data: res
  }
}
