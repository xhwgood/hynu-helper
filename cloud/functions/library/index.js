// 云函数入口文件
const { login } = require('./fn/login')
const { getHistory } = require('./fn/getHistory')

const url = 'http://opac.hynu.cn:443/opac'

// 云函数入口函数
exports.main = async (e, context) => {
	const { func, data } = e
	let res

	switch (func) {
		case 'login':
			res = await login(data, url)
			break
		case 'getHistory':
			res = await getHistory(data, url)
			break
		case 'reLogin':
			const res_cookie = await login(data, url)
			console.log('typeof res_cookie.libSid', typeof res_cookie.libSid)

			if (typeof res_cookie.libSid == 'string') {
				res = await getHistory(
					{
						Cookie: res_cookie.libSid,
						page: 1
					},
					url
				)
				res = { ...res, ...res_cookie }
			} else {
				res = { msg: '出现错误!' }
			}
			break

		default:
			break
	}
	return {
		data: res
	}
}
