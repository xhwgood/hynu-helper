const strToDate = str => {
  if (str) {
    const arr = str.split('-')
    return `${arr[0]}年${Number(arr[1])}月${Number(arr[2])}日`
  }
}

export default strToDate
