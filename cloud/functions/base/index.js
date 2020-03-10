// 云函数入口文件
const cloud = require('wx-server-sdk')
const { login } = require('./fn/login')
const { getClass } = require('./fn/getClass')
const { getDesign } = require('./fn/getDesign')

cloud.init()

const url = 'http://59.51.24.46/hysf'
// 云函数入口函数
exports.main = async (e, context) => {
	// const wxContext = cloud.getWXContext()
	const { func, data } = e
	let res

	switch (func) {
		case 'login':
			res = await login(data, url)
			break
		case 'getClass':
			res = await getClass(data, url)
			break
		case 'getDesign':
			res = await getDesign(data, url)
			break

		default:
			break
	}
	return {
		data: res
	}
}
