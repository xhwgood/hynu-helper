// @ts-check
const rp = require('request-promise')
const cheerio = require('cheerio')
/**
 * @param {{
 *  cookie: string
 * }} data
 * @param {string} url 
 * @param {string} host 
 */
module.exports = async ({ cookie }, url, host) => {
  const options = {
    uri: `${url}/kscj/cjcx_list?kksj=`,
    headers: {
      cookie,
      host
    }
  }

  try {
    const scores = []
    const res = await rp(options)
    if (res.includes('错误')) {
      return {
        code: 404
      }
    }
    const $ = cheerio.load(res)

    // 解析节点
    $('#dataList tr').each((i, value) => {
      // 跳过表头
      if (!i) {
        return
      }
      const getTxt = (/** @type {number} */ num) =>
        $(value)
          .children()
          .eq(num)
          .text()
          .trim()

      scores.push({
        term: getTxt(1),
        course: getTxt(3),
        score: getTxt(4),
        credit: getTxt(6),
        hour: getTxt(7),
        makeup: getTxt(11) != '正常考试',
      })
    })

    return {
      code: 200,
      scores
    }
  } catch (err) {
    return {
      code: 700,
      msg: '很抱歉，出现异常'
    }
  }
}
