// @ts-check
const cheerio = require('cheerio')

const weekTxt = ['', '一', '二', '三', '四', '五', '六', '日']
/**
 * @param {string} body
 */
exports.selectElective = body => {
  const $ = cheerio.load(body)
  const xxk_arr = []
  $('#mxh tr').each((i, value) => {
    /**
     * 获取文字
     * @param {number} num 
     */
    const getTxt = num => $(value).children().eq(num).text().trim()

    const $_detail = cheerio.load(value)
    const detail = $_detail('input').attr('onclick')
    const classID = detail.split("'")[1]
    const str = getTxt(8)
    const time = `每周${weekTxt[str.charAt(0)]} ${str.charAt(2)}~${str.charAt(6) ? str.charAt(6) : str.charAt(4)}节`
    const selected = Number(getTxt(4))
    /** 剩余可选 */
    const surplus = Number(getTxt(5))
    /** 总人数 */
    const all = selected + surplus
    /** 人数进度，估算两位小数 */
    const progress = ((selected / all) * 100).toFixed(2)
    /** 课程名 */
    const name = getTxt(1)
    /** TODO: 三选二课程 */
    const three = ['文学作品欣赏', '音乐鉴赏', '美术鉴赏']
    const item = {
      name,
      from: getTxt(2),
      credit: getTxt(3),
      selected,
      surplus,
      week: getTxt(7),
      time,
      place: getTxt(9),
      classID,
      // 前端用 AtProgress 组件，必须是 number 类型
      progress: Number(progress)
    }
    if (getTxt(6)) {
      item.teacher = getTxt(6)
    }

    xxk_arr.push(item)
  })
  xxk_arr.sort((a, b) => b.selected - a.selected)

  return {
    code: 200,
    xxk_arr
  }
}
