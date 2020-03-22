const c = require('./crypto-card')
const cheerio = require('cheerio')
const axios = require('axios')

const Time = c.getTime()
const headers = {
	'accept-encoding': 'gzip',
	connection: 'Keep-Alive',
	'content-length': '110',
	'content-type': 'application/x-www-form-urlencoded',
	host: '223.146.71.19:8001',
	'user-agent': 'Dalvik/2.1.0 (Linux; U; Android 7.1.1; OD105 Build/NMF26F)'
}

exports.bankTransfer = async (data, url) => {
	let { AccNum, MonTrans, Password } = data
	const Sign = c.cryptSign([AccNum, MonTrans, Password, Time])
	Password = encodeURIComponent(Password)

	return axios
		.post(
			`${url}/bankTransfer.aspx`,
			`Time=${Time}&Sign=${Sign}&AccNum=${AccNum}&MonTrans=${MonTrans}&Password=${Password}`,
			{ headers }
		)
		.then(result => {
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
