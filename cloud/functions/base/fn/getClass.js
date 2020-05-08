const rp = require('request-promise')
const cheerio = require('cheerio')

exports.getClass = async (data, url) => {
  const { sessionid, xnxqh } = data

  if (!xnxqh) {
    return (res = {
      code: 401
    })
  }
  const headers = {
    Cookie: sessionid
  }
  const options = {
    url: `${url}/tkglAction.do?method=goListKbByXs&xnxqh=${xnxqh}`,
    headers
  }

  const myClass = []
  return rp(options)
    .then(body => {
      $ = cheerio.load(body)
      // 一天最多五节大课（包括小课）
      for (let i = 1; i < 6; i++) {
        // 一周七天，设定周一为第一天
        for (let j = 1; j < 8; j++) {
          if ($(`#${i}-${j}-2`).text().includes('节')) {
            // 若有两节课，则课程名、老师、上课周都不同，但节次和地点相同
            let name = $(`#${i}-${j}-1`).text().trim() // 取得课程名
            const hasTwo = name.includes(',')

            const wl = $(`#${i}-${j}-2 nobr`)
            const placeAndSec = wl.text() // 有周、节次、地点

            const place_true = wl['1'].children[0].next.data
            const place = name.includes('体育') ? '暂无教室' : place_true

            const section = /^.*\[(.*)\].*/
              .exec(placeAndSec)[1]
              .replace(/-|节/g, '')

            const reg = /(\d{1,2})-(\d{1,2})/
            function toArray(str) {
              const a = []
              if (str.includes('-')) {
                // 若是几周范围内上课
                const b = reg.exec(str)
                const b1 = Number(b[1])
                const b2 = Number(b[2])
                if (str.includes('单')) {
                  // 若是单周才上课
                  for (let i = b1; i <= b2; i++) {
                    if (i % 2 == 1) {
                      a.push(i)
                    }
                  }
                } else if (str.includes('双')) {
                  // 若是双周才上课
                  for (let i = b1; i <= b2; i++) {
                    if (i % 2 == 0) {
                      a.push(i)
                    }
                  }
                } else {
                  // 范围内所有周都上课
                  for (let i = b1; i <= b2; i++) {
                    a.push(i)
                  }
                }
              } else {
                // 若是单个数字
                a.push(Number(str))
              }
              return a
            }

            let week = []
            let weekTest = wl['0'].children[0].data.trim() // 有周、节、地点
            let weekTemp = weekTest
              .slice(0, weekTest.indexOf('['))
              .replace('周', '')
            let regStr = weekTemp.split(/,/) // 用逗号分割，如'2-4,6-16'
            regStr.forEach(item => week.push(...toArray(item)))

            if (wl.length > 3) {
              // 如果上课周不是连续的，那么此处还要继续加
              weekTest = wl['2'].children[0].data.trim()
              weekTemp = weekTest
                .slice(0, weekTest.indexOf('['))
                .replace('周', '')
              regStr = weekTemp.split(/,/)
              regStr.forEach(item => week.push(...toArray(item)))
            }

            const teacher = place.includes('无')
              ? null
              : $(`#${i}-${j}-2`)['0'].children[3].next.data.replace('GD', '')

            let oriWeek = weekTest.slice(0, weekTest.indexOf('['))

            if (hasTwo) {
              const name_arr = name.split(',')
              name = name_arr[0]
              const name2 = name_arr[1]

              const all = $(`#${i}-${j}-2`).text()
              const all_arr = all.split(place_true)
              const classtea = all_arr[0].split(/\s/)
              const classtea2 = all_arr[1].split(/\s/)
              oriWeek = classtea[3].slice(0, classtea[3].indexOf('周'))
              week = toArray(oriWeek)
              oriWeek += '周'

              const teacher2 = classtea2[0].slice(
                classtea2[0].lastIndexOf('班') + 1
              )
              let oriWeek2 = classtea2[2].slice(0, classtea2[2].indexOf('周'))
              const week2 = toArray(oriWeek2)
              oriWeek2 += '周'
              const course2 = {
                name: name2,
                place,
                week: week2,
                oriWeek: oriWeek2,
                section,
                teacher: teacher2.replace('GD', ''),
                day: `${j}`
              }
              myClass.push(course2)
            }

            // 一维数组
            const course = {
              name,
              place,
              week,
              oriWeek,
              section,
              teacher,
              day: `${j}`
            }
            // 周日重复的美术课则不再插入数组
            if (section != '0204') {
              myClass.push(course)
            }
          }
        }
      }
      let msg = '获取课程成功'
      if (!myClass.length) {
        msg = '本学期课表为空'
      }
      return (res = {
        code: 200,
        msg,
        myClass
      })
    })
    .catch(() => {
      return (res = { code: 401 })
    })
}
