const list = [
  ['大一上', '大一下'],
  ['大二上', '大二下'],
  ['大三上', '大三下'],
  ['大四上', '大四下']
]

const getTerm = username => {
  const num = Number(username.slice(0, 2))
  const year = Number(String(new Date().getFullYear()).slice(2))
  // 大于4：已经毕业
  // 等于4：大四
  const reduce = year - num > 4 ? 4 : year - num
  const obj = {}
  for (let i = 0; i < reduce + 1; i++) {
    if (list[i]) {
      obj[`20${num + i}-20${num + 1 + i}-1`] = list[i][0]
      obj[`20${num + i}-20${num + 1 + i}-2`] = list[i][1]
    }
  }
  const month = new Date().getMonth()
  if (month > 7 && reduce < 4) {
    delete obj[Object.keys(obj)[Object.keys(obj).length - 1]]
  }
  return obj
}
// 2016-2017-1: "大一上"
// 2016-2017-2: "大一下"
// 2017-2018-1: "大二上"
// 2017-2018-2: "大二下"
// 2018-2019-1: "大三上"
// 2018-2019-2: "大三下"
// 2019-2020-1: "大四上"
// 2019-2020-2: "大四下"
export default getTerm
