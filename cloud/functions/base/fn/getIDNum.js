const rp = require('request-promise')

// 获得当前学期及学生身份证
exports.getIDNum = async (data, url) => {
	const { sessionid } = data

	const headers = {
		Cookie: sessionid
	}
	const options = {
		uri: `${url}/tkglAction.do?method=kbxxXs`,
		headers
	}

	return rp(options)
		.then(body => {
			if (body.includes('错误')) {
				return (res = {
					code: 401
				})
			} else {
				// 学年学期号
				const xnxqh = body.slice(6444, 6455)
				// 身份证
				const xsid = body.slice(6469, 6487)

				return (res = {
					code: 202,
					xnxqh,
					xsid
				})
			}
		})
		.catch(err => {
			console.log('服务器内部错误', err)
			return (res = {
				code: 401
			})
		})
}
