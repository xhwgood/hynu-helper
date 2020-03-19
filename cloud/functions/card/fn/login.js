const c = require('./crypto-card')
const cheerio = require('cheerio')
const axios = require('axios')
// const cloud = require('wx-server-sdk')

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
			const $ = cheerio.load(result.data)
			let res = {
				code: $('code').text(),
				msg: $('Msg').text()
			}
			if ($('code').text() == '1') {
				res = {
					...res,
					code: 200,
					AccNum: $('AccNum').text(),
					AccName: $('AccName').text(),
					CardID: $('CardID').text(),
					CustomerID: $('CustomerID').text(),
					AgentID: $('AgentID').text(),
					LostDate: $('LostDate').text()
				}
			}

			return res
		})
		.catch(err => {
			console.log('网络错误', err)
			return (res = '网络错误或其他异常')
		})
}
