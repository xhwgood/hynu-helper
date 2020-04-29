var DynamicNumber = {}
DynamicNumber.NumberList = {}

/**
 * 在指定的 DOM 元素中动态显示数值
 * @param elementId  :      DOM 元素ID
 * @param number     :      数值
 */
DynamicNumber.show = function (elementId, number) {
	// 1. 已建立过对象直接调用
	var dynaNum = this.NumberList[elementId]
	if (dynaNum) {
		dynaNum.step = 0
		dynaNum.desNumber = number
		dynaNum.render()
		return
	}

	// 2. 创建动态数字绘制对象
	dynaNum = new (function (_elementId) {
		this.elementId = _elementId
		this.preNumber = 0 // 变化过程值
		this.desNumber = 0 // 目标数值，最终显示值

		this.step = 0 // 变化步长，支持正向反向
		// 绘制过程
		this.render = function () {
			// （1）结束条件
			if (this.preNumber == this.desNumber) {
				this.step = 0
				return
			}

			// （2）步长设置（计划 2 秒完成 40*50=2000）
			if (this.step == 0) {
				this.step = Math.round((this.desNumber - this.preNumber) / 40)
				if (this.step == 0)
					this.step = this.desNumber - this.preNumber > 0 ? 1 : -1
			}

			// （3）走一步
			this.preNumber += this.step
			if (this.step < 0) {
				if (this.preNumber < this.desNumber) this.preNumber = this.desNumber
			} else {
				if (this.preNumber > this.desNumber) this.preNumber = this.desNumber
			}

			// （4）显示
			document.getElementById(this.elementId).innerHTML = this.preNumber

			// （5）每秒绘制 20 次（非精确值）
			var _this = this
			setTimeout(function () {
				_this.render()
			}, 50)
		}
	})(elementId)

	// 3. 登记绑定元素ID
	DynamicNumber.NumberList[elementId] = dynaNum

	// 4. 调用绘制
	dynaNum.step = 0
	dynaNum.desNumber = number
	dynaNum.render()
}
