const { getRandom, query } = require('./cet')
const { queryID } = require('./queryID')

const url = 'http://cache.neea.edu.cn'

// 云函数入口函数
exports.main = async (e, context) => {
	const { func, data } = e
	let res

	switch (func) {
		// 获取登录验证码
		case 'getRandom':
			res = await getRandom(data, url)
			break
		// 查询成绩
		case 'query':
			res = await query(data, url)
			break
		// 查询准考证号
		case 'queryID':
			res = await queryID(data, url)
			break

		default:
			break
	}
	return {
		data: res
	}
}
