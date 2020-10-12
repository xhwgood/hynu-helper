const c = require('./crypto-card')
const cheerio = require('cheerio')
const axios = require('axios')

const Time = c.getTime()

exports.queryAccInfo = async (data, url) => {
	const { AccNum } = data
	const Sign = c.cryptSign([AccNum, Time])

	return axios
		.post(
			`${url}/queryAccInfo.aspx`,
			`Time=${Time}&Sign=${Sign}&AccNum=${AccNum}`
		)
		.then(result => {
			const $ = cheerio.load(result.data)

			return (res = {
				code: 200,
				BankName: $('BankName').text(),
				BankCard: $('BankCard').text().slice(15)
			})
		})
		.catch(err => {
			console.log('网络错误', err)
			return 400
		})
}
