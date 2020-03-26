const rp = require('request-promise')
const cheerio = require('cheerio')

exports.getElective = async (data, url) => {
	const { sessionid } = data

	const headers = {
		Cookie: sessionid
	}

	const options = {
		uri: `${url}/xkglAction.do?method=xsxkXsxk`,
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
				const enter_info = []
				$('#mxh tr').each((i, value) => {
					const getTxt = num =>
						$(value)
							.children()
							.eq(num)
							.text()
							.trim()

					const $_detail = cheerio.load(value)
					const detail = $_detail('a')
						.attr('onclick')
						.replace(/\s/g, '')
					const str = detail.split("'")[1]
					const queryDetail = str.slice(0, str.indexOf('type') + 6)

					enter_info.push({
						term: getTxt(1),
						stage: getTxt(3),
						start: getTxt(4),
						end: getTxt(5),
						queryDetail
					})
				})

				return (res = {
					code: 200,
					enter_info
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
