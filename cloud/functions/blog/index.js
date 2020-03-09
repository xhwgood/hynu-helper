// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
cloud.init()
const db = cloud.database()

const blog = db.collection('weibo')
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
	const app = new TcbRouter({
		event
	})

	app.router('list', async (ctx, next) => {
		const { keyword } = event
		let w = {}
		if (keyword.trim()) {
			w = {
				content: db.RegExp({
					regexp: keyword
				})
			}
		}
		let blogList = await blog
			.where(w)
			.skip(event.start)
			.limit(event.count)
			.orderBy('create_time', 'desc')
			.get()
			.then(res => {
				return res.data
			})
		ctx.body = blogList
	})

	app.router('detail', async (ctx, next) => {
		const { blogId } = event
		// 详情查询
		let detail = await blog
			.where({ _id: blogId })
			.get()
			.then(res => res.data)
		// 评论查询
		const results = await blog.count()
		const total = results.total
		let comments = { data: [] }
		if (total) {
			const batchTimes = Math.ceil(total / MAX_LIMIT)
			const tasks = []
			for (let i = 0; i < batchTimes; i++) {
				let promise = db
					.collection('blog-comment')
					.skip(i * MAX_LIMIT)
					.limit(MAX_LIMIT)
					.where({ blogId })
					.orderBy('createTime', 'desc')
					.get()
				tasks.push(promise)
				if (tasks.length) {
					comments = (await Promise.all(tasks)).reduce((acc, cur) => {
						return {
							data: acc.data.concat(cur.data)
						}
					})
				}
			}
		}
		ctx.body = {
			comments,
			detail
		}
	})

	const wxCtx = cloud.getWXContext()
	app.router('getList', async (ctx, next) => {
		ctx.body = await blog
			.where({
				_openid: wxCtx.OPENID
			})
			.skip(event.start)
			.limit(event.count)
			.orderBy('createTime', 'desc')
			.get()
			.then(res => {
				return res.data
			})
	})

	return app.serve()
}
