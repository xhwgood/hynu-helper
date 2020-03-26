const rp = require('request-promise')
const cheerio = require('cheerio')

exports.getHistory = async (data, url) => {
	const { Cookie, page } = data
	const headers = {
		Cookie
	}
	const options = {
		method: 'POST',
		url: `${url}/loan/historyLoanList`,
		headers,
		form: {
			page,
			rows: '10'
		}
	}

	return rp(options)
		.then(body => {
			$ = cheerio.load(body, { normalizeWhitespace: true })
			const arr = []

			$('tr').each((i, value) => {
				const getTxt = num =>
					$(value)
						.children()
						.eq(num)
						.text()
						.replace(/[\s]/g, '')
				if (i != 0) {
					arr.push({
						operate: getTxt(0),
						book: getTxt(2),
						author: getTxt(3),
						place: getTxt(5),
						time: getTxt(7)
					})
				}
			})
			let code = 200
			if (arr.length > 20) {
				code = 400
			}
			const page_arr = $('.disabled')
				.text()
				.split(/\s+/)
			const total = page_arr[1]
			return (res = {
				code,
				arr,
				total
			})
		})
		.catch(err => {
			return (res = {
				code: 400,
				msg: '正在重新登录'
			})
		})
}
