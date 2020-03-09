const rp = require('request-promise')
const cheerio = require('cheerio')

exports.getClass = async (data, url) => {
	const { sessionid } = data

	const headers = {
		Cookie: sessionid
	}

	const options = {
		uri: `${url}/tkglAction.do?method=kbxxXs`,
		headers
	}

	return rp(options)
		.then(body => {
			if (body.includes('错误')) {
				return (res = {
					code: 500,
					msg: '获取课程失败，请重新登录'
				})
			} else {
				// 学年学期号
				const xnxqh = body.slice(6444, 6455)
				// 身份证
				const xsid = body.slice(6469, 6487)
				const options_end = {
					url: `${url}/tkglAction.do?method=goListKbByXs&xnxqh=${xnxqh}&xs0101id=${xsid}`,
					headers
				}

				const myClass = []
				return rp(options_end).then(body => {
					$ = cheerio.load(body)

					for (let i = 1; i < 6; i++) {
						for (let j = 1; j < 8; j++) {
							if (
								$(`#${i}-${j}-2`)
									.text()
									.includes('节')
							) {
								const name = $(`#${i}-${j}-1`)
									.text()
									.trim() // 取得课程名

								const wl = $(`#${i}-${j}-2 nobr`)
								const placeAndSec = wl.text() // 有周、节、地点

								let place
								if (name.includes('体育')) {
									place = '暂无教室'
								} else {
									place = wl['1'].children[0].next.data
								}

								const section = /^.*\[(.*)\].*/.exec(placeAndSec)[1]

								let week
								if (wl.length < 3) {
									const weekTest = wl['0'].children[0].data.trim() // 有周、节、地点 .trim()
									week = weekTest.slice(0, weekTest.indexOf('['))
								} else {
									let weekTest = wl['0'].children[0].data.trim() // 有周、节、地点 .trim()
									w1 = weekTest.slice(0, weekTest.indexOf('['))
									weekTest = wl['2'].children[0].data.trim() // 有周、节、地点 .trim()
									w2 = weekTest.slice(0, weekTest.indexOf('['))
									week = [w1, w2]
								}

								let teacher
								if (place.includes('无')) {
									teacher = '暂无教师'
								} else {
									teacher = $(`#${i}-${j}-2`)['0'].children[3].next.data
								}

								const course = {
									name,
									place,
									week,
									section,
									teacher,
									today: `${j}`
								}
								myClass.push(course)
							}
						}
					}

					return (res = {
						code: 200,
						msg: '获取课程成功',
						myClass
					})
				})
			}
		})
		.catch(err => {
			console.log('网络错误', err)
			return (res = {
				code: 500,
				msg: '网络错误或其他异常'
			})
		})
}
