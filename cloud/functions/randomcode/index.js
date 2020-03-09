const axios = require('axios')

// 云函数入口函数
exports.main = async (e, context) => {
	let base64
	let sessionid

	return await axios('http://59.51.24.46/hysf/verifycode.servlet', {
		responseType: 'arraybuffer'
	})
		.then(body => {
			base64 =
				'data:image/jpg;base64,' + Buffer.from(body.data).toString('base64')
			sessionid = body.headers['set-cookie'][0].slice(0, 43)

			return {
				base64,
				sessionid
			}
		})
		.catch(err => console.log('出错了！', err))
}
