const rp = require('request-promise')
const cheerio = require('cheerio')

exports.getScore = async (data, url) => {
	const { sessionid } = data

	const headers = {
		'content-type': 'application/x-www-form-urlencoded',
		Cookie: sessionid
	}
	const options = {
		method: 'POST',
		url: `${url}/xszqcjglAction.do?method=queryxscj`,
		headers,
		body: `where2=+1%3D1++and+%28a.xh+like+%5E%25%25%5E+%29&OrderBy=&keyCode=%23%21%40RnUFawQyEC0GYQV9VWVFKl83UGVDJVc4VT0QLg%3D%3D&isOutJoin=false&PageNum=1&oldSelectRow=&isSql=true&beanName=&printPageSize=15&key=%23%21%40RnUFawQyEC0GYQV9VWVFKl83UGVDJVc4VT0QLg%3D%3D&ZdSzCodeValue=&ZdSzValueTemp=&ZDSXkeydm=&PlAction=`
	}

	const score_arr = []
	const washData = body => {
		const $ = cheerio.load(body)
		$('#mxh tr').each((i, value) => {
			const getTxt = num =>
				$(value)
					.children()
					.eq(num)
					.text()
			const $_detail = cheerio.load(value)
			const detail = $_detail('a').attr('onclick')
			// 获取整条字符串
			let queryDetail = detail.split("'")[1]
			// 将最后的成绩删除，因为成绩可能为优良中，需要转义
			queryDetail = queryDetail.slice(0, queryDetail.lastIndexOf('='))
			// 分类，如通识教育课程
			// sort: getTxt(7)
			score_arr.push({
				term: getTxt(3),
				course: getTxt(4),
				score: getTxt(5),
				hour: getTxt(9),
				credit: getTxt(10),
				makeup: getTxt(11) == '正常考试' ? false : true,
				queryDetail
			})
		})
	}

	return rp(options)
		.then(async body => {
			if (body.includes('错误')) {
				return (res = {
					code: 401
				})
			} else {
				const $ = cheerio.load(body)
				washData(body)

				const all_credit = $('#tblBm td span')['0'].children[0].data
				const start = body.indexOf('"1/') + 3
				const pageNums = body.charAt(start)
				const rp_arr = []
				for (let i = 2; i <= pageNums; i++) {
					const options_arr = {
						...options,
						body: `where2=+1%3D1++and+%28a.xh+like+%5E%25%25%5E+%29&OrderBy=&keyCode=%23%21%40RnUFawQyEC0GYQV9VWVFKl83UGVDJVc4VT0QLg%3D%3D&isOutJoin=false&PageNum=${i}&oldSelectRow=&isSql=true&beanName=&printPageSize=15&key=%23%21%40RnUFawQyEC0GYQV9VWVFKl83UGVDJVc4VT0QLg%3D%3D&ZdSzCodeValue=&ZdSzValueTemp=&ZDSXkeydm=&PlAction=`
					}
					rp_arr.push(rp(options_arr))
				}
				await Promise.all(rp_arr).then(result => {
					result.forEach(element => washData(element))
				})
				return (res = {
					code: 200,
					score: {
						score_arr,
						all_credit
					}
				})
			}
		})
		.catch(err => {
			console.log('网络错误', err)
			return (res = {
				code: 401
			})
		})
}
