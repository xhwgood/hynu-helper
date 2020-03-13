const rp = require('request-promise')
const cheerio = require('cheerio')

exports.getJxpj = async (data, url) => {
	const { sessionid } = data

	const headers = {
		Cookie: sessionid
	}

	const options = {
		uri: `${url}/jiaowu/jxpj/jxpjgl_queryxs.jsp`,
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
				$ = cheerio.load(body)
				// 学年学期，第一项为空
				const three = $('select')['0'].children.slice(1, 4)
				const arr_xnxq = []
				three.forEach(e => {
					const item = e.attribs.value
					item && arr_xnxq.push(item)
				})
				// 评价批次名称
				const pcname_child = $('select')['1'].children[1]
				const arr_pcname = []
				arr_pcname.push({
					id: pcname_child.attribs.value,
					name: pcname_child.children[0].data
				})
				// 评价课程类别
				const courseCategory = []
				const courseCategories = $('select')['3'].children.slice(1)
				console.log(courseCategories[0].attribs.value)
				courseCategories.forEach(e => {
					courseCategory.push({
						id: e.attribs.value,
						name: e.children[0].data
					})
				})
				return (res = {
					code: 200,
					msg: '获取成功',
					arr_xnxq,
					arr_pcname,
					courseCategory
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
