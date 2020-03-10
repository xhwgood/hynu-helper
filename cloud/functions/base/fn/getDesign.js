const rp = require('request-promise')
const cheerio = require('cheerio')

function getTxt(num) {
	return $(value)
		.children()
		.eq(num)
		.text()
}
exports.login = async (data, url) => {
	const { sessionid } = data

	const headers = {
		Cookie: sessionid
	}

	const options = {
		url: `${url}/jiaowu/bysj/xt_list.jsp`,
		headers
	}

	return rp(options)
		.then(body => {
			if (body.includes('main.jsp')) {
				$ = cheerio.load(response.body)
				const design = []

				$('#mxh tr').each((i, value) => {
					design.push({
						name: getTxt(2),
						college: getTxt(3),
						teacher: getTxt(4),
						tTitle: getTxt(5),
						limit: getTxt(6),
						selected: getTxt(7),
						id: value.attribs.ondblclick.slice(50, 82)
					})
				})
				return {
					code: 200,
					msg: '获取成功',
					design
				}
			} else {
				console.log('登录失败', body.request.headers)
				return (res = '获取失败')
			}
		})
		.catch(err => {
			console.log('网络错误', err)
			return (res = '网络错误或其他异常')
		})
}
