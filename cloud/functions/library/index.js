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

		default:
			break
	}
	return {
		data: res
	}
}
