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

	const optionsScore = {
		uri: `${url}/cet/query?data=CET6_192_DANGCI%2C${zkzh}%2C${encodeURI(
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
			// 转换成对象
			console.log('切割后', body.body.slice(16, -2))

			const data = body.body
				.slice(16, -2)
				.replace(/(?:\s*['"]*)?([a-zA-Z0-9]+)(?:['"]*\s*)?:/g, `"$1":`)
				.replace(/\'/g, '"')
			return (res = {
				code,
				data
			})
		})
		.catch(err => {
			console.log(err)
		})
}
