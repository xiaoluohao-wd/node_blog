const Router=require('koa-router')
const router=new Router
const user=require('../controller/user')
const article=require('../controller/article')
//设计主页
router.get('/',user.keepLog,article.getArticleList)

// 主要用来处理返回  用户登录 用户注册
router.get(/^\/user\/(?=register|login)/, async (ctx) => {
   // show 为 true 则显示注册   false 显示登录
   const show = /register$/.test(ctx.path)
   await ctx.render("register", {show})
 })
//处理登录的post表单
router.post('/user/login',user.login)

//处理注册的post表单
router.post('/user/register',user.register)

//处理用户退出的请求
router.get('/user/logout', user.logout)

//显示文章的发表页面
router.get('/article',user.keepLog,article.showAddPage)

//点击发布把文章保存到数据库
router.post('/article',user.keepLog,article.add)

//文章列表分页 路由
router.get('/page/:page',article.getArticleList)

//文章详情路由
router.get('/article/:articlename',user.keepLog,article.details)

module.exports=router