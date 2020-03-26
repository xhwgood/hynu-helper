const rp = require('request-promise')
const cheerio = require('cheerio')

exports.selectElective = async data => {
	const { sessionid, queryDetail } = data
	console.log(data);
	
	const headers = {
		Cookie: sessionid,
		Host: '59.51.24.46'
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
				const xxk_arr = []
				$('#mxh tr').each((i, value) => {
					const getTxt = num =>
						$(value)
							.children()
							.eq(num)
							.text()
							.trim()
					const $_detail = cheerio.load(value)
					const detail = $_detail('input').attr('onclick')
					const classID = detail.split("'")[1]

					xxk_arr.push({
						name: getTxt(1),
						from: getTxt(2),
						credit: getTxt(3),
						selected: getTxt(4),
						surplus: getTxt(5),
						teacher: getTxt(6),
						week: getTxt(7),
						time: getTxt(8),
						place: getTxt(9),
						sex: getTxt(12),
						classID,
						bottomShow: false
					})
				})

				return (res = {
					code: 200,
					xxk_arr
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
