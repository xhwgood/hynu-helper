class NumberAnimate {
  constructor(opt) {
    const def = {
      from: 0, // 开始的数字
      to: 50, // 结束的数字
      decimals: 2, // 小数点后的位数
      onUpdate: () => {} // 更新时回调函数
    }
    this.opt = Object.assign(def, opt) // assign传入配置参数
    this.tempValue = this.opt.from // 累加变量值
    this.loopCount = 0 // 循环次数计数
    this.loops = 13 // 数字累加次数
    this.increment = (this.opt.to - this.opt.from) / this.loops // 每次累加的值
    this.interval = null // 计时器对象
    this.init()
  }
  init() {
    this.interval = setInterval(() => {
      this.updateTimer()
    }, 100)
  }

  updateTimer() {
    this.loopCount++
    this.tempValue = this.formatFloat(this.tempValue, this.increment).toFixed(2)
    if (this.loopCount >= this.loops) {
      clearInterval(this.interval)
      this.tempValue = this.opt.to
    }
    this.opt.onUpdate()
  }
  //解决 0.1+0.2 不等于 0.3 的小数累加精度问题
  formatFloat(num1, num2) {
    let baseNum, baseNum1, baseNum2
    try {
      baseNum1 = num1.toString().split('.')[1].length
    } catch (e) {
      baseNum1 = 0
    }
    try {
      baseNum2 = num2.toString().split('.')[1].length
    } catch (e) {
      baseNum2 = 0
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2))
    return (num1 * baseNum + num2 * baseNum) / baseNum
  }
}

export default NumberAnimate
