// 云函数入口文件
const { login } = require('./fn/login')
const { queryAccWallet } = require('./fn/queryAccWallet')
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
		case 'login':
			const res1 = await login(data, url)
			const res2 = await queryAccWallet({ AccNum: res1.AccNum }, url)
			res = {
				...res1,
				balance: res2.balance
			}
			break
		case 'queryAccWallet':
			res = await queryAccWallet(data, url)
			break
		case 'queryDealRec':
			res = await queryDealRec(data, url)
			break
		case 'bankTransfer':
			res = await bankTransfer(data, url)
			break
		// case 'getRandomNum':
		// 	res = await getRandomNum(data, url)
		// 	break
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
