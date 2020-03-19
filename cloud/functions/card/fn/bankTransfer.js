const c = require('./crypto-card')
const cheerio = require('cheerio')
const axios = require('axios')

const Time = c.getTime()

exports.bankTransfer = async (data, url) => {
	const { AccNum, MonTrans, Password } = data
	const Sign = c.cryptSign([AccNum, MonTrans, Password, Time])

	return axios
		.post(
			`${url}/bankTransfer.aspx`,
			`Time=${Time}&Sign=${Sign}&AccNum=${AccNum}&MonTrans=${MonTrans}&Password=${Password}`
		)
		.then(result => {
      console.log(`Time=${Time}&Sign=${Sign}&AccNum=${AccNum}&MonTrans=${MonTrans}&Password=${Password}`);
      
			const $ = cheerio.load(result.data)
			let code = 200
			if ($('code').text() != 1) {
				code = 400
			}
			return (res = {
				code,
				msg: $('msg').text()
			})
		})
		.catch(err => {
			console.log('网络错误', err)
			return (res = '网络错误或其他异常')
		})
}
