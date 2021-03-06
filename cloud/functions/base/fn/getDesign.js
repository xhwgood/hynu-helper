// @ts-check
const rp = require('request-promise')
const cheerio = require('cheerio')
/**
 * @param {{
 *  sessionid: string
 *  pageNum: string
 * }} data 
 * @param {string} url 
 */
exports.getDesign = async (data, url) => {
	const { sessionid, pageNum } = data

	const headers = {
		'content-type': 'application/x-www-form-urlencoded',
		Cookie: sessionid
	}
	const options = {
		method: 'POST',
		url: `${url}/jiaowu/bysj/xt_list.jsp`,
		headers,
		body: `check_object_id=&check_object_name=&Field1=s.jb&HH1=like&SValue1=&AndOr1=and&Field2=s.jb&HH2=like&SValue2=&where1=&where2=null&OrderBy=&keyCode=%23%21@RnUFawQyEC0GcwU5VTdFcV83UGBDfFdk&isOutJoin=false&PageNum=${pageNum}&oldSelectRow=6&printHQL=%23%21@RjYFNARvEHIGYwUnVSZFM18pUCFDf1cxVWUQegNsS3tRNhJqBnIFLBF9BzNXKFIkSjxSO1R2QnhXNQdxFjNeKUYhBSYRewdjBC4QLFUoUC1daEdpVnpVdUJtBTsBMUt%2FUzMSagZyEDkGeAUrQmNSJF8rUHpDZldlVTgQLwM9XHFGZQcwEXkHdRF5ByVXLEUkXWxSI1R2QnxXOAc%2BFj9eJ1EmEmgEexBkBjAQd1U2UGRKe1A2VilVIkIlBS0BM0t%2FU3AFAhFcBTMRJgdhQiVSd19zR2VUdVdoVTEQOAM7XCVGMQd9BnIQfQQzEHdVNkVyXWxSNEM1VT9XdgcuFmVedFE4EncEMgcwESUFOkJ1UndKc1A8VmRCNVUgBXEBL0t0UygFKxE2BT8GJxB3VyNFaV19Rz9UcFdzQmMHfQNyXCVGZQcgBi8QfARgBylCYlAnSmFQckNmVXpXJBA5AXxeK1EhEmgEaAdiEW8FIFV0RTNfJ0cjVHBCelU5BX8WOFxvU2EFYBEmBTAGIBA1VyhSPUp1UmBDJFUyQnIHfQM0Sz5RKgcrBjEQJAQyB2BCMVAtXSlHP1Z6QnFVPhA5ASZecEZlBSsEdAcsEWQFOVU3RXFfN1BkQzVXc0J1B30WPFxtUzUSNAZkBSIGcxBoV35SM0p4UiNUa0JxV2sQIAFyS3hRNQdjEScHMAQzBzhCdVB9XS5HbFYgVWNCLQU7Fmtcb0ZrBTUEdBB%2FBj0FK1UoRThff1BiQyZXMFVlECMDOks6UXkSbwYhBWMReQc1VyRSJEo8UjpUYEIoVyUHaxZlXm1GJwVxEXcHbgRmEGZVLlB1XXZHa1Z4VWBCOQUmAXxLflM5Ei0GZBA3BicFdkIhUmNfNVBlQyBXOFVhEHkDa1w9RnMHZBEiB0YRIgdnV0ZFeV0yUmlUM0JWV2AHaRYJXkVRZhIDBDUQIgYyEARVI1BySjJQPVZyVSJCawV%2FAS9LPFMoBTMRbAV7ETcHOEJiUndfaUcwVG5XbFV0ECsDMFxhRmUHNgZ5EH4EcRAyVXVFYF0lUnhDZlVnVzoHOBYoXnNRchIsBHsHMBEmBT1CdVI%2BSnZQclZmQmdVOwUyAXxLeFMoBWERJwVsBmQQZlckRTddbUcgVHBXZUJjBzcDJlw1RnQHPQZlEDkEegcpQiFQZkoiUGNDfFVmV3YQdwF8XnRRfBI1BGgHeBFvBWNVNUVwXzZHLFRmQjVVNQUxFi9cJVM6BSkRJgUzBm4QIlcqUj1KalJgQyRVbEInBzQDOksyUW8HcwYmECcENgdjQiZQYF09R3BWM0IgVWwQfAFrXjNGAwVkBDUHQhEuBWRVP0VxX0RQZEMhV0JCAQdpFg5cM1NlEnQGQwUlBikQb1ctUndKc1I%2BVGZCNVczEDIBNUthUSYHIBE2BygEcQc0Qn1QMF1mRzFWIFUzQmMFORY5XGpGKAVxBGkQbwYwBWJVaEUkXydQKENsVyBVPRAkAzBLd1EgEmYGawVtEX4HP1ckUgRKWFJhVDNCJVdgB30WOF4nRioFPxE2B3oEexBoVW1QJl1rRyFWK1V4QjoFcQEkS2hTcBJ7BiEQZAYuBTlCc1J3X2ZQPENxVyBVJxBkAzpcdEYnBykRKwcnESYHdlckRTddbVI1VHBCcFd2BzcWM143UWMSKARnEH4GZBBmVTtQdUo1UGJWNFUwQnQFagFkSydTYwVkES4FNBEgB2VCV1JiXzFHB1Q7VzdVbRB7Ax1cM0ZxBxEGQxAjBEcQcFUzRXJdR1J3QzVVK1d2BzwWJV5jUXISMgRsB18RdAU7QnBSJUo6UCFWeUJmVTAFPgEoS3dTfAV2EW8FewZ5ED9XKUUNXUhHaFRmV2RCZAd0A2BcOEY2B2UGLxBvBHYHIEJiUCZKeFByQ3RVbFcyEGoBKF5oUQ0SJQRrB2ERZQV7VXVFOV90RyFUY0JhVTEFcxZsXHxTKQUoEW8FLwZNEAtXKVIzSnZSd0M8VT5CfgcuA2hLPFEqBycGaxBkBHEHO0IxUHVdZEcrVmRCNVU%2BEGQBJl5kRngFKwR0By4RcwU%2BVS5Fa18uUHJDdFduQicHfRY4XCtTGRIVBlYFRAZNEANXV1JqSjVSYVQlQjVXNxAkAThLMlEhB2UROAdkBHMHM0JrUGhdIkd0VidVIkJjBT4WJVxhRmUFIgQtEGQGagViVTdFcF81UDtDcVcgVToQJQMqSzJROxIoBiEFKhFkBzRXaFIySnFSJFQiQmZXYgdzFjhebUZ0BWARJgcyBGsQIlUmUDNdd0cqVm1VIkIwBTUBbUsjU2AScgYhEGQGNAVzQmZSP19iUCBDcFcgVScQfgNwXF1GFgdjEScHMBEmBxhXQEV9XSJSY1QxQiVXZQdlFnpeNlFrEn8ENBAnBjgQd1U2UGRKJVBjVjVVJUJqBX8BM0tgUzQFNBFkBSIRdQcoQjFSL18pRyFUdVdoVXQQKwMtXGZGaQdzBnIQOQRoECRVJkUkXWBSI0N2&sqlString=%23%21@RjYFNARvEHIGYwUnVSZFM18pUCFDf1cxVWUQegNsS3tRNhJqBnIFLBF9BzNXKFIkSjxSO1R2QnhX%0D%0ANQdxFjNeKUYhBSYRewdjBC4QLFUoUC1daEdpVnpVdUJtBTsBMUt%2FUzMSagZyEDkGeAUrQmNSJF8r%0D%0AUHpDZldlVTgQLwM9XHFGZQcwEXkHdRF5ByVXLEUkXWxSI1R2QnxXOAc%2BFj9eJ1EmEmgEexBkBjAQ%0D%0Ad1U2UGRKe1A2VilVIkIlBS0BM0t%2FU3AFAhFcBTMRJgdhQiVSd19zR2VUdVdoVTEQOAM7XCVGMQd9%0D%0ABnIQfQQzEHdVNkVyXWxSNEM1VT9XdgcuFmVedFE4EncEMgcwESUFOkJ1UndKc1A8VmRCNVUgBXEB%0D%0AL0t0UygFKxE2BT8GJxB3VyNFaV19Rz9UcFdzQmMHfQNyXCVGZQcgBi8QfARgBylCYlAnSmFQckNm%0D%0AVXpXJBA5AXxeK1EhEmgEaAdiEW8FIFV0RTNfJ0cjVHBCelU5BX8WOFxvU2EFYBEmBTAGIBA1VyhS%0D%0APUp1UmBDJFUyQnIHfQM0Sz5RKgcrBjEQJAQyB2BCMVAtXSlHP1Z6QnFVPhA5ASZecEZlBSsEdAcs%0D%0AEWQFOVU3RXFfN1BkQzVXc0J1B30WPFxtUzUSNAZkBSIGcxBoV35SM0p4UiNUa0JxV2sQIAFyS3hR%0D%0ANQdjEScHMAQzBzhCdVB9XS5HbFYgVWNCLQU7Fmtcb0ZrBTUEdBB%2FBj0FK1UoRThff1BiQyZXMFVl%0D%0AECMDOks6UXkSbwYhBWMReQc1VyRSJEo8UjpUYEIoVyUHaxZlXm1GJwVxEXcHbgRmEGZVLlB1XXZH%0D%0Aa1Z4VWBCOQUmAXxLflM5Ei0GZBA3BicFdkIhUmNfNVBlQyBXOFVhEHkDa1w9RnMHZBEiB0YRIgdn%0D%0AV0ZFeV0yUmlUM0JWV2AHaRYJXkVRZhIDBDUQIgYyEARVI1BySjJQPVZyVSJCawV%2FAS9LPFMoBTMR%0D%0AbAV7ETcHOEJiUndfaUcwVG5XbFV0ECsDMFxhRmUHNgZ5EH4EcRAyVXVFYF0lUnhDZlVnVzoHOBYo%0D%0AXnNRchIsBHsHMBEmBT1CdVI%2BSnZQclZmQmdVOwUyAXxLeFMoBWERJwVsBmQQZlckRTddbUcgVHBX%0D%0AZUJjBzcDJlw1RnQHPQZlEDkEegcpQiFQZkoiUGNDfFVmV3YQdwF8XnRRfBI1BGgHeBFvBWNVNUVw%0D%0AXzZHLFRmQjVVNQUxFi9cJVM6BSkRJgUzBm4QIlcqUj1KalJgQyRVbEInBzQDOksyUW8HcwYmECcE%0D%0ANgdjQiZQYF09R3BWM0IgVWwQfAFrXjNGAwVkBDUHQhEuBWRVP0VxX0RQZEMhV0JCAQdpFg5cM1Nl%0D%0AEnQGQwUlBikQb1ctUndKc1I%2BVGZCNVczEDIBNUthUSYHIBE2BygEcQc0Qn1QMF1mRzFWIFUzQmMF%0D%0AORY5XGpGKAVxBGkQbwYwBWJVaEUkXydQKENsVyBVPRAkAzBLd1EgEmYGawVtEX4HP1ckUgRKWFJh%0D%0AVDNCJVdgB30WOF4nRioFPxE2B3oEexBoVW1QJl1rRyFWK1V4QjoFcQEkS2hTcBJ7BiEQZAYuBTlC%0D%0Ac1J3X2ZQPENxVyBVJxBkAzpcdEYnBykRKwcnESYHdlckRTddbVI1VHBCcFd2BzcWM143UWMSKARn%0D%0AEH4GZBBmVTtQdUo1UGJWNFUwQnQFagFkSydTYwVkES4FNBEgB2VCV1JiXzFHB1Q7VzdVbRB7Ax1c%0D%0AM0ZxBxEGQxAjBEcQcFUzRXJdR1J3QzVVK1d2BzwWJV5jUXISMgRsB18RdAU7QnBSJUo6UCFWeUJm%0D%0AVTAFPgEoS3dTfAV2EW8FewZ5ED9XKUUNXUhHaFRmV2RCZAd0A2BcOEY2B2UGLxBvBHYHIEJiUCZK%0D%0AeFByQ3RVbFcyEGoBKF5oUQ0SJQRrB2ERZQV7VXVFOV90RyFUY0JhVTEFcxZsXHxTKQUoEW8FLwZN%0D%0AEAtXKVIzSnZSd0M8VT5CfgcuA2hLPFEqBycGaxBkBHEHO0IxUHVdZEcrVmRCNVU%2BEGQBJl5kRngF%0D%0AKwR0By4RcwU%2BVS5Fa18uUHJDdFduQicHfRY4XCtTGRIVBlYFRAZNEANXV1JqSjVSYVQlQjVXNxAk%0D%0AAThLMlEhB2UROAdkBHMHM0JrUGhdIkd0VidVIkJjBT4WJVxhRmUFIgQtEGQGagViVTdFcF81UDtD%0D%0AcVcgVToQJQMqSzJROxIoBiEFKhFkBzRXaFIySnFSJFQiQmZXYgdzFjhebUZ0BWARJgcyBGsQIlUm%0D%0AUDNdd0cqVm1VIkIwBTUBbUsjU2AScgYhEGQGNAVzQmZSP19iUCBDcFcgVScQfgNwXF1GFgdjEScH%0D%0AMBEmBxhXQEV9XSJSY1QxQiVXZQdlFnpeNlFrEn8ENBAnBjgQd1U2UGRKJVBjVjVVJUJq&sqlArgs=&isSql=true&beanName=&printPageSize=10&key=%23%21@RnUFawQyEC0GcwU5VTdFcV83UGBDfFdk&field=%23%21@RoEFuwS1EN8GOgViVTxFcV89UGdDJVc6VScQZAM0S3BRfhKPBukFvhHRB3lXxlKMStxSlFQrQtlX%0D%0AtAeZFvRePUZ3BWsRJwc6BDMQclU2UG9ddkdrVmtVdkIuBTwBcEvGU%2BoSiQa0EC0GMwVpQiBSbV8%2F%0D%0AUGJDL1d4VXoQLgMpXGhGJgd%2FEcAHuBGiB%2B1XxEWPXc9S9lQ4QiFXbAdsFnFeP1FiEnwEaRA5BngQ%0D%0AK1UqUINKolDhVsZVOEJ2BWUBbUsoU2gFYREsBXEROQc4QmJSIF9hRyhUZ1dzVXgQhQOAXNRG5Aeb%0D%0ABsoQ3QT%2FEHxVMEV6XTRSakMtVTJXbAcuFmVef1EqEjQEcAcsEcYF8kLHUodK2lCZVspC6FVuBWgB%0D%0AZksjU2oFZhEmBTgGeBA8V3ZFM10pR%2FpUy1exQusHlQOVXM9GuAeaBs4Q2ATcB2tCKFBvSiNQaEMt%0D%0AVTJXbBA5AXJebFEwEj4EcAdyEWQ%3D&totalPages=16&ZdSzCode=&ZdSzCodeValue=&ZdSzValueTemp=&ZDSXkeydm=&PlAction=&tableFields=%E5%B9%B4%E5%BA%A6%3A1%3A1%3A50%3As.jb%2C%E8%AE%BE%E8%AE%A1%28%E8%AE%BA%E6%96%87%29%E9%A2%98%E7%9B%AE%3A2%3A1%3A140%3As.ktmc%2C%E9%99%A2%E7%B3%BB%3A3%3A1%3A80%3Ax.dwmc%2C%E6%8C%87%E5%AF%BC%E8%80%81%E5%B8%88%3A4%3A1%3A80%3Aj.xm%2C%E8%81%8C%E7%A7%B0%3A5%3A1%3A80%3As.iswfmes%2C%E9%99%90%E9%80%89%E4%BA%BA%E6%95%B0%3A6%3A1%3A80%3As.xxrs%2C%E9%80%89%E4%B8%AD%E4%BA%BA%E6%95%B0%3A7%3A1%3A70%3Axzrs%2C%E5%8F%AF%E6%8A%A5%E4%BA%BA%E6%95%B0%E4%B8%8A%E9%99%90%3A9%3A1%3A80%3As.kbxsrs&otherFields=null`
	}

	return rp(options)
		.then(body => {
			let msg
			let design = []
			if (body.includes('可选课题')) {
				// const start = body.indexOf('innerHTML', 5000) + 13
				const end = body.indexOf('</table>', 6056) + 8
				const $ = cheerio.load(body.slice(5834, end))

				$('#mxh tr').each((i, value) => {
					const getTxt = num =>
						$(value)
							.children()
							.eq(num)
							.text()

					design.push({
						name: getTxt(2),
						college: getTxt(3),
						teacher: getTxt(4),
						tTitle: getTxt(5),
						limit: getTxt(6),
						selected: getTxt(7),
						// TODO: 前端添加毕业设计详情查看
						// id: value.attribs.ondblclick.slice(50, 82)
					})
				})
				msg = '获取成功'
			} else {
				msg = '获取失败'
			}
			if (!design.length) {
				msg = '没有更多数据'
			}
			return {
				code: 200,
				msg,
				design
			}
		})
		.catch(err => {
			console.error('网络错误', err)
			return {
        code: 400,
        msg: '抱歉，出现异常'
      }
		})
}
