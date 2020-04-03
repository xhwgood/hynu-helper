// 云函数入口文件
const { login } = require('./fn/login')
const { getClass } = require('./fn/getClass')
const { getIDNum } = require('./fn/getIDNum')
const { getDesign } = require('./fn/getDesign')
const { reset } = require('./fn/reset')
const { selectStu } = require('./fn/selectStu')
const { getScore } = require('./fn/getScore')
const { allSelected } = require('./fn/allSelected')
const { easyQuery } = require('./fn/easyQuery')
const { onlySid } = require('./fn/onlySid')

// 云函数入口函数
exports.main = async (e, context) => {
	let url = 'http://59.51.24.46/hysf'
	const { func, data } = e
	const { username, account } = data
	console.log(func)
	// 南岳学院教务处网站
	if (
		(username && username.includes('N')) ||
		(account && account.includes('N'))
	) {
		console.log('云函数测试username：', typeof data.username)

		url = 'http://59.51.24.41'
	}
	console.log('入口函数的url：', url)

	let res

	switch (func) {
		// 登录
		case 'login':
			res = await login(data, url)
			break
		// 获取/修改当前课程表
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
		// 查询所有选修课
		case 'allSelected':
			res = await allSelected(data, url)
			break
		// 单科成绩查询、选中/取消选修课、查询选修课
		case 'easyQuery':
			res = await easyQuery(data)
			break
		// 只需要 sessionid 的云函数：教学评价查询、选修课查询
		case 'onlySid':
			res = await onlySid(data, url)
			break

		default:
			break
	}
	return {
		data: res
	}
}
