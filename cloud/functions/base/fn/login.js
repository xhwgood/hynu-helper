const rp = require('request-promise')

exports.login = async (data, url) => {
	const { username, password, randomcode, sessionid } = data

	const headers = {
		Cookie: sessionid
	}

	const options = {
		method: 'POST',
		uri: `${url}/Logon.do?method=logon`,
		headers,
		resolveWithFullResponse: true,
		form: {
			USERNAME: username,
			PASSWORD: password,
			RANDOMCODE: randomcode
		}
	}
	const optionsSSO = {
		method: 'POST',
		uri: `${url}/Logon.do?method=logonBySSO`,
		headers,
		resolveWithFullResponse: true
	}

	return rp(options)
		.then(response => {
			if (response.body.includes('main.jsp')) {
				// console.log('登录成功', body.body, sessionid)

				return rp(optionsSSO)
					.then(body => {
						return {
							code: 200
						}
					})
					.catch(err => {
						console.log('单点登录失败！', err)
					})
			} else {
				console.log('登录失败', response.request.headers)
				return (res = '帐号、密码或验证码错误')
			}
		})
		.catch(err => {
			console.log('网络错误', err)
			return (res = '网络错误或其他异常')
		})
}
