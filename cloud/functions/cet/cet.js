const rp = require('request-promise')

exports.getRandom = async (data, url) => {
	const { zkzh } = data

	const options = {
		uri: `${url}/Imgs.do?c=CET&ik=${zkzh}`,
		headers: {
			referer: `${url}/cet/`
		},
		resolveWithFullResponse: true
	}
	return rp(options)
		.then(response => {
			const cookie = response.headers['set-cookie'][0].slice(0, 107)
			const random = response.body.slice(12, -2).replace(/\"/g, '')
			// console.log(cookie, '\n验证码图片地址：', random)

			return (res = {
				code: 200,
				cookie,
				random
			})
		})
		.catch(err => {
			return (res = {
				code: 404
			})
		})
}

exports.query = (data, url) => {
	const { random, name, cookie, zkzh } = data
	let cet = 'CET4'
	if (zkzh[9] == 2) {
		cet = 'CET6'
	}
	const optionsScore = {
		uri: `${url}/cet/query?data=${cet}_192_DANGCI%2C${zkzh}%2C${encodeURI(
			name
		)}&v=${random}`,
		headers: {
			cookie,
			referer: `${url}/cet/`
		},
		resolveWithFullResponse: true
	}
	return rp(optionsScore)
		.then(body => {
			let code = 200
			let data = body.body
				.slice(16, -2)
				.replace(/(?:\s*['"]*)?([a-zA-Z0-9]+)(?:['"]*\s*)?:/g, `"$1":`)
				.replace(/\'/g, '"')
			data = JSON.parse(data)
			let msg = '获取成功'
			if (data.error) {
				msg = data.error
				code = 404
			}
			return (res = {
				msg,
				data,
				code
			})
		})
		.catch(err => {
			console.log(err)
		})
}
