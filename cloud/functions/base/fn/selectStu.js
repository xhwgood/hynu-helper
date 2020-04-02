const rp = require('request-promise')
const cheerio = require('cheerio')

exports.selectStu = async (data, url) => {
	const { sessionid, type, value, PageNum, username } = data

	let printHQL = `%23%21@RjYFNARvEHIGYwUnVSZFOF90UGJDJFcwVWUQZAMmS2FRYhJ3BjEFMxF%2BBzVXKFIvSmFSYFQzQiVX%0D%0AZwdzFjNeb0ZpBSkRZQcwBDMQdlU3UHtdfUcoVixVeEI5BTsBJEtwU34SIgZsEHoGYwV%2FQmlSL183%0D%0AUGZDO1diVT4QZgMmXHZGdQdkESYHMRE5ByNXfEUuXWNSfFQPQh9XXwdUFiFef1FiEncELRBmBnMQ%0D%0APlV3UHVKc1AhViBVekIwBTUBNks%2BUzoFKREmBTMReQc1Qj9SPF90RytUZlcsVT4QMgNuXDRGKwc3%0D%0ABi8QbQR7ECtVZUVsXX1SY0MkVSxXMgcqFiZeZFFfEkwECgcJETcFNUJjUjhKf1ByVnhCZlVkBW4B%0D%0AbEsjU3AFKRFlBTIGMRB2VzVFTV0PR0xUC1dsQiYHOwMqXCVGKgcmBnUQcgRwB3FCe1A6SntQPEM1%0D%0AVXhXLBAuAQReZVFyEjwEeQdkEW8FMVUmRS9faUdlVHhCb1UwBScWKVwrUzQFPBErBXoGcxB2VzVS%0D%0AZ0ojUn5DbVVgQi4HUANUSxtRWwc%2FBmQQcQR2B3FCflAgXXFHIFZyQjVVPhAlATVeaUZlBSkEcAcw%0D%0AESAFY1U3RWBff1AhQyVXN0JzB2wWa1xqUz4SZgZ5BXEGMBB3VzRSZko8UihUcUIlV2cQegFtS3tR%0D%0ANgduEW4HcwQyB2ZCIVBkXStHPVZzVTJCcgVvFnpcbEYhBVwECRAeBgkFP1VjRSZfc1ByQ3pXdVUg%0D%0AEC8DLEsyUTgSKQZoBWwRNwcpV3xSZ0omUnBUekJtV2YHaRZrXmhGKwVxEW4HeAQyEHJVKFAtXX1H%0D%0AdVY0VWtCJwViASRLYVNgEnEGMRAmBi4FMUJ7UjVfb1ByQxhXClVdEEMDMlxgRiMHJxE2B28RYgcl%0D%0AV2FFMl0lUjpUbUJ8VzgHfRYhXn9RYhJ3BG0QcwYgECxVflBlSiNQPFZkVSJCLAUxAXxLeFMoBWER%0D%0AJwVsEXMHf0J7Ui9fN0d0VGxXZFU9EC4DY1x9RjYHYwY2ECcEMxBoVWxFOF01UmFDe1VmVz8HORZG%0D%0AXg1RchJmBCMHIBEeBT9CdFIxSmZQclZvQmBVIAU6AS5LMlM6BT4RfwVsBiAQLFd8RXBdNEdlVGhX%0D%0AeEJzB2wDflxqRisHcwZrEG8EMgdgQj9QP0pqUGJDJFVrVzIQdwE2Xn9RYhJ3BG0HZBE5BSlVf0Uo%0D%0AXydHSFQIQjVVdAV%2FFmtcDFM8BTQRcAV2BiAQKVdxUiNKd1IiQzVVaEIsBzQDMEsyUSoHKwYxECQE%0D%0AMgdgQjFQLV02R3RWIEJ6VToQagEkXjRGdAV%2FBHsHeBEnBWBVNkVxX25QNkMoV3hCMAdtFnxcNVNh%0D%0AEmgGeAV6BnMQLlcJUl1KG1JZVHVCfVczEDgBOUsyUWMHbhEnBw0ECAdYQhhQdV1qRzdWZFVnQjEF%0D%0AfxYpXHxGZQUpBDAQJgYuBTdVcUUoXydQM0NmV2NVeBBqAzRLalFiEncGbwVmETkHOld3UjlKdlJw%0D%0AVGZCcFclBz4WZ14nRi8FKREmBzEEbBAiVShQL118Ry1WIFVjQjAFPAFwSzJTKBI%2BBjEQIwYuBTFC%0D%0AeVJ3X2ZQIUN2`
	if (username.includes('N')) {
		printHQL = `%23%21@QzhcMAU4EnJVMwcrUyBLbgAlAWJEcVY0BWUVPlcpSzZUbEtzB2YHM0IuBTlRLlx5FTADYFNmQyEH%0D%0AZwIpQjxeOENnXC0QMgUwV2MSelMxXi0CLBYoUXlUfBI5AGFVK0snVnBLJgc7EnpVMwdzRG9ceQBm%0D%0AAWZEblZmBT4VPFcpXCFDe15gEHEFMUJpBS9Rekt4AjIDfFNaQxsHXwIOQi5eKFRsS3MFehJmVSMS%0D%0AMlNxXiMVIgEhUXVUfhIwAG9VOUtpVjRcLRBxBzNCKQU5RDlcagAlFitTM1YoBT4VaFdhXGNDJV4z%0D%0AB3gSbVcrEidTY0s6AiwDY0RxVCgHMgJwQileM1RRS0gFXQUJQmcHOURlXG4VLgFyUS1DYgVkADRV%0D%0AY0t0Vn5cLRAyBzJVYRJ6UTNLGwJeFkxTXlZoEiYCYVclXHJDJF4iByISclcgBX1EfV5sFSoBPERg%0D%0AVHwHLBV0VQteMlR8SzgFLgVkQj8HPVMgS3kAOBZlUy1DawUwAH1CJlx8VjpcOBB8B3pVIxJ6UTNc%0D%0AMRVyA35EOFRkEi4CCldbS0xUVV47BzMScVcmBX1EeF52AiAWIFEnQzEFPhV%2FVTpePkNrXC0FJwUw%0D%0AQnAHb1MxSzYALgEhRHBWMxJzAjZCZFw9VjBLYgcuB3FVYBJ7UTJcMBVtAyhTJEMhB2cVIFViSyxU%0D%0AOF5qEDkFc1diBWpEJ14yAnoWPVEmVDYScgA1QnVcO0MvXFgFXhIeVVkHM1NlS3AAIgFyRC9WcQUg%0D%0AFXVXI0tlVDZLLQc%2FB2xCZwUlUXpcMRV3A3BTL0NpB2YCM0JkXj9DJVx1EDkFeFdiEn5TLl57AiwW%0D%0AdVFhVG8SJwA4VStLNlZuS3UHZhImVX4HPUR9XGMAPgFyRE1WDgVdFRlXPVw3Qy1eIxBhBW9CMgUp%0D%0AUWdLZAJ0AzpTOEN4BzgCJ0IuXihUbEtzBToSc1VwEiBTeF4zFXIBPFExVCYSLABrVXNLL1YmXGUQ%0D%0AcAdsQiMFc0R9XHkAZhZ0UzlWYAU9FXRXbFwqQzheZwdhEidXYxJkU2pLbgJkA2FELlRiBz8CY0JJ%0D%0AXlpUfEtiBXQFIEJOBzNEclxnFTcBclE6Q2QFIABgVSFLZVY0XDoQKAdsVXASIFF6SyYCZRZlUz1W%0D%0AfBJzAjZXcVw9QyVedwc8Em9XYgVsRDleaRU7AWJEcVRvBzIVLVU5XihUbEtzBToFZEJpByVTeUt%2B%0D%0AAHYWSFNdQzEFdAAlQmRcW1YyXDAQJwd2VXASJVF3XHUVJgMiRGBUbBIsAm5XP0tlVCReLwdmEiRX%0D%0AYgVsRDdeewJnFnRRdUN%2BBToVMFUrXmNDelx7BSwFeEJ3B2xTMEsnAD8BNkR9VnwSMAI3QnNcYlZv%0D%0AS2wHLwd6VSMSIlEPXAsVSgNZUyBDeQczFWJVNktlVG1eahBwBQ1XWAVURB5eIwI7FjdRMVRjEjEA%0D%0AJUImXCtDa1wtBWcSJlV%2BBztTd0t%2BAHYBM0QzVmcFeBUwVztLPVRsS3MHOAdmQmkFNlFxXG8VJwNw%0D%0AUzNDdAclAmRCaF5wQyFcLRBxBTFXPBIuUy5eeQItFi1RdVRnEjAAZlV%2FS2VWJks6B2YSI1V%2BBz1E%0D%0Af1whADcBIUQj`
	}
	const headers = {
		'content-type': 'application/x-www-form-urlencoded',
		Cookie: sessionid
	}
	const options = {
		method: 'POST',
		url: `${url}/ggxx/selectStu_xsxx.jsp`,
		headers,
		body: `Field1=xs0101.${type}&HH1=like&SValue1=${value}&AndOr1=and&Field2=xs0101.xh&HH2=like&SValue2=&where1=null&where2=+1%3D1++and+%28xs0101.${type}+like+%5E%25${value}%25%5E+%29&OrderBy=&PageNum=${PageNum}&printHQL=${printHQL}`
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
					const getTxt = num =>
						$(value)
							.children()
							.eq(num)
							.text()

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
			}
			return (res = {
				code,
				msg,
				data: {
					numPages,
					people
				}
			})
		})
		.catch(err => {
			console.log('网络错误', err)
			return (res = '网络错误或其他异常')
		})
}
