const rp = require('request-promise')
const cheerio = require('cheerio')

exports.singleScore = async data => {
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
				$ = cheerio.load(body)
				const getTxt = num =>
					$('#mxh tr')
						.children()
						.eq(num)
						.text()
						.trim()

				const obj = {
					peacetime: getTxt(0),
					peaceper: getTxt(1),
					midterm: getTxt(2),
					midper: getTxt(3),
					endterm: getTxt(4),
					endper: getTxt(5),
					all: getTxt(6)
				}

				return (res = {
					code: 200,
					single_obj: obj
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
