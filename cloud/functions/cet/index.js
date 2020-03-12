const { getRandom, query } = require('./cet')
const { queryID } = require('./queryID')

const url = 'http://cache.neea.edu.cn'

// 云函数入口函数
exports.main = async (e, context) => {
	const { func, data } = e
	let res

	switch (func) {
		case 'getRandom':
			res = await getRandom(data, url)
			break
		case 'query':
			res = await query(data, url)
			break
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
