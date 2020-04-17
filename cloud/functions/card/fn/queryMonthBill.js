const c = require('./crypto-card')
const cheerio = require('cheerio')
const axios = require('axios')

const Time = c.getTime()

exports.queryMonthBill = async (data, url) => {
  const { AccNum, Month } = data
  const Sign = c.cryptSign([AccNum, Month, Time])

  return axios
    .post(
      `${url}/queryMonthBill.aspx`,
      `Time=${Time}&Sign=${Sign}&AccNum=${AccNum}&Month=${Month}`
    )
    .then(result => {
      const $ = cheerio.load(result.data)
      const monthBill = {}
      monthBill.income = $('Income').text() || 0
      monthBill.expenses = $('Expenses').text() || 0

      const arr = []
      $('DealerName').each(function (i, elem) {
        arr[i] = {}
        arr[i].name = $(this).text()
      })
      $('Money').each(function (i, elem) {
        arr[i].value = parseFloat($(this).text())
      })

      monthBill.arr = arr
      return (res = {
        code: 200,
        monthBill
      })
    })
    .catch(err => {
      console.log('网络错误', err)
      return (res = '网络错误或其他异常')
    })
}
