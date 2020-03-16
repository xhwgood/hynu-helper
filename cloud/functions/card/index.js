// 云函数入口文件
const { login } = require('./fn/login')

const url = 'http://223.146.71.19:8001'

// 云函数入口函数
exports.main = async (e, context) => {
	const { func, data } = e
	let res

	switch (func) {
		case 'login':
			res = await login(data, url)
			break
		// case 'query':
		// 	res = await query(data, url)
		// 	break
		// case 'queryID':
		// 	res = await queryID(data, url)
		// 	break

		default:
			break
	}
	return {
		data: res
	}
}
