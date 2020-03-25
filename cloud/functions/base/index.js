// 云函数入口文件
const { login } = require('./fn/login')
const { getClass } = require('./fn/getClass')
const { getIDNum } = require('./fn/getIDNum')
const { getDesign } = require('./fn/getDesign')
const { getJxpj } = require('./fn/getJxpj')
const { reset } = require('./fn/reset')
const { selectStu } = require('./fn/selectStu')
const { getScore } = require('./fn/getScore')
const { singleScore } = require('./fn/singleScore')

const url = 'http://59.51.24.46/hysf'
// 云函数入口函数
exports.main = async (e, context) => {
	const { func, data } = e
	let res

	switch (func) {
		// 登录
		case 'login':
			res = await login(data, url)
			break
		// 获取当前学期课程表
		case 'getClass':
			const res_id = await getIDNum(data, url)
			if (res_id.xsid) {
				res = await getClass(
					{
						...data,
						...res_id
					},
					url
				)
				res = { ...res, xsid: res_id.xsid }
			} else {
				res = { ...res_id }
			}
			break
		// 修改当前课程表
		case 'changeClass':
			res = await getClass(data, url)
			break
		// 验证 sessionid 是否过期
		case 'getIDNum':
			res = await getIDNum(data, url)
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
		// 单科成绩查询
		case 'singleScore':
			res = await singleScore(data)
			break

		default:
			break
	}
	return {
		data: res
	}
}
