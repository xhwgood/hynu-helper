// @ts-check
const rp = require('request-promise')
const cheerio = require('cheerio')

const weekTxt = ['', '一', '二', '三', '四', '五', '六', '日']
/**
 * @param {{
 *  sessionid: string
 *  term: string
 * }} data 
 * @param {string} url 
 */
exports.allSelected = async (data, url) => {
  const { sessionid, term } = data

  const headers = {
    Cookie: sessionid
  }
  const options = {
    url: `${url}/xkglAction.do?method=toFindxsyxkc&xnxq01id=${term}&zzdxklbname=1&jx0502zbid=35`,
    headers
  }

  return rp(options)
    .then(body => {
      if (body.includes('错误')) {
        return {
          code: 700,
          msg: '获取失败，请重新登录'
        }
      } else {
        let msg = '没有查到你的选修课呢'
        const $ = cheerio.load(body)
        const selected = []
        $('#mxh tr').each((i, value) => {
          const getTxt = num => $(value).children().eq(num).text().trim()
          /** 当前课程名 */
          const name = getTxt(4)

          /** 教务处所有选修课列表 */
          const jwc_arr = [
            '国学智慧',
            '婚姻家庭法',
            '口才艺术与社交礼仪',
            '美术鉴赏',
            '商标法素质课',
            '食品安全与日常饮食',
            '书法鉴赏',
            '宋崇导演教你拍摄微电影',
            '网络环境下的知识产权保护',
            '文学作品欣赏',
            '学术基本要素：专业论文写作',
            '移动互联网时代的信息安全与防护',
            '音乐鉴赏',
            '影视鉴赏',
            '知识产权法律基础',
            '中华传统文化中的音乐故事',
            '中外比较文学研究专题',
            '著作权',
            '专利代理实务素质课',
            '专利信息检索',
            '魅力科学',
            '个人理财管理',
            '女大学生社交礼仪',
            '生活中的会计',
            '环境与健康素质课',
            '古村古镇文化遗产鉴赏素质课',
            '摄影技艺与赏析',
            '宾卡斯油画技法',
            '大学生婚恋与性爱观教育',
            '大学生恋爱与性心理调适',
            '性格解析与人际沟通',
            '人体的奥秘与保健',
            '饮食营养与健康',
            '插花艺术与赏析',
            '船山学与湖湘文化',
            '英语电影赏析',
            '中国传统文化中的音乐故事',
            '人工智能',
            '大学启示录：如何读大学？',
            '生命安全与救援',
            '世界地理',
            '从爱因斯坦到霍金的宇宙',
            '功能食品学',
            '大学英语IV（校选）',
            '现代公益广告鉴赏',
            '儒学与修身（校选）',
            '专利法（校选）',
            '专利电子申请',
            '外观设计专利',
            '发明专利申请与审查',
            '专利申请的审查程序及手续'
          ]
          if (jwc_arr.includes(name)) {
            msg = null
            let time = getTxt(9)
            if (weekTxt[time.charAt(0)]) {
              time = `每周${weekTxt[time.charAt(0)]} ${time.charAt(2)}~${time.charAt(6) ? time.charAt(6) : time.charAt(4)}节`
            } else {
              console.log('出现异常：', time)
            }
            const $_detail = cheerio.load(value)
            const detail = $_detail('a').attr('onclick')
            const queryDetail = detail.split("'")[1]
            selected.push({
              classID: queryDetail,
              name,
              from: getTxt(5),
              teacher: getTxt(7),
              week: getTxt(8),
              time,
              mySelected: true
            })
            return false
          }
        })

        return {
          code: 205,
          selected,
          msg
        }
      }
    })
    .catch(err => {
      console.log('出现异常', err)
      return {
        code: 500,
        msg: '抱歉，出现异常'
      }
    })
}
