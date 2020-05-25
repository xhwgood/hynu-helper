const rp = require('request-promise')
const cheerio = require('cheerio')

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
        $ = cheerio.load(body)
        $('#mxh tr').each((i, value) => {
          const getTxt = num => $(value).children().eq(num).text().trim()
          const timeArr = getTxt(13).split('-')
          const time = `${timeArr[0]}年${timeArr[1]}月${timeArr[2]}日`

          grade.push({
            grade: getTxt(6),
            score: getTxt(9),
            time
          })
          code = 200
        })
      }
      return (res = {
        grade,
        code
      })
    })
    .catch(err => {
      console.log('服务器内部错误：', err)
      return (res = {
        code: 401,
        msg: ''
      })
    })
}
