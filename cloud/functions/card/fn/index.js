const c = require('./crypto-card')
const cheerio = require('cheerio')
const rp = require('request-promise')

const Time = c.getTime()

exports.getClass = async (data, url) => {
	const { UserNumber, oriPassword } = data
	const Password = c.cryptPwd(oriPassword)
  const Sign = c.cryptSign(Password, Time, UserNumber)

	const options = {
		method: 'POST',
		url: `${url}/LogIn.aspx`,
		body: `Time=${Time}&Sign=${Sign}&UserNumber=${UserNumber}&Password=${Password}`
	}

	return rp(options)
		.then(body => {
      $ = cheerio.load(body)
      const code=$('Code').html()
      if (code==1) {
        
      } else {
        
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
