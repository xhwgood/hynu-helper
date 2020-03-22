const rp = require('request-promise')
const cheerio = require('cheerio')

exports.selectStu = async (data, url) => {
	const { sessionid, type, value, PageNum } = data
	console.log(data)

	const headers = {
		'content-type': 'application/x-www-form-urlencoded',
		Cookie: sessionid
	}

	const options = {
		method: 'POST',
		url: `${url}/ggxx/selectStu_xsxx.jsp`,
		headers,
		body: `Field1=xs0101.${type}&HH1=like&SValue1=${value}&AndOr1=and&Field2=xs0101.xh&HH2=like&SValue2=&where1=null&where2=+1%3D1++and+%28xs0101.${type}+like+%5E%25${value}%25%5E+%29&OrderBy=&keyCode=%23%21@RnUFawQzEC0GeAUgVTZFcV83UGNDfFdkVXgQeANkSyNRaBI%2BBmw%3D&isOutJoin=false&PageNum=${PageNum}&oldSelectRow=&printHQL=%23%21@RjYFNARvEHIGYwUnVSZFOF90UGJDJFcwVWUQZAMmS2FRYhJ3BjEFMxF%2BBzVXKFIvSmFSYFQzQiVX%0D%0AZwdzFjNeb0ZpBSkRZQcwBDMQdlU3UHtdfUcoVixVeEI5BTsBJEtwU34SIgZsEHoGYwV%2FQmlSL183%0D%0AUGZDO1diVT4QZgMmXHZGdQdkESYHMRE5ByNXfEUuXWNSfFQPQh9XXwdUFiFef1FiEncELRBmBnMQ%0D%0APlV3UHVKc1AhViBVekIwBTUBNks%2BUzoFKREmBTMReQc1Qj9SPF90RytUZlcsVT4QMgNuXDRGKwc3%0D%0ABi8QbQR7ECtVZUVsXX1SY0MkVSxXMgcqFiZeZFFfEkwECgcJETcFNUJjUjhKf1ByVnhCZlVkBW4B%0D%0AbEsjU3AFKRFlBTIGMRB2VzVFTV0PR0xUC1dsQiYHOwMqXCVGKgcmBnUQcgRwB3FCe1A6SntQPEM1%0D%0AVXhXLBAuAQReZVFyEjwEeQdkEW8FMVUmRS9faUdlVHhCb1UwBScWKVwrUzQFPBErBXoGcxB2VzVS%0D%0AZ0ojUn5DbVVgQi4HUANUSxtRWwc%2FBmQQcQR2B3FCflAgXXFHIFZyQjVVPhAlATVeaUZlBSkEcAcw%0D%0AESAFY1U3RWBff1AhQyVXN0JzB2wWa1xqUz4SZgZ5BXEGMBB3VzRSZko8UihUcUIlV2cQegFtS3tR%0D%0ANgduEW4HcwQyB2ZCIVBkXStHPVZzVTJCcgVvFnpcbEYhBVwECRAeBgkFP1VjRSZfc1ByQ3pXdVUg%0D%0AEC8DLEsyUTgSKQZoBWwRNwcpV3xSZ0omUnBUekJtV2YHaRZrXmhGKwVxEW4HeAQyEHJVKFAtXX1H%0D%0AdVY0VWtCJwViASRLYVNgEnEGMRAmBi4FMUJ7UjVfb1ByQxhXClVdEEMDMlxgRiMHJxE2B28RYgcl%0D%0AV2FFMl0lUjpUbUJ8VzgHfRYhXn9RYhJ3BG0QcwYgECxVflBlSiNQPFZkVSJCLAUxAXxLeFMoBWER%0D%0AJwVsEXMHf0J7Ui9fN0d0VGxXZFU9EC4DY1x9RjYHYwY2ECcEMxBoVWxFOF01UmFDe1VmVz8HORZG%0D%0AXg1RchJmBCMHIBEeBT9CdFIxSmZQclZvQmBVIAU6AS5LMlM6BT4RfwVsBiAQLFd8RXBdNEdlVGhX%0D%0AeEJzB2wDflxqRisHcwZrEG8EMgdgQj9QP0pqUGJDJFVrVzIQdwE2Xn9RYhJ3BG0HZBE5BSlVf0Uo%0D%0AXydHSFQIQjVVdAV%2FFmtcDFM8BTQRcAV2BiAQKVdxUiNKd1IiQzVVaEIsBzQDMEsyUSoHKwYxECQE%0D%0AMgdgQjFQLV02R3RWIEJ6VToQagEkXjRGdAV%2FBHsHeBEnBWBVNkVxX25QNkMoV3hCMAdtFnxcNVNh%0D%0AEmgGeAV6BnMQLlcJUl1KG1JZVHVCfVczEDgBOUsyUWMHbhEnBw0ECAdYQhhQdV1qRzdWZFVnQjEF%0D%0AfxYpXHxGZQUpBDAQJgYuBTdVcUUoXydQM0NmV2NVeBBqAzRLalFiEncGbwVmETkHOld3UjlKdlJw%0D%0AVGZCcFclBz4WZ14nRi8FKREmBzEEbBAiVShQL118Ry1WIFVjQjAFPAFwSzJTKBI%2BBjEQIwYuBTFC%0D%0AeVJ3X2ZQIUN2&sqlString=%23%21@RjYFNARvEHIGYwUnVSZFOF90UGJDJFcwVWUQZAMmS2FRYhJ3BjEFMxF%2BBzVXKFIvSmFSYFQzQiVX%0D%0AZwdzFjNeb0ZpBSkRZQcwBDMQdlU3UHtdfUcoVixVeEI5BTsBJEtwU34SIgZsEHoGYwV%2FQmlSL183%0D%0AUGZDO1diVT4QZgMmXHZGdQdkESYHMRE5ByNXfEUuXWNSfFQPQh9XXwdUFiFef1FiEncELRBmBnMQ%0D%0APlV3UHVKc1AhViBVekIwBTUBNks%2BUzoFKREmBTMReQc1Qj9SPF90RytUZlcsVT4QMgNuXDRGKwc3%0D%0ABi8QbQR7ECtVZUVsXX1SY0MkVSxXMgcqFiZeZFFfEkwECgcJETcFNUJjUjhKf1ByVnhCZlVkBW4B%0D%0AbEsjU3AFKRFlBTIGMRB2VzVFTV0PR0xUC1dsQiYHOwMqXCVGKgcmBnUQcgRwB3FCe1A6SntQPEM1%0D%0AVXhXLBAuAQReZVFyEjwEeQdkEW8FMVUmRS9faUdlVHhCb1UwBScWKVwrUzQFPBErBXoGcxB2VzVS%0D%0AZ0ojUn5DbVVgQi4HUANUSxtRWwc%2FBmQQcQR2B3FCflAgXXFHIFZyQjVVPhAlATVeaUZlBSkEcAcw%0D%0AESAFY1U3RWBff1AhQyVXN0JzB2wWa1xqUz4SZgZ5BXEGMBB3VzRSZko8UihUcUIlV2cQegFtS3tR%0D%0ANgduEW4HcwQyB2ZCIVBkXStHPVZzVTJCcgVvFnpcbEYhBVwECRAeBgkFP1VjRSZfc1ByQ3pXdVUg%0D%0AEC8DLEsyUTgSKQZoBWwRNwcpV3xSZ0omUnBUekJtV2YHaRZrXmhGKwVxEW4HeAQyEHJVKFAtXX1H%0D%0AdVY0VWtCJwViASRLYVNgEnEGMRAmBi4FMUJ7UjVfb1ByQxhXClVdEEMDMlxgRiMHJxE2B28RYgcl%0D%0AV2FFMl0lUjpUbUJ8VzgHfRYhXn9RYhJ3BG0QcwYgECxVflBlSiNQPFZkVSJCLAUxAXxLeFMoBWER%0D%0AJwVsEXMHf0J7Ui9fN0d0VGxXZFU9EC4DY1x9RjYHYwY2ECcEMxBoVWxFOF01UmFDe1VmVz8HORZG%0D%0AXg1RchJmBCMHIBEeBT9CdFIxSmZQclZvQmBVIAU6AS5LMlM6BT4RfwVsBiAQLFd8RXBdNEdlVGhX%0D%0AeEJzB2wDflxqRisHcwZrEG8EMgdgQj9QP0pqUGJDJFVrVzIQdwE2Xn9RYhJ3BG0HZBE5BSlVf0Uo%0D%0AXydHSFQIQjVVdAV%2FFmtcDFM8BTQRcAV2BiAQKVdxUiNKd1IiQzVVaEIsBzQDMEsyUSoHKwYxECQE%0D%0AMgdgQjFQLV02R3RWIEJ6VToQagEkXjRGdAV%2FBHsHeBEnBWBVNkVxX25QNkMoV3hCMAdtFnxcNVNh%0D%0AEmgGeAV6BnMQLlcJUl1KG1JZVHVCfVczEDgBOUsyUWMHbhEnBw0ECAdYQhg%3D&isSql=true&beanName=&printPageSize=10&key=%23%21@RnUFawQzEC0GeAUgVTZFcV83UGNDfFdkVXgQeANkSyNRaBI%2BBmw%3D&field=%23%21@RowFngS8ENkG1AXpVclF9V89UGtDL1cxVW4QewNrSyJRaBI%2BBjIFMxE5BzVXc1I6SnFSfFTLQtpX%0D%0A6QeTFo9e7Ub5BecRLAc3BDgQd1U8UG1dNUd%2FVmpVekJzBW4BMkt2U34SLQZyEHkGZAV%2FQthSmF%2B4%0D%0AUJxDwleoVYYQ%2FwNkXD1GfwdiESwHMREnB2FXPkUqXX1SYFQzQntXMgdzFjFeflE%2FEiUELxDeBs8Q%0D%0A%2BVXIUOVK8lDuVrZVOEJ3BWUBbUsoU2EFZBEmBTgRbwcpQiFSY18pRydUaFcsVYUQ7QOXXP9GlQeG%0D%0ABsIQ7AQ4EHRVPEVxXT9SYUMlVTJXbAclFjheN1FjEnYEMgcuEW8FPg%3D%3D&totalPages=5090&ZdSzCode=&ZdSzCodeValue=&ZdSzValueTemp=&ZDSXkeydm=&PlAction=&tableFields=%E4%B8%8A%E8%AF%BE%E9%99%A2%E7%B3%BB%3A9%3A1%3A150%3Ax31.dwmc%2C%E4%B8%8A%E8%AF%BE%E5%B9%B4%E7%BA%A7%3A7%3A1%3A80%3Ajx01nd.ksnd%2C%E4%B8%8A%E8%AF%BE%E4%B8%93%E4%B8%9A%3A8%3A1%3A100%3Ajx01nd.zymc%2C%E4%B8%8A%E8%AF%BE%E7%8F%AD%E7%BA%A7%3A4%3A1%3A150%3Axx04.bj%2C%E5%AD%A6%E7%94%9F%E5%A7%93%E5%90%8D%3A2%3A1%3A100%3Axs0101.xm&otherFields=null`
	}

	return rp(options)
		.then(body => {
			let people = []
			let msg
			let numPages
			let code = 200
			if (!body.includes('出错页面')) {
				const end = body.indexOf('</table>', 3199) + 8
				const $ = cheerio.load(body.slice(3082, end))
				$('#mxh tr').each((i, value) => {
					function getTxt(num) {
						return $(value)
							.children()
							.eq(num)
							.text()
					}

					people.push({
						major: getTxt(3),
						name: getTxt(4)
					})
				})
				const start = body.indexOf('1/', -1) + 2
				const end_page = body.indexOf('\\', start)
				numPages = body.slice(start, end_page)
				if (!people.length) {
					msg = '没有查找到数据'
				}
			} else {
				code = 404
				console.log(res)
			}
			return {
				code,
				msg,
				data: {
					numPages,
					people
				}
			}
		})
		.catch(err => {
			console.log('网络错误', err)
			return (res = '网络错误或其他异常')
		})
}