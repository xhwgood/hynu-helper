const rp = require('request-promise')
const cheerio = require('cheerio')

exports.renew = async (data, url) => {
  const { Cookie, barcodeList } = data
  const headers = {
    Cookie
  }
  const options = {
    method: 'POST',
    url: `${url}/m/loan/doRenew`,
    headers,
    form: {
      furl: '/m/loan/renewList',
      barcodeList
    }
  }

  return rp(options)
    .then(body => {
      $ = cheerio.load(body, { normalizeWhitespace: true })
      const txt = $('#messageInfo').text().trim()

      return {
        code: 203,
        txt
      }
    })
    .catch(err => {
      console.error(err)

      return {
        code: 601
      }
    })
}
