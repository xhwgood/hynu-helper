// @ts-check
const rp = require('request-promise')
const {
	checkCancelxxk,
	singleScore
} = require('./spider/easy-query/easy-spider')
const { selectElective } = require('./spider/easy-query/selectElective')
/**
 * @param {{
 *  sessionid: string
 *  queryDetail: string
 *  spider: string
 * }} data 
 * @param {string} host
 */
exports.easyQuery = async (data, host) => {
	const { sessionid, queryDetail } = data
	const headers = {
		Cookie: sessionid
	}
	if (data.spider == 'selectElective') {
		headers.Host = host
	}
	const options = {
		uri: `http://${host}${queryDetail}`,
		headers
	}

	return rp(options)
		.then(body => {
			if (body.includes('错误')) {
				return {
					code: 500,
					msg: '获取失败，请重新登录'
				}
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
			// sessionid 过期，可能会走这里
			console.log('出现异常', err)
			return {
				code: 401,
				msg: '登录状态已过期'
			}
		})
}
