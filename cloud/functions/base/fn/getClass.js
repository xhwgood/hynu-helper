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
								const placeAndSec = wl.text() // 有周、节次、地点
					
								let place
								if (name.includes('体育')) {
									place = '暂无教室'
								} else {
									place = wl['1'].children[0].next.data
								}
					
								const section = /^.*\[(.*)\].*/.exec(placeAndSec)[1].replace(/-|节/g, '')
					
								const reg = /(\d{1,2})-(\d{1,2})/
								function toArray(str) {
									let a = []
									if (str.includes('-')) {
										// 若是几周范围内上课
										const b = reg.exec(str)
										const b1 = Number(b[1])
										const b2 = Number(b[2])
										if (str.includes('单')) {
											// 若是单周才上课
											for (let i = b1; i <= b2; i++) {
												if (i % 2 == 1) {
													a.push(i)
												}
											}
										} else if (str.includes('双')) {
											// 若是双周才上课
											for (let i = b1; i <= b2; i++) {
												if (i % 2 == 0) {
													a.push(i)
												}
											}
										} else {
											// 范围内所有周都上课
											for (let i = b1; i <= b2; i++) {
												a.push(i)
											}
										}
									} else {
										// 若是单个数字
										a.push(Number(str))
									}
									return a
								}
					
								let week = []
					
								let weekTest = wl['0'].children[0].data.trim() // 有周、节、地点
								let weekTemp = weekTest.slice(0, weekTest.indexOf('[')).replace('周', '')
								let regStr = weekTemp.split(/,/) // 用逗号分割，如'2-4,6-16'
					
								let temp = toArray(regStr[0])
								week.push(...temp)
					
								if (regStr[1]) {
									// 如果有第二项
									temp = toArray(regStr[1])
									week.push(...temp)
								}
					
								if (wl.length > 3) {
									// 如果上课周不是连续的，那么此处还要继续加
									weekTest = wl['2'].children[0].data.trim()
									weekTemp = weekTest.slice(0, weekTest.indexOf('[')).replace('周', '')
									regStr = weekTemp.split(/,/)
									temp = toArray(regStr[0])
									week.push(...temp)
					
									if (regStr[1]) {
										temp = toArray(regStr[1])
										week.push(...temp)
									}
								}
					
								let teacher
								if (place.includes('无')) {
									teacher = '暂无教师'
								} else {
									teacher = $(`#${i}-${j}-2`)['0'].children[3].next.data
								}
					
								// 二维数组
								// const course = { name, place, week, section, teacher }
								// // 周日重复的美术课则不再插入数组
								// if (section != '0204') {
								// 	myClass[`${j - 1}`].push(course)
								// }
								// 一维数组
								const course = { name, place, week, section, teacher, day: `${j}` }
								// 周日重复的美术课则不再插入数组
								if (section != '0204') {
									myClass.push(course)
								}
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
