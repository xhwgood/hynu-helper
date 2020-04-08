const rp = require('request-promise')
const cheerio = require('cheerio')

exports.allSelected = async (data, url) => {
	const { sessionid } = data

	const headers = {
		Cookie: sessionid
	}
	const options = {
		url: `${url}/xkglAction.do?method=toFindxsyxkc&xnxq01id=2019-2020-2&zzdxklbname=1&jx0502zbid=35`,
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
				const $ = cheerio.load(body)
				const selected = []
				$('#mxh tr').each((i, value) => {
					const getTxt = num =>
						$(value)
							.children()
							.eq(num)
							.text()
							.trim()
					const name = getTxt(4)
					// 测试用
					// const name = '著作权'
					const jwc_arr = [
						'国学智慧',
						'婚姻家庭法',
						'口才艺术与社交礼仪',
						'美术鉴赏',
						'商标法素质课',
						'食品安全与日常饮食',
						'书法鉴赏',
						'宋崇导演教你拍摄微电影',
						'网络环境下的知识产权保护',
						'文学作品欣赏',
						'学术基本要素：专业论文写作',
						'移动互联网时代的信息安全与防护',
						'音乐鉴赏',
						'影视鉴赏',
						'知识产权法律基础',
						'中华传统文化中的音乐故事',
						'中外比较文学研究专题',
						'著作权',
						'专利代理实务素质课',
						'专利信息检索',
						'魅力科学'
					]
					for (let i in jwc_arr) {
						if (name == jwc_arr[i]) {
							let time = getTxt(9)
							time = `每周${time.charAt(0)} ${time.charAt(2)}~${time.charAt(
								6
							)}节`
							const $_detail = cheerio.load(value)
							const detail = $_detail('a').attr('onclick')
							const queryDetail = detail.split("'")[1]
							selected.push({
								classID: queryDetail,
								name,
								from: getTxt(5),
								teacher: getTxt(7),
								week: getTxt(8),
								time,
								mySelected: true
							})
							break
						}
					}
				})
				let msg = '没有已选的选修课'
				if (selected.length) {
					msg = null
				}

				return (res = {
					code: 200,
					selected,
					msg
				})
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
