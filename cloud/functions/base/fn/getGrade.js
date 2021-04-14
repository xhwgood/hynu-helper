// @ts-check
const rp = require('request-promise')
const cheerio = require('cheerio')
const strToDate = require('../strToDate')
/**
 * @param {{
 *  sessionid: string
 * }} data 
 * @param {string} url 
 */
exports.getGrade = async (data, url) => {
  const { sessionid } = data

  const headers = {
    Cookie: sessionid
  }
  const options = {
    uri: `${url}/kjlbgl.do?method=findXskjcjXszq`,
    headers
  }

  return rp(options)
    .then(body => {
      let code
      const grade = []
      if (body.includes('错误')) {
        code = 401
      } else {
        const $ = cheerio.load(body)
        $('#mxh tr').each((i, value) => {
          const getTxt = num => $(value).children().eq(num).text().trim()

          grade.push({
            grade: getTxt(6),
            score: getTxt(9),
            time: strToDate(getTxt(13))
          })
          code = 200
        })
      }
      let msg
      if (grade.length == 0) {
        msg = '你还没有考级数据'
      } else {
        grade.reverse()
      }
      return {
        grade,
        code,
        msg
      }
    })
    .catch(err => {
      console.log('服务器内部错误：', err)
      return {
        code: 401
      }
    })
}
