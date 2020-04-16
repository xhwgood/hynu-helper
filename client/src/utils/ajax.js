import Taro from '@tarojs/taro'
import navigate from './navigate'
import noicon from './noicon'

const username = Taro.getStorageSync('username')
const txt = username ? '登录状态已过期' : '请先绑定教务处'

// @name：云函数名称
// @data：云函数接收的数据
// @notoast：保持静默，不弹出消息
// 状态码：
// 200：成功
// 202：已登录教务处
// 400：校园卡错误
// 401：登录状态已过期
// 404：操作异常（未找到响应功能或页面），显示返回的 msg
// 601：图书馆学号或密码错误
// 602：图书馆登录状态过期
const ajax = (name, data = {}, notoast) =>
  new Promise((resolve, reject) => {
    Taro.showLoading({
      title: '等一下下'
    })

    Taro.cloud
      .callFunction({
        name,
        data
      })
      .then(res => {
        Taro.hideLoading()
        let { code, msg } = res.result.data
        switch (code) {
          case 200:
            msg
              ? noicon(msg)
              : !notoast &&
                Taro.showToast({
                  title: '获取成功',
                  icon: 'success'
                })
            resolve(res.result.data)
            break
          case 401:
            navigate(txt, '/pages/login/login')
            reject(res.result.data)
            break
          // 图书馆错误代码
          case 602:
          case 601:
            reject(res.result.data)
            break
          case 202:
            resolve(res.result.data)
            break
          case 404:
          case 400:
            if (msg == '签名验证失败') {
              msg = '请输入查询密码，而非交易密码'
            }
            noicon(msg)
            reject(res.result.data)
            break

          default:
            msg ? noicon(msg) : noicon('获取成功')
            resolve(res.result.data)
            break
        }
      })
      .catch(err => {
        Taro.hideLoading()
        noicon('请求超时！')
        console.error(err)
        reject(err)
      })
  })

export default ajax
