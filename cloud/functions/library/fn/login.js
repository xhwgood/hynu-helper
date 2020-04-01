const rp = require('request-promise')
const cheerio = require('cheerio')
const crypto = require('crypto')

exports.login = async (data, url) => {
	const { rdid, password } = data
	const rdPasswd = crypto
		.createHash('md5')
		.update(password)
		.digest('hex')
	const options = {
		method: 'POST',
		url: `${url}/reader/doLogin`,
		form: {
			password: '',
			rdPasswd,
			rdid,
			returnUrl: ''
		}
	}

	return rp(options).catch(err => {
		if (err.statusCode == 302) {
			const Cookie = err.response.headers['set-cookie'][0].slice(0, 43)
			const headers = {
				Cookie
			}
			const options_space = {
				url: `${url}/reader/space`,
				headers
			}

			return rp(options_space)
				.then(body => {
					if (body.includes('错误')) {
						console.log('登录失败')
						return (res = {
							code: 601
						})
					} else {
						console.log('登录成功')
						$ = cheerio.load(body, { normalizeWhitespace: true })
						const obj = {}
						$('tr').each((i, value) => {
							const getTxt = num =>
								$(value)
									.children()
									.eq(num)
									.text()
									.replace(/[\r\n\t]/g, '')
							if (i == 2) {
								obj.validity = getTxt(0).slice(7)
								const arr = getTxt(1).split(/\s+/)
								obj.arrears = arr[1]
								obj.charge = arr[3]
							} else if (i == 4) {
								obj.canBorrow = getTxt(0).slice(10)
							}
						})
						const msgdata = $('.message')[0].children[0].data
						obj.borrowed = msgdata.charAt(0) != '对' ? msgdata : '无'

						return (res = {
							code: 200,
							obj,
							libSid: Cookie
						})
					}
				})
				.catch(err => {
					console.log('获取space错误', err)
					return (res = {
						code: 603
					})
				})
		}
	})
}
