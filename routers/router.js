const Router=require('koa-router')
const router=new Router
const user=require('../controller/user')
const article=require('../controller/article')
const comment=require('../controller/comments')
const admin=require('../controller/admin')
const upload =require('../util/upload')
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

//点击发表文章评论
router.post('/comment',comment.addComment)

//个人中心路由
router.get('/admin/:id',user.keepLog,admin.index)

//上传头像路由
router.post('/upload',user.keepLog,upload.single('file'),user.upload)

//评论管理路由
router.get('/user/comments',user.keepLog,comment.comlist)

//后台删除评论
router.del('/comment/:id',comment.del)

//文章管理路由
router.get("/user/articles", user.keepLog, article.artlist)

// 后台：删除用户评论
router.del("/article/:id", user.keepLog, article.del)

//用户管理路由
router.get('/user/users',user.keepLog,user.userlist)

//删除用户的请求
router.del('/user/:user',user.keepLog,user.del)

//404页面
router.get('*',async ctx=>{
   await ctx.render('404',{title:'404'})
})


module.exports=router