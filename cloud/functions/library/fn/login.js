const rp = require('request-promise')
const cheerio = require('cheerio')
const crypto = require('crypto')
const strToDate = require('../strToDate')

exports.login = async (data, url) => {
  const { rdid, password } = data
  const rdPasswd = crypto.createHash('md5').update(password).digest('hex')
  const options = {
    method: 'POST',
    url: `${url}/reader/doLogin`,
    form: {
      password: '',
      rdPasswd,
      rdid,
      returnUrl: ''
    }
  }
  /** 登录失败 */
  const logErr = {
    code: 700,
    msg: '学号或密码错误'
  }
  /** 出现异常的提示 */
  const netErr = {
    code: 700,
    msg: '很抱歉，图书馆后台出现异常'
  }

  return rp(options)
    .then(res => {
      return logErr
    })
    .catch(err => {
      console.log('是否重定向：', err)
      if (err.statusCode == 302) {
        const Cookie = err.response.headers['set-cookie'][0].slice(0, 43)
        const headers = {
          Cookie
        }
        const options_space = {
          url: `${url}/reader/space`,
          headers
        }

        return rp(options_space)
          .then(body => {
            if (body.includes('错误')) {
              console.log('登录失败')
              return netErr
            } else {
              console.log('登录成功')
              $ = cheerio.load(body, { normalizeWhitespace: true })
              const obj = {}
              $('tr').each((i, value) => {
                const getTxt = num =>
                  $(value)
                    .children()
                    .eq(num)
                    .text()
                    .replace(/[\r\n\t]/g, '')
                if (i == 2) {
                  // 有效期
                  obj.validity = getTxt(0).slice(7)
                  const arr = getTxt(1).split(/\s+/)
                  // 欠款
                  obj.arrears = arr[1]
                  // 预付费
                  obj.charge = arr[3]
                } else if (i == 4) {
                  // 已借/可借
                  obj.canBorrow = getTxt(0).slice(10)
                }
              })
              // 在借图书
              if ($('.message').length != 3) {
                obj.current = []
                $('#contentTable tr').each((i, value) => {
                  const getTxt = num =>
                    $(value).children().eq(num).text().replace(/[\s]/g, '')

                  if (i != 0) {
                    obj.current.push({
                      barcodeList: getTxt(0),
                      book: getTxt(1),
                      author: getTxt(2),
                      place: getTxt(4),
                      lendTime: strToDate(getTxt(6)),
                      returnTime: getTxt(7)
                    })
                  }
                })
              } else {
                // 没有借阅的图书
                obj.current = '没有在借的图书'
              }

              return (res = {
                code: 200,
                obj,
                libSid: Cookie
              })
            }
          })
          .catch(err => {
            console.log('获取space错误', err)
            return netErr
          })
      } else {
        return (res = {
          code: 700,
          msg: '很抱歉，《我的衡师》服务器出现异常'
        })
      }
    })
}
