// 云函数入口文件
// const cloud = require('wx-server-sdk')
const { login } = require('./fn/login')
const { getClass } = require('./fn/getClass')
const { getDesign } = require('./fn/getDesign')
const { getJxpj } = require('./fn/getJxpj')
const { reset } = require('./fn/reset')
const { selectStu } = require('./fn/selectStu')
const { getScore } = require('./fn/getScore')

// cloud.init()

const url = 'http://59.51.24.46/hysf'
// 云函数入口函数
exports.main = async (e, context) => {
	// const wxContext = cloud.getWXContext()
	const { func, data } = e
	let res

	switch (func) {
		// 登录
		case 'login':
			res = await login(data, url)
			break
		// 获取课程表
		case 'getClass':
			res = await getClass(data, url)
			break
		// 获取毕业设计
		case 'getDesign':
			res = await getDesign(data, url)
			break
		// 获取教学评价
		case 'getJxpj':
			res = await getJxpj(data, url)
			break
		// 重置密码
		case 'reset':
			res = await reset(data, url)
			break
		// 查找学生
		case 'selectStu':
			res = await selectStu(data, url)
			break
		// 成绩查询
		case 'getScore':
			res = await getScore(data, url)
			break

		default:
			break
	}
	return {
		data: res
	}
}
