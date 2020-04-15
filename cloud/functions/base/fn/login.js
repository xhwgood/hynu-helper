const rp = require('request-promise')

exports.login = async (data, url) => {
	const { username, password, randomcode, sessionid } = data
	console.log('login.js收到的url为', url)

	const headers = {
		Cookie: sessionid
	}
	const options = {
		method: 'POST',
		uri: `${url}/Logon.do?method=logon`,
		headers,
		form: {
			USERNAME: username,
			PASSWORD: password,
			RANDOMCODE: randomcode
		}
	}
	const optionsSSO = {
		method: 'POST',
		uri: `${url}/Logon.do?method=logonBySSO`,
		headers
	}

	return rp(options)
		.then(body => {
			if (body.includes('main.jsp')) {
				return rp(optionsSSO)
					.then(body => {
						return (res = {
							code: 200
						})
					})
					.catch(err => {
						console.log('单点登录失败！', err)
					})
			} else {
				let msg = '学号、密码或验证码错误'
				if (body.includes('有效期')) {
					msg = '未在选修课开放时间内不可登录'
				}
				return (res = {
					msg
				})
			}
		})
		.catch(err => {
			console.log('网络错误', err)
			return (res = '网络错误或其他异常')
		})
}
