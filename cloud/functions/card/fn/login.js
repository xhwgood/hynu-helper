const c = require('./crypto-card')
const cheerio = require('cheerio')
const axios = require('axios')

const Time = c.getTime()

exports.login = async (data, url) => {
	const { UserNumber, Password } = data
	const Sign = c.cryptSign([Password, Time, UserNumber])

	return axios
		.post(
			`${url}/LogIn.aspx`,
			`Time=${Time}&Sign=${Sign}&UserNumber=${UserNumber}&Password=${Password}`
		)
		.then(result => {
			let res
			const $ = cheerio.load(result.data)
			switch ($('code').text()) {
				case '0':
					res = {
						code: 0,
						msg: $('Msg').text()
					}
					break
				case '1':
					const Sign_wallet = c.cryptSign([AccNum, Time])
					const AccNum = $('AccNum').text()
					axios
						.post(
							`${url}/QueryAccWallet.aspx`,
							`Time=${Time}&Sign=${Sign_wallet}&AccNum=${AccNum}`
						)
						.then(result_wallet => {
							const $_wallet = cheerio.load(result_wallet.data)
							res = {
								code: 1,
								msg: $('Msg').text(),
								AccNum,
								AccName: $('AccName').text(),
								CardID: $('CardID').text(),
								CustomerID: $('CustomerID').text(),
								AgentID: $('AgentID').text(),
								LostDate: $('LostDate').text(),
								balance: $_wallet('accname').text()
							}
						})
						.catch(err => {
							console.log('网络错误', err)
							return (res = '网络错误或其他异常')
						})
					break
				case '2':
					res = {
						code: 2,
						msg: $('Msg').text()
					}
					break
				case '3':
					res = {
						code: 3,
						msg: $('Msg').text()
					}
					break

				default:
					break
			}
			return res
		})
		.catch(err => {
			console.log('网络错误', err)
			return (res = '网络错误或其他异常')
		})
}
