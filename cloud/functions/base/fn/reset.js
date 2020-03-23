const rp = require('request-promise')

// account=16190232&sfzjh=330381199708101715
exports.reset = async (data, url) => {
	const { account, sfzjh } = data

	const options = {
		method: 'POST',
		url: `${url}/yhxigl.do?method=resetPasswd`,
		form: {
			account,
			sfzjh
		}
	}

	return rp(options)
		.then(body => {
			let msg = '密码已重置为身份证号的后六位'
			let code = 200
			if (body.charAt(37) != '密') {
				msg = '身份证号错误或学号错误'
				code = 404
			}

			return (res = {
				code,
				msg
			})
		})
		.catch(err => {
			console.log('网络错误', err)
			return (res = '网络错误或其他异常')
		})
}
