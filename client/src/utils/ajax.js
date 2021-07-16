// @ts-check
import Taro from '@tarojs/taro'
import { navigate, noicon, nocancel, showError } from './taroutils'
import isEmptyValue from './isEmptyValue'
import { get as getGlobalData } from './global_data'

const username = Taro.getStorageSync('username')
const txt = username ? '登录状态已过期' : '请先绑定教务处'
/**
 * 超时 `promise`
 * @param {Promise} promise
 * @param {number} ms
 */
const timeoutP = (promise, ms) => {
  const timeout = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(`异步操作超过时间${ms}毫秒`)
    }, ms)
  })
  return Promise.race([promise, timeout])
}

/**
 * 封装云函数
 * @param {string} name 云函数名
 * @param {{
 *  func?: string
 *  data?: object
 * }} data 云函数参数
 * @param notoast 是否不显示 `toast` 提示
 */
const ajax = (name, data = {}, notoast = false) =>
  new Promise((resolve, reject) => {
    if (!notoast) {
      Taro.showLoading({
        title: '稍等一下~',
        mask: true
      })
    }
    /** 对请求中的参数进行空值校验 */
    const entries = Object.entries(data.data)
    if (entries.length) {
      entries.forEach(([key, value]) => {
        if (isEmptyValue(value)) {
          console.error(`对云函数${name}请求的数据中存在空值，键:${key} 值:${value}`)
        }
      })
    }

    // 带上学号以判断是否为南岳学院学生
    const sendData = data
    if (name == 'base' && data.func != 'login' && data.func != 'reset') {
      sendData.data.username =
        getGlobalData('username') || Taro.getStorageSync('username')
    }
    const cloudP = Taro.cloud.callFunction({
      name,
      data: sendData
    })
    timeoutP(cloudP, 50000)
      .then(res => {
        Taro.hideLoading()
        const { data } = res.result
        const { code, msg } = data
        /**
         * 云函数状态码说明：
         * 200：成功
         * 201：充值成功
         * 202：已登录教务处；选课或退选操作成功
         * 203：图书馆续借成功
         * 204：获取单科成绩详情/校园卡账单（显示loading效果，获取完成后无其他提示）
         * 205：教务处密码修改成功/查询选中的选修课
         * 400：校园卡错误/图书馆信息错误
         * 401：登录状态已过期
         * 404：操作异常（未找到相应功能或页面），显示返回的 msg
         * 600：云函数查询到的数据为空
         * 601：图书馆学号或密码错误/出现异常
         * 602：图书馆登录状态过期，正在重新登录
         * 700：错误信息弹框提示
         */
        switch (code) {
          case 200:
            msg
              ? noicon(msg)
              : !notoast &&
              Taro.showToast({
                title: '获取成功'
              })
          case 201:
          case 202:
          case 203:
          case 204:
          case 205:
            resolve(data)
            break
          // 登录状态已过期，跳转至登录页
          case 401:
            navigate(txt, '/pages/login/login')
            reject(data)
            break
          case 400:
          case 404:
            showError(msg)
          case 600:
          case 601:
          case 602:
            reject(data)
            break
          case 700:
            nocancel(msg)
            reject(data)
            break

          default:
            msg ? noicon(msg) : Taro.showToast({ title: '获取成功' })
            resolve(data)
            break
        }
      })
      .catch(() => {
        Taro.hideLoading()
        nocancel('请求超时！如果你的网络正常，那说明该服务器已经崩溃无法访问，你可以在"我的"页进行吐槽反馈')
        reject()
      })
  })

export default ajax
