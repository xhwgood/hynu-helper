const rp = require('request-promise')
const { getJxpj } = require('./spider/only-sid/getJxpj')
const { getElective } = require('./spider/only-sid/getElective')

exports.onlySid = async (data, url) => {
	const { sessionid } = data

	const { spider } = data
	let uri
	switch (spider) {
		case 'getJxpj':
			uri = `${url}/jiaowu/jxpj/jxpjgl_queryxs.jsp`
			break
		case 'getElective':
			uri = `${url}/xkglAction.do?method=xsxkXsxk`
			break

		default:
			break
	}

	const headers = {
		Cookie: sessionid
	}
	const options = {
		uri,
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
				let res
				switch (spider) {
					// 教学评价
					case 'getJxpj':
						res = getJxpj(body)
						break
					// 选修课阶段查询
					case 'getElective':
						res = getElective(body)
						break

					default:
						break
				}
				return res
			}
		})
		.catch(err => {
			console.log('出现异常', err)
			return {
				code: 401
			}
		})
}
