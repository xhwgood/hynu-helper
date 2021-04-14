// @ts-check
const c = require('./crypto-card')
const cheerio = require('cheerio')
const axios = require('axios').default
const qs = require('qs')

const Time = c.getTime()

/**
 * 查询月账单
 * @param {{
 *  AccNum: string
 *  Month: string
 * }} data 
 * @param {string} url 
 */
exports.queryMonthBill = async (data, url) => {
  let { AccNum, Month } = data
  Month = Month.replace('-', '')
  const Sign = c.cryptSign([AccNum, Month, Time])

  return axios
    .post(
      `${url}/queryMonthBill.aspx`,
      qs.stringify({
        Time,
        Sign,
        AccNum,
        Month
      })
    )
    .then(result => {
      const $ = cheerio.load(result.data)
      const monthBill = {}
      monthBill.income = $('Income').text() || 0
      monthBill.expenses = $('Expenses').text() || 0

      const arr = []
      $('DealerName').each(function (i) {
        arr[i] = {}
        arr[i].name = $(this).text()
      })
      $('Money').each(function (i) {
        arr[i].value = parseFloat($(this).text())
      })

      monthBill.arr = arr
      return {
        code: 200,
        monthBill
      }
    })
    .catch(err => {
      console.log('网络错误', err)
      return 400
    })
}
