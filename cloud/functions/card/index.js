// 云函数入口文件
const { login } = require('./fn/login')
const { queryAccWallet } = require('./fn/queryAccWallet')
const { queryAccInfo } = require('./fn/queryAccInfo')
const { queryDealRec } = require('./fn/queryDealRec')
const { bankTransfer } = require('./fn/bankTransfer')
// const { getRandomNum } = require('./fn/getRandomNum')
const { queryMonthBill } = require('./fn/queryMonthBill')

const url = 'http://223.146.71.19:8001'

// 云函数入口函数
exports.main = async (e, context) => {
	const { func, data } = e
	let res

	switch (func) {
		// 登录并查询余额
		case 'login':
			const res1 = await login(data, url)
			let res2
			let res3
			if (res1.msg.includes('成功')) {
				res2 = await queryAccWallet({ AccNum: res1.AccNum }, url)
				res3 = await queryAccInfo({ AccNum: res1.AccNum }, url)
			} else {
				res1.code = 400
			}
			res = {
				...res1,
				...res2,
				...res3
			}
			break
		// 查询余额
		case 'queryAccWallet':
			res = await queryAccWallet(data, url)
			break
		// 查询近期账单
		case 'queryDealRec':
			res = await queryDealRec(data, url)
			break
		// 充值
		case 'bankTransfer':
			res = await bankTransfer(data, url)
			break
		// case 'getRandomNum':
		// 	res = await getRandomNum(data, url)
		// 	break
		// 查询月账单
		case 'queryMonthBill':
			res = await queryMonthBill(data, url)
			break

		default:
			break
	}
	return {
		data: res
	}
}
