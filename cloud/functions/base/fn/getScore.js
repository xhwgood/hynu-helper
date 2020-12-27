const rp = require('request-promise')
const cheerio = require('cheerio')

exports.getScore = async (data, url) => {
  const { sessionid, termNums } = data

  const headers = {
    'content-type': 'application/x-www-form-urlencoded',
    Cookie: sessionid
  }
  const options = {
    method: 'POST',
    url: `${url}/xszqcjglAction.do?method=queryxscj`,
    headers
  }
  /** 总共要查询的页数 */
  let pageNums = termNums >= 7 ? termNums - 1 : termNums
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

  return rp(options)
    .then(async body => {
      if (body.includes('错误')) {
        return (res = {
          code: 401
        })
      } else {
        washData(body)
        /** 
         * 要查询的成绩页数
         * 如果是大四以上的话，大四没课，所以少查一页
         * 如果是大一到大三，就查学期数
         */
        const rp_arr = []
        for (let i = 2; i <= pageNums; i++) {
          const options_arr = {
            ...options,
            url: `${url}/xszqcjglAction.do?method=queryxscj&PageNum=${i}`
          }
          rp_arr.push(rp(options_arr))
        }
        await Promise.all(rp_arr).then(result => {
          result.forEach(element => washData(element))
        })
        // const code = score_arr.length ? 200 : 600
        let code = 600
        if (score_arr.length) {
          code = 200
          await getMoreScore(score_arr)
        }
        return (res = {
          code,
          score: {
            score_arr
          }
        })
      }
    })
    .catch(err => {
      console.log('网络错误或后台异常', err)
      return (res = {
        code: 401
      })
    })
}
