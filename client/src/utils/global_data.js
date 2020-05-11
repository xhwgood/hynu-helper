const globalData = {}

export const set = (key, val) => {
  globalData[key] = val
}

export const get = key => globalData[key]
