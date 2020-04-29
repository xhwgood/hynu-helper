const cheerio = require('cheerio')

exports.selectElective = body => {
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
		const str = getTxt(8)
		const time = `每周${str.charAt(0)} ${str.charAt(2)}~${str.charAt(6)}节`
		const selected = Number(getTxt(4))
		const surplus = Number(getTxt(5))
		const progress = parseInt(
			(selected / (selected + surplus)).toFixed(2) * 100
		)

		xxk_arr.push({
			name: getTxt(1),
			from: getTxt(2),
			credit: getTxt(3),
			selected,
			surplus,
			teacher: getTxt(6),
			week: getTxt(7),
			time,
			place: getTxt(9),
			sex: getTxt(12),
			classID,
			bottomShow: false,
			progress
		})
	})
	xxk_arr.sort((a, b) => b.selected - a.selected)

	return (res = {
		code: 200,
		xxk_arr
	})
}
