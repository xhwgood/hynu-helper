const rp = require('request-promise')
const cheerio = require('cheerio')

exports.allSelected = async (data, url) => {
	const { sessionid } = data

	const headers = {
		Cookie: sessionid
	}

	const options = {
		url: `${url}/xkglAction.do?method=toFindxsyxkc&xnxq01id=2019-2020-2&zzdxklbname=1&jx0502zbid=35`,
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
				const $ = cheerio.load(body)
				const selected = []
				$('#mxh tr').each((i, value) => {
					const getTxt = num =>
						$(value)
							.children()
							.eq(num)
							.text()
							.trim()
					const name = getTxt(4)
					if (name != '毕业论文') {
						const $_detail = cheerio.load(value)
						const detail = $_detail('a').attr('onclick')
						const queryDetail = detail.split("'")[1]
						selected.push({
							classID: queryDetail,
							name,
							from: getTxt(5),
							teacher: getTxt(7),
							week: getTxt(8),
							time: getTxt(9),
							mySelected: true
						})
					}
				})
				let msg = '没有已选的选修课'
				if (selected.length) {
					msg = '获取成功'
				}

				return (res = {
					code: 200,
					selected,
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
