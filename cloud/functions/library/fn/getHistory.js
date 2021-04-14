// @ts-check
const rp = require('request-promise')
const cheerio = require('cheerio')
const strToDate = require('../strToDate')
/**
 * 获取历史借阅列表
 * @param {{
 *  Cookie: string
 *  page: number
 * }} data 
 * @param {string} url 
 */
exports.getHistory = async (data, url) => {
  const { Cookie, page } = data
  const headers = {
    Cookie
  }
  const options = {
    method: 'POST',
    url: `${url}/loan/historyLoanList`,
    headers,
    form: {
      page,
      rows: '15'
    }
  }

  return rp(options)
    .then(body => {
      const $ = cheerio.load(body, { normalizeWhitespace: true })
      const arr = []
      $('tr').each((i, value) => {
        const getTxt = num =>
          $(value).children().eq(num).text().replace(/[\s]/g, '')
        // 第一项不是历史借阅，直接跳过
        if (i != 0) {
          arr.push({
            operate: getTxt(0),
            book: getTxt(2),
            author: getTxt(3),
            place: getTxt(5),
            time: strToDate(getTxt(7))
          })
        }
      })
      let code = 200
      if (arr.length > 20) {
        code = 400
      }
      const page_arr = $('.disabled').text().split(/\s+/)
      const total = page_arr[1]
      return {
        code,
        arr,
        total
      }
    })
    .catch(err => {
      return {
        code: 602,
        msg: '正在重新登录'
      }
    })
}
