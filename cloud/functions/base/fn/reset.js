const rp = require('request-promise')

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
			let msg
			let code = 200
			if (body.charAt(37) != '密') {
				msg = '身份证号错误或学号错误'
				code = 404
			}

			return {
				code,
				msg
			}
		})
		.catch(err => {
			console.log('网络错误', err)
			return {
        code: 400,
        msg: '抱歉，出现异常'
      }
		})
}
