const cheerio = require('cheerio')

exports.checkCancelxxk = body => {
	const msg = body.split("'")[3]
	return (res = {
		code: 200,
		msg
	})
}

exports.singleScore = body => {
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
		getted: true
	}

	return (res = {
		code: 200,
		single_obj: obj
	})
}
