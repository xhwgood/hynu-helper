const cheerio = require('cheerio')

exports.selectElective = body => {
  $ = cheerio.load(body)
  const xxk_arr = []
  $('#mxh tr').each((i, value) => {
    const getTxt = num => $(value).children().eq(num).text().trim()
    const $_detail = cheerio.load(value)
    const detail = $_detail('input').attr('onclick')
    const classID = detail.split("'")[1]
    const str = getTxt(8)
    const time = `每周${str.charAt(0)} ${str.charAt(2)}~${str.charAt(6)}节`
    const selected = Number(getTxt(4))
    /** 剩余可选 */
    const surplus = Number(getTxt(5))
    /** 总人数 */
    const all = selected + surplus
    /** 人数进度，估算两位小数 */
    const progress = (selected / all).toFixed(2) * 100
    /** 课程名 */
    let name = getTxt(1)
    /** 三选二课程 */
    const three = ['文学作品欣赏', '音乐鉴赏', '美术鉴赏']
    if (three.includes(name)) {
      name += '（三选二）'
    }

    xxk_arr.push({
      name,
      from: getTxt(2),
      credit: getTxt(3),
      selected,
      surplus,
      teacher: getTxt(6),
      week: getTxt(7),
      time,
      place: getTxt(9),
      /** 限制性别，好像没啥用 */
      sex: getTxt(12),
      classID,
      bottomShow: false,
      progress,
      all
    })
  })
  xxk_arr.sort((a, b) => b.selected - a.selected)

  return {
    code: 200,
    xxk_arr
  }
}
