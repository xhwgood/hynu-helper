const c = require('./crypto-card')
const cheerio = require('cheerio')
const axios = require('axios')

const Time = c.getTime()

exports.queryDealRec = async (data, url) => {
	const { AccNum, RecNum } = data
	const BeginDate = data.BeginDate || 0
	const EndDate = data.EndDate || 0
	const Type = 0
	const ViceAccNum = -1
	const WalletNum = 0
	const Count = 15
	const Sign = c.cryptSign([
		AccNum,
		BeginDate,
		Count,
		EndDate,
		RecNum,
		Time,
		Type,
		ViceAccNum,
		WalletNum
	])

	return axios
		.post(
			`${url}/QueryDealRec.aspx`,
			`Time=${Time}&Sign=${Sign}&AccNum=${AccNum}&BeginDate=${BeginDate}&EndDate=${EndDate}&Type=${Type}&ViceAccNum=${ViceAccNum}&WalletNum=${WalletNum}&RecNum=${RecNum}&Count=${Count}`
		)
		.then((result) => {
			const $ = cheerio.load(result.data)
			let arr = []
			let code = 200

			if ($('code').text() == 1) {
				$('row').each((i, elem) => {
					const $_c = cheerio.load(elem)
					let deal = $_c('MonDeal').text()
					let source = $_c('Source')['0'].next.data.trim()
					let icon = 'expense'
					if (deal.charAt(0) != '-') {
						deal = '+' + deal
						icon = 'charge'
					}
					if (source.includes('电控缴费')) {
						icon = 'dianfei'
					} else if (source.includes('超市')) {
						icon = 'chaoshi'
					}

					arr.push({
						feeName: $_c('FeeName').text(),
						date: $_c('Date').text(),
						time: $_c('Time').text(),
						deal,
						balance: $_c('MonCard').text(),
						source,
						icon
					})
				})
			} else {
				console.log(result)
				code = 400
				arr = null
			}

			return (res = {
				code,
				arr
			})
		})
		.catch((err) => {
			console.log('网络错误', err)
			return (res = '网络错误或其他异常')
		})
}
