const rp = require('request-promise')
const cheerio = require('cheerio')

exports.getScore = async (data, url) => {
  const { sessionid, termNums, username } = data
  const api = `${url}/xszqcjglAction.do?method=queryxscj`

  const headers = {
    'content-type': 'application/x-www-form-urlencoded',
    Cookie: sessionid
  }
  const options = {
    method: 'POST',
    url: api,
    headers
  }
  /** 
   * 要查询的成绩页数：
   * 大三下到大四，都查7页，基本都是60多门，其他年级就查学期数
   */
  let pageNums = termNums
  if (termNums == 8 || termNums == 6) {
    pageNums = 7
  }
  /** 成绩数组 */
  const score_arr = []
  /**
   * 将成绩相关数据取出来
   * @param {string} body 响应数据：HTML
   * @returns {array}
   */
  const washData = body => {
    const $ = cheerio.load(body)
    $('#mxh tr').each((i, value) => {
      const getTxt = num => $(value).children().eq(num).text()
      const $_detail = cheerio.load(value)
      const detail = $_detail('a').attr('onclick')
      let score = getTxt(5)
      let queryDetail
      if (detail) {
        // 获取整条字符串
        // 将最后的成绩删除，因为成绩可能为优良中，需要转义
        queryDetail = detail.split("'")[1]
        queryDetail = queryDetail.slice(0, queryDetail.lastIndexOf('='))
      } else {
        score = '缺考'
      }
      // 分类，如通识教育课程
      // sort: getTxt(7)
      score_arr.push({
        term: getTxt(3),
        course: getTxt(4),
        score,
        hour: getTxt(9),
        credit: getTxt(10),
        makeup: getTxt(11) != '正常考试',
        queryDetail
      })
    })
    return score_arr
  }
  /**
   * 是否获取下一页成绩
   * @param {any[]} score_arr 成绩数组
   */
  const getMoreScore = async (score_arr) => {
    // 只要当前的成绩是10的倍数，就认为有下一页
    if (score_arr.length % 10 == 0) {
      pageNums += 1
      const res = await rp({
        ...options,
        url: `${url}/xszqcjglAction.do?method=queryxscj&PageNum=${pageNums}`
      })
      /** 递归调用 */
      await getMoreScore(washData(res))
    }
  }
  /** 并发请求数组 */
  const rp_arr = [rp(options)]
  for (let i = 2; i <= pageNums; i++) {
    const options_arr = {
      ...options,
      url: `${api}&PageNum=${i}`
    }
    rp_arr.push(rp(options_arr))
  }

  const results = await Promise.all(rp_arr).catch(err => {
    console.log('网络错误或后台异常', err)
    if (username.startsWith('20') && err.statusCode == 500) {
      return {
        code: 700,
        msg: '很抱歉，教务处出现异常，部分大一同学暂时无法查询成绩'
      }
    }
    return {
      code: 401
    }
  })
  if (results) {
    // 如果第一页有错误就直接返回报错
    if (results[0].includes('错误')) {
      return {
        code: 401
      }
    }
    results.forEach(result => washData(result))
    let code = 600
    if (score_arr.length) {
      code = 200
      await getMoreScore(score_arr)
    }
    return {
      code,
      score: {
        score_arr
      }
    }
  } else {
    return {
      code: 401
    }
  }
}
