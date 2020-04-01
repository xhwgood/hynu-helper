const rp = require('request-promise')

exports.queryID = async (e, context) => {
	const { random, name, idnumber, cookie } = e

	const options = {
		method: 'POST',
		uri: 'http://cet-bm.neea.cn/Home/ToQueryTestTicket',
		headers: {
			'accept-encoding': 'gzip, deflate',
			'content-length': '111',
			'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
			cookie,
			host: 'cet-bm.neea.cn',
			referer: 'http://cet-bm.neea.cn/Home/QueryTestTicket'
		},
		body: `provinceCode=43&IDTypeCode=1&IDNumber=${idnumber}&Name=${encodeURI(
			name
		)}&verificationCode=${random}`
	}

	return rp(options)
		.then(body => {
			return (res = {
				code: 200,
				body
			})
		})
		.catch(err => {
			console.log(err)
		})
}
