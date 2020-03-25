const rp = require('request-promise')
const cheerio = require('cheerio')

exports.getScore = async (data, url) => {
	const { sessionid, PageNum, OrderBy, value } = data
	console.log(data)

	const headers = {
		'content-type': 'application/x-www-form-urlencoded',
		Cookie: sessionid
	}

	const options = {
		method: 'POST',
		url: `${url}/xszqcjglAction.do?method=queryxscj`,
		headers,
		body: `Field1=a.xh&HH1=like&SValue1=${value}&AndOr1=and&Field2=a.xh&HH2=like&SValue2=&where1=null&where2=+1%3D1++and+%28a.xh+like+%5E%25${value}%25%5E+%29&OrderBy=${OrderBy}&keyCode=%23%21%40RnUFawQyEC0GYQV9VWVFKl83UGVDJVc4VT0QLg%3D%3D&isOutJoin=false&PageNum=${PageNum}&oldSelectRow=&isSql=true&beanName=&printPageSize=10&key=%23%21%40RnUFawQyEC0GYQV9VWVFKl83UGVDJVc4VT0QLg%3D%3D&ZdSzCodeValue=&ZdSzValueTemp=&ZDSXkeydm=&PlAction=`
	}

	return rp(options)
		.then(body => {
			let msg
			// const end = body.indexOf('</table>', 7474) + 8
			const $ = cheerio.load(body)
			const score_arr = []
			$('#mxh tr').each((i, value) => {
				const getTxt = num =>
					$(value)
						.children()
						.eq(num)
						.text()
				const $_detail = cheerio.load(value)
				const detail = $_detail('a').attr('onclick')
				const queryDetail = detail.split("'")[1]

				score_arr.push({
					term: getTxt(3),
					course: getTxt(4),
					score: getTxt(5),
					sort: getTxt(7),
					hour: getTxt(9),
					credit: getTxt(10),
					makeup: getTxt(11) == '正常考试' ? false : true,
					queryDetail
				})
			})

			const start = body.indexOf('"1/', -1) + 3
			const page_end = body.indexOf('\\', start)
			if (!score_arr.length) {
				msg = '没有更多数据'
			}
			const pageNums = body.slice(start, page_end)
			return (res = {
				code: 200,
				msg,
				score: {
					score_arr,
					pageNums
				}
			})
		})
		.catch(err => {
			console.log('网络错误', err)
			return (res = '网络错误或其他异常')
		})
}
