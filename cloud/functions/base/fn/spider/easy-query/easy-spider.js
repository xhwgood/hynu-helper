const cheerio = require('cheerio')

exports.checkCancelxxk = body => {
	console.log(body)
	const msg = body.split("'")[3]
	let code = 404
	if (msg.includes('成功')) {
		code = 200
	}
	return (res = {
		code,
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
