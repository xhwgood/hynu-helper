// @ts-check
const cheerio = require('cheerio')

exports.getElective = body => {
	const $ = cheerio.load(body)
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

	return {
		code: 200,
		enter_info
	}
}
