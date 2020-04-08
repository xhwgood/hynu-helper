const rp = require('request-promise')
const {
	checkCancelxxk,
	singleScore
} = require('./spider/easy-query/easy-spider')
const { selectElective } = require('./spider/easy-query/selectElective')

exports.easyQuery = async data => {
	const { sessionid, queryDetail, username } = data
	let url = '59.51.24.46'
	if (username.charAt(0) == 'N') {
		url = '59.51.24.41'
	}
	const headers = {
		Cookie: sessionid
	}
	if (data.spider == 'selectElective') {
		headers.Host = url
	}
	const options = {
		uri: `http://${url}${queryDetail}`,
		headers
	}

	return rp(options)
		.then(body => {
			if (body.includes('错误')) {
				return (res = {
					code: 500,
					msg: '获取失败，请重新登录'
				})
			} else {
				const { spider } = data
				let res
				switch (spider) {
					// 选中/取消选修课
					case 'checkCancelxxk':
						res = checkCancelxxk(body)
						break
					// 单科成绩查询
					case 'singleScore':
						res = singleScore(body)
						break
					// 查询所有可选的选修课
					case 'selectElective':
						res = selectElective(body)
						break

					default:
						break
				}
				return res
			}
		})
		.catch(err => {
			console.log('出现异常', err)
			return (res = {
				code: 500,
				msg: '网络错误或其他异常'
			})
		})
}
