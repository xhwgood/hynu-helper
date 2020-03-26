const rp = require('request-promise')

exports.checkCancelxxk = async data => {
	const { sessionid, queryDetail } = data

	const headers = {
		Cookie: sessionid
	}

	const options = {
		uri: `http://59.51.24.46${queryDetail}`,
		headers
	}

	return rp(options)
		.then(body => {
			if (body.includes('错误')) {
				return (res = {
					code: 500,
					msg: '获取失败，请重新登录'
				})
			} else {
				console.log(body)

				const msg = body.split("'")[3]
				return (res = {
					code: 200,
					msg
				})
			}
		})
		.catch(err => {
			console.log('出现异常', err)
			return (res = {
				code: 500,
				msg: '网络错误或其他异常'
			})
		})
}
